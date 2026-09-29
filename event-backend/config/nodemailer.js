const nodemailer = require("nodemailer");
const dns = require("dns");

// Force Node to prefer IPv4 DNS resolution
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

const sendOTPEmail = async (email, otp) => {
    const mailUser = process.env.MAIL_USER ? process.env.MAIL_USER.trim() : "";
    const mailPass = process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/^"|"$/g, '').trim() : "";
    const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
    const brevoApiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : "";

    console.log(`\n📧 [EMAIL ATTEMPT] Preparing to send OTP code to: ${email}`);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eventopia Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
            <tr>
                <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); overflow: hidden;">
                        <tr>
                            <td style="height: 4px; background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);"></td>
                        </tr>
                        <tr>
                            <td style="padding: 32px 28px 28px 28px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                                                <span style="background: #4f46e5; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 14px; margin-right: 6px;">E</span>
                                                Eventopia
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #0f172a; line-height: 1.3;">Verify your email address</h1>
                                
                                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #475569;">
                                    Use the 6-digit verification code below to complete your account setup on Eventopia.
                                </p>

                                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
                                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; display: block; margin-bottom: 8px;">VERIFICATION CODE</span>
                                    <div style="font-family: 'SF Mono', 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5; padding-left: 8px;">
                                        ${otp}
                                    </div>
                                </div>

                                <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; text-align: center; line-height: 1.4;">
                                    This code will expire in <strong>5 minutes</strong>. Do not share this code with anyone.
                                </p>

                                <div style="border-top: 1px solid #f1f5f9; margin-bottom: 20px;"></div>

                                <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                                    If you didn't request this code, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #f1f5f9; text-align: center;">
                                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                    © ${new Date().getFullYear()} Eventopia • Campus Event Management System
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // Attempt 1: Resend HTTPS API (Port 443 - Bypasses Render SMTP port blocking)
    if (resendApiKey) {
        try {
            console.log(`🚀 [EMAIL ATTEMPT 1] Sending via Resend HTTPS API (Port 443)...`);
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "Eventopia <onboarding@resend.dev>",
                    to: [email],
                    subject: "Your Eventopia Email Verification Code",
                    html: htmlContent
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ [RESEND SUCCESS] OTP Email delivered to ${email}! ID: ${data.id}`);
                return data;
            } else {
                console.warn(`⚠️ [RESEND API ERROR]: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            console.warn(`⚠️ [RESEND FAILED]: ${err.message}`);
        }
    }

    // Attempt 2: Brevo (Sendinblue) HTTPS API (Port 443 - Bypasses Render SMTP port blocking)
    if (brevoApiKey) {
        try {
            console.log(`🚀 [EMAIL ATTEMPT 2] Sending via Brevo HTTPS API (Port 443)...`);
            const res = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": brevoApiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender: { name: "Eventopia", email: mailUser || "noreply@eventopia.com" },
                    to: [{ email: email }],
                    subject: "Your Eventopia Email Verification Code",
                    htmlContent: htmlContent
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ [BREVO SUCCESS] OTP Email delivered to ${email}! MessageID: ${data.messageId}`);
                return data;
            } else {
                console.warn(`⚠️ [BREVO API ERROR]: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            console.warn(`⚠️ [BREVO FAILED]: ${err.message}`);
        }
    }

    // Attempt 3: Direct SMTP (Port 587 / 465) - Works on local environment or unblocked servers
    if (mailUser && mailPass) {
        const mailOptions = {
            from: `"Eventopia" <${mailUser}>`,
            to: email,
            subject: "Your Eventopia Email Verification Code",
            html: htmlContent,
        };

        // Try Port 587 TLS
        try {
            const transporter587 = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: { user: mailUser, pass: mailPass },
                family: 4,
                connectionTimeout: 6000,
                greetingTimeout: 6000,
                socketTimeout: 6000,
                tls: { rejectUnauthorized: false }
            });

            const info = await transporter587.sendMail(mailOptions);
            console.log(`✅ [NODEMAILER SUCCESS - TLS 587] OTP Email delivered to ${email}! MessageID: ${info.messageId}`);
            return info;
        } catch (tlsErr) {
            console.warn(`⚠️ [NODEMAILER TLS 587 FAILED]: ${tlsErr.message}`);
        }

        // Try Port 465 SSL
        try {
            const transporterSSL = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: { user: mailUser, pass: mailPass },
                family: 4,
                connectionTimeout: 6000,
                greetingTimeout: 6000,
                socketTimeout: 6000,
                tls: { rejectUnauthorized: false }
            });

            const info = await transporterSSL.sendMail(mailOptions);
            console.log(`✅ [NODEMAILER SUCCESS - SSL 465] OTP Email delivered to ${email}! MessageID: ${info.messageId}`);
            return info;
        } catch (sslErr) {
            console.warn(`⚠️ [NODEMAILER SSL 465 FAILED]: ${sslErr.message}`);
        }
    }

    console.error(`\n❌ [EMAIL CRITICAL ERROR] All email attempts failed!`);
    console.error(`👉 NOTE: Render free tier blocks outbound SMTP ports 25, 465, and 587 by default.`);
    console.error(`👉 Solution: Set 'RESEND_API_KEY' or 'BREVO_API_KEY' in Render Environment Variables to send emails over Port 443 (HTTPS)!\n`);
    return false;
};

module.exports = { sendOTPEmail };

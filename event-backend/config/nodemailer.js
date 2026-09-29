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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0f172a; border-radius: 16px; border: 1px solid #334155; color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: 800;">Eventopia</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Email Verification Code</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #cbd5e1; font-size: 15px; margin-bottom: 16px;">Use the following 6-digit OTP to complete your email verification:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; padding: 12px 24px; background: rgba(56, 189, 248, 0.1); border-radius: 8px; display: inline-block; margin: 8px 0;">
                ${otp}
            </div>
            <p style="color: #f43f5e; font-size: 13px; margin-top: 16px;">⏱️ This code will expire in <strong>5 minutes</strong>.</p>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">If you did not request this verification code, please ignore this email.</p>
    </div>
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

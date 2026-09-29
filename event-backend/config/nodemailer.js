const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
    const mailUser = process.env.MAIL_USER ? process.env.MAIL_USER.trim() : "";
    const mailPass = process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/^"|"$/g, '').trim() : "";

    console.log(`\n📧 [NODEMAILER ATTEMPT] Sending email to: ${email}`);
    console.log(`📧 [NODEMAILER CONFIG] MAIL_USER: "${mailUser}", MAIL_PASS provided: ${Boolean(mailPass)}`);

    if (!mailUser || !mailPass) {
        console.error(`\n❌ [NODEMAILER ERROR] Email NOT sent. MAIL_USER or MAIL_PASS environment variable is missing on server!`);
        console.error(`👉 Please set MAIL_USER and MAIL_PASS in Render Dashboard Environment Variables.\n`);
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // TLS via STARTTLS
            auth: {
                user: mailUser,
                pass: mailPass,
            },
            family: 4, // Force IPv4 to bypass Render's IPv6 ENETUNREACH error
            tls: {
                rejectUnauthorized: false
            }
        });

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

        const mailOptions = {
            from: `"Eventopia" <${mailUser}>`,
            to: email,
            subject: "Your Eventopia Email Verification Code",
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [NODEMAILER SUCCESS] OTP Email delivered to ${email}! MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`\n❌ [NODEMAILER CRITICAL ERROR] Failed to deliver email to ${email}:`);
        console.error(`👉 Code: ${error.code || 'N/A'}`);
        console.error(`👉 Message: ${error.message}`);
        return false;
    }
};

module.exports = { sendOTPEmail };

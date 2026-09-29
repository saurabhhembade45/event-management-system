const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
    const mailUser = process.env.MAIL_USER ? process.env.MAIL_USER.trim() : "";
    const mailPass = process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/^"|"$/g, '').trim() : "";

    if (!mailUser || !mailPass) {
        console.warn(`\n⚠️  [NODEMAILER NOTICE] Email sending skipped. MAIL_USER or MAIL_PASS in environment variables is empty.`);
        console.warn(`👉 MAIL_USER: "${mailUser}", MAIL_PASS is empty.\n`);
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: mailUser,
                pass: mailPass,
            },
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
        console.log(`✅ [NODEMAILER SUCCESS] OTP Email sent to ${email} (MessageID: ${info.messageId})`);
        return info;
    } catch (error) {
        console.error(`❌ [NODEMAILER ERROR] Failed sending email to ${email}:`, error.message);
        return false;
    }
};

module.exports = { sendOTPEmail };

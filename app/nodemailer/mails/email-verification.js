const config = require("../../config");
const { signJWT } = require("../../helpers/jwt");

async function emailVerification({ transporter, user, from, to }) {
    const token = signJWT({ id: user.id }, process.env.EMAIL_SECRET, "15m");

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="text-align: center; color: #007bff;">Verify your email</h1>
        <p>Hi ${user?.username || 'User'},</p>
        <p>Click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${config?.pages?.frontend?.base}${config?.pages?.frontend?.verifyEmail}?token=${encodeURIComponent(token)}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Verify Email
            </a>
        </div>
        <p style="color: #6c757d;">This link will expire in 15 minutes.</p>
    </div>
`;


    await transporter.sendMail({
        from,
        to,
        subject: "Verify your email",
        html,
    });
}

module.exports = emailVerification;

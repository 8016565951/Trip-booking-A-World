const { transporter } = require("../transporter");

// Bookingstatus-update.js
async function statusUpdateMail({ user, booking, status }) {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h1 style="text-align: center; color: #333;">Booking Status Update</h1>
            <p style="font-size: 16px;">Hi ${user.username || "User"},</p> <p style="font-size: 16px;">Your  ${user.email},</p>
            <p style="font-size: 16px;">Your booking with ID <strong>${booking.bookingId}</strong> has been updated to <strong>${status}</strong>.</p>
            
            <h2 style="font-size: 18px; color: #555;">Service Details:</h2>
            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; background-color: #fff;">
                
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Service Name:</strong> ${booking.serviceName}</li>
                    <li><strong>Price:</strong> $${booking.servicePrice}</li>
                   
                    <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
                    <li><strong>Address:</strong> ${booking.address}</li>
                </ul>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: "your-email@example.com",
        to: user.email,
        subject: "Booking Status Update",
        html,
    });
}

module.exports = statusUpdateMail;

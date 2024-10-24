async function productMail({ transporter, user, from, to, products }) {
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #333;">Products List</h1>
            <p>Hi ${user.username},</p>
            <p>Here is the list of products:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f4f4f4;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Image</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Duration</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Category</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${products
                        .map(
                            (product) => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    <img src="${product.productImage}" alt="${product.name}" style="max-width: 100px; height: auto;" />
                                </td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${product._id}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${product.duration}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${product.category.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${product.price}</td>
                            </tr>
                        `
                        )
                        .join("")}
                </tbody>
            </table>
            <p style="margin-top: 20px;">Thank you for your interest in our products!</p>
        </div>
    `;

    await transporter.sendMail({
        from,
        to,
        subject: "Products List",
        html,
    });
}

module.exports = productMail;

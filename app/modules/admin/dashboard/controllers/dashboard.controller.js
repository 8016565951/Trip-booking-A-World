const { handleError } = require("../../../../helpers/utils");
const userRepo = require("../../../api/users/repositories/user.repo");
const categoryRepo = require("../../../api/categories/repositories/category.repo");
const productRepo = require("../../../api/products/repositories/product.repo");
const user = require("../../../api/users/models/user");
const Booking = require("../../../api/booking/model/booking");
const blogRepo = require("../../../api/blog/repository/blog.repo");
const ContactRepository =require("../../../api/contact/repository/contact.repo")

class DashboardController {
    statsUI = async (req, res) => {
        try {
            const users = await userRepo.get();
            const categories = await categoryRepo.get();
            const products = await productRepo.get();
            const booking =await Booking.find()
            const blog = await blogRepo.getAllBlogs()
            const contact = await ContactRepository.getContact()
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            if(User.role !== "admin")
            {
                res.redirect("/dashboard/admin/auth/signin")
            }
          

            return res.render("dashboard/views/dashboard", {
                title: "Dashboard",
                stats: {
                    users: users.length,
                    categories: categories.length,
                    products: products.length,
                    bookings:booking.length,
                    blogs:blog.length,
                    constcts:contact.length
                },
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new DashboardController();

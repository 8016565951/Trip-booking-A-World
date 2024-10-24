const { handleError } = require("../../../../helpers/utils");
const productRepo = require("../../../api/products/repositories/product.repo");
const bannerRepository = require("../../../api/banner/repository/banner.repository");
const aboutRepository = require("../../../api/about/repository/about.repository");
const categoryRepo = require("../../../api/categories/repositories/category.repo");
const { findOne } = require("../../../api/blog/model/blog");
const user = require("../../../api/users/models/user");
const BlogRepository = require("../../../api/blog/repository/blog.repo");

class HomeController {
    listUI = async (req, res) => {
        const { page = 1 } = req.query;
        try {
            const Banner = await bannerRepository.getBanner();
            const about = await aboutRepository.getAbout();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            const products = await productRepo.getInfinite({
                options: { page, limit: 3 },
            });
            const categories = await categoryRepo.get();
            const blogs = await BlogRepository.getAllBlogs();

            return res.render("home/views/home", {
                title: "Home",
                banners: Banner,
                products,
                about,
                categories,
                blogs,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new HomeController();

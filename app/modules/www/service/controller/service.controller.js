const { handleError } = require("../../../../helpers/utils");
const category = require("../../../api/categories/models/category");
const categoryRepo = require("../../../api/categories/repositories/category.repo");
const productRepo = require("../../../api/products/repositories/product.repo");
const user = require("../../../api/users/models/user");
class ServiceController {
    serviceui = async (req, res) => {
        const { page = 1 } = req.query; // Fetch the page number from query params
        try {
            const products = await productRepo.getInfinite({
                options: { page, limit: 10 },
            });
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const categories = await categoryRepo.get();
            res.render("service/views/service", {
                title: "services",
                categories,
                products,
                User,
            });
        } catch (error) {
            console.log(error);
            return handleError(res, error);
        }
    };
    searchProductsByCategory = async (req, res) => {
        const categoryId = req.query.category;
        try {
            const products =
                await productRepo.fetchProductsByCategorySearch(categoryId);

            const category = await categoryRepo.getCategoryById(categoryId);
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            const procucctive = await productRepo.get();

            res.render("service/views/categoryScearch", {
                products,
                category,
                User,
                procucctive,
            });
        } catch (error) {
            handleError(res, error);
            return res.redirect("/service");
        }
    };
}

module.exports = new ServiceController();

const { AppError } = require("../../../../helpers");
const { handleError } = require("../../../../helpers/utils");
const {
    createCategorySchema,
    updateCategorySchema,
} = require("../../../../validations");
const categoryRepo = require("../../../api/categories/repositories/category.repo");
const productRepo = require("../../../api/products/repositories/product.repo");
const user = require("../../../api/users/models/user");

class CategoryController {
    listUI = async (req, res) => {
        try {
            const categories = await categoryRepo.get();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            return res.render("categories/views/list", {
                title: "Categories",
                categories,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createUI = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            return res.render("categories/views/create", {
                title: "Create Category",
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateUI = async (req, res) => {
        try {
            const { id } = req.params;

            const category = await categoryRepo.getCategoryById(id);
            if (!category)
                throw new AppError("Category not found", "NOT_FOUND");
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            return res.render("categories/views/edit", {
                title: `Edit ${category.name}`,
                category,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createCategory = async (req, res) => {
        try {
            const { error, value } = createCategorySchema.validate(req.body);
            if (error) throw error;

            const existingCategory = await categoryRepo.getCategoryByName(
                value.name
            );
            if (existingCategory)
                throw new AppError("Category already exists", "CONFLICT");

            await categoryRepo.createCategory(value);

            return res.redirect(generateDashUrl("category.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { error, value } = updateCategorySchema.validate(req.body);
            if (error) throw error;

            const category = await categoryRepo.getCategoryById(id);
            if (!category)
                throw new AppError("Category not found", "NOT_FOUND");

            if (value.name) {
                const existingCategory = await categoryRepo.getCategoryByName(
                    value.name
                );
                if (existingCategory)
                    throw new AppError("Category already exists", "CONFLICT");
            }

            await categoryRepo.updateCategory(id, value);

            return res.redirect(generateDashUrl("category.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;

            const category = await categoryRepo.getCategoryById(id);
            if (!category)
                throw new AppError("Category not found", "NOT_FOUND");

            await categoryRepo.deleteCategory(id);
            await productRepo.deleteByCategory(id);

            return res.redirect(generateDashUrl("category.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new CategoryController();

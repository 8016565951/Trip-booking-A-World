const { AppError } = require("../../../../helpers");
const { CResponse, handleError } = require("../../../../helpers/utils");
const {
    queryInifniteCategorySchema,
    createCategorySchema,
    updateCategorySchema,
} = require("../../../../validations");
const productRepo = require("../../products/repositories/product.repo");
const categoryRepo = require("../repositories/category.repo");

class CategoryController {
    getCategories = async (req, res) => {
        try {
            const { error, value } = queryInifniteCategorySchema.validate(
                req.query
            );
            if (error) throw error;

            const { page, limit, paginated } = value;

            if (!paginated) {
                const categories = await categoryRepo.get();

                return CResponse({
                    res,
                    message: "OK",
                    data: categories,
                });
            } else {
                const categories = await categoryRepo.getInfinite({
                    options: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: categories,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getCategory = async (req, res) => {
        try {
            const { id } = req.params;

            const category = await categoryRepo.getCategoryById(id);
            if (!category)
                throw new AppError("Category not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: category,
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

            const category = await categoryRepo.createCategory(value);

            return CResponse({
                res,
                message: "CREATED",
                data: category,
            });
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

            return CResponse({
                res,
                message: "OK",
            });
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

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new CategoryController();

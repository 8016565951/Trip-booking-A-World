const { AppError } = require("../../../../helpers");
const { handleError } = require("../../../../helpers/utils");
const { mailer } = require("../../../../nodemailer");
const {
    createProductSchema,
    updateProductSchema,
    activeProductSchema,
} = require("../../../../validations");
const categoryRepo = require("../../../api/categories/repositories/category.repo");
const productRepo = require("../../../api/products/repositories/product.repo");
const userRepo = require("../../../api/users/repositories/user.repo");
const path = require("path");
const fs = require("fs");
const user = require("../../../api/users/models/user");

class ProductController {
    listUI = async (req, res) => {
        try {
            const products = await productRepo.get();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            return res.render("products/views/list", {
                title: "Products",
                products,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createUI = async (req, res) => {
        try {
            const categories = await categoryRepo.get();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            return res.render("products/views/create", {
                title: "Create Product",
                categories,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateUI = async (req, res) => {
        try {
            const { id } = req.params;

            const product = await productRepo.getById(id);
            if (!product) throw new AppError("Product not found", "NOT_FOUND");
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            const categories = await categoryRepo.get();

            return res.render("products/views/edit", {
                title: `Edit ${product.name}`,
                product,
                categories,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    getProductsInEmail = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const user = await userRepo.getById(userId);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            const products = await productRepo.get();

            await mailer.sendProductsList({
                user: {
                    email: user.email,
                    username: user.username,
                },
                products,
            });

            return res.redirect(generateDashUrl("products.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };

    createProduct = async (req, res) => {
        try {
            const { error, value } = createProductSchema.validate(req.body);
            if (error) throw error;

            const productImage = req.file ? req.file.path : null;
            value.productImage = productImage;

            const existingCategory = await categoryRepo.getCategoryById(
                value.categoryId
            );
            if (!existingCategory)
                throw new AppError("Category not found", "NOT_FOUND");

            const product = await productRepo.create({
                ...value,
                productImage,
            });

            console.log(product);

            return res.redirect(generateDashUrl("products.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const { error, value } = updateProductSchema.validate(req.body);
            if (error) throw error;

            const productImage = req.file
                ? req.file.path
                : req.body.productImage;

            if (value.categoryId) {
                const existingCategory = await categoryRepo.getCategoryById(
                    value.categoryId
                );
                if (!existingCategory)
                    throw new AppError("Category not found", "NOT_FOUND");
            }

            const existingProduct = await productRepo.getById(id);
            if (!existingProduct)
                throw new AppError("Product not found", "NOT_FOUND");

            if (req.file && existingProduct.productImage) {
                const oldImagePath = path.join(
                    __dirname,
                    "../../../../../",
                    "uploads/images/products",
                    path.basename(existingProduct.productImage)
                );
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.log("Error deleting old image:", err);
                    } else {
                        console.log("Old image deleted successfully");
                    }
                });
                console.log("Old image deleted successfully" + oldImagePath);
            }

            // Update the product with the new data and image
            const updatedProduct = await productRepo.update(id, {
                ...value,
                productImage,
            });
            console.log(updatedProduct);

            // Redirect to the product list UI
            return res.redirect(generateDashUrl("products.list.ui"));
        } catch (err) {
            console.log(err);
            return handleError(err, res);
        }
    };

    deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;

            const existingProduct = await productRepo.getById(id);
            if (!existingProduct)
                throw new AppError("Product not found", "NOT_FOUND");

            const oldImagePath = existingProduct.productImage;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            await productRepo.delete(id);

            return res.redirect(generateDashUrl("products.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };
    activateProduct = async (req, res) => {
        try {
            const id  = req.params.id;
            const product = await productRepo.toggleIsActive(id);
            console.log(product);
            return res.redirect(generateDashUrl("products.list.ui"));
        } catch (err) {
            console.log(err);
            return handleError(err, res);
        }
    };
}

module.exports = new ProductController();

const { AppError } = require("../../../../helpers");
const { CResponse, handleError } = require("../../../../helpers/utils");
const {
    queryInifniteProductSchema,
    createProductSchema,
    updateProductSchema,
} = require("../../../../validations");
const productRepo = require("../repositories/product.repo");
const userRepo = require("../../users/repositories/user.repo");
const { mailer } = require("../../../../nodemailer");
const categoryRepo = require("../../categories/repositories/category.repo");
const path = require("path");
const fs = require("fs");

class ProductController {
    getProducts = async (req, res) => {
        try {
            const { error, value } = queryInifniteProductSchema.validate(
                req.query
            );
            if (error) throw error;

            const { page, limit, cId, paginated, duration, type } = value;

            if (!paginated) {
                const products = await productRepo.get({
                    filter: {
                        ...(cId && {
                            $expr: {
                                $eq: [
                                    "$categoryId",
                                    {
                                        $toObjectId: cId,
                                    },
                                ],
                            },
                        }),
                        ...(duration && {
                            duration: {
                                [`$${type}`]: parseInt(duration),
                            },
                        }),
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: products,
                });
            } else {
                const products = await productRepo.getInfinite({
                    filter: {
                        ...(cId && {
                            $expr: {
                                $eq: [
                                    "$categoryId",
                                    {
                                        $toObjectId: cId,
                                    },
                                ],
                            },
                        }),
                        ...(duration && {
                            duration: {
                                [`$${type}`]: parseInt(duration),
                            },
                        }),
                    },
                    options: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: products,
                });
            }
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

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    getProduct = async (req, res) => {
        try {
            const { id } = req.params;

            const product = await productRepo.getById(id);
            if (!product) throw new AppError("Product not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: product,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createProduct = async (req, res) => {
        try {
            const { error, value } = createProductSchema.validate(req.body);
            if (error) throw error;
            const productImage = req.file ? req.file.path : null;

            const existingCategory = await categoryRepo.getCategoryById(
                value.categoryId
            );
            if (!existingCategory)
                throw new AppError("Category not found", "NOT_FOUND");

            const product = await productRepo.create({
                ...value,
                productImage,
            });

            return CResponse({
                res,
                message: "CREATED",
                data: product,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const { error, value } = updateProductSchema.validate(req.body);
            if (error) throw error;
            const productImage = req.file ? req.file.path : null;

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

            // delete old image
            if (productImage) {
                const oldImagePath = productImage;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            await productRepo.update(id, { ...value, productImage });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
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

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new ProductController();

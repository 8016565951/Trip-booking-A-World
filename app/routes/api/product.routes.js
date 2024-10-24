const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuth } = require("../../middlewares/auth");
const productController = require("../../modules/api/products/controllers/product.controller");
const productUpload = require("../../multer/product");

const productRouter = Router();
const namedRouter = routeLabel(productRouter);

namedRouter.all("/products*", isAuth);

namedRouter.get("products.all", "/products", productController.getProducts);
namedRouter.get(
    "products.single",
    "/products/:id",
    productController.getProduct
);

namedRouter.post(
    "products.single.create",
    "/products",
    productUpload.single("productImage"),
    productController.createProduct
);
namedRouter.post(
    "products.email",
    "/products/email",
    productController.getProductsInEmail
);

namedRouter.patch(
    "products.single.update",
    "/products/:id",
    productUpload.single("productImage"),
    productController.updateProduct
);

namedRouter.delete(
    "products.single.delete",
    "/products/:id",
    productController.deleteProduct
);

module.exports = productRouter;

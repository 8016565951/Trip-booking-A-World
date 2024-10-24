const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const productController = require("../../modules/admin/products/controllers/product.controller");
const productUpload = require("../../multer/product");

const productRouter = Router();
const namedRouter = routeLabel(productRouter);

namedRouter.all("/products*", isAuthAdminUI);


namedRouter.get("products.list.ui", "/products", productController.listUI);
namedRouter.get(
    "products.single.create.ui",
    "/products/create",
    productController.createUI
);
namedRouter.get(
    "products.single.update.ui",
    "/products/:id/edit",
    productController.updateUI
);

namedRouter.get(
    "products.email.http",
    "/products/email",
    productController.getProductsInEmail
);

namedRouter.post(
    "products.single.create.http",
    "/products",
    productUpload.single("productImage"),
    productController.createProduct
);
namedRouter.post(
    "products.single.update.http",
    "/products/:id/update",
    productUpload.single("productImage"),
    productController.updateProduct
);

namedRouter.get(
    "products.single.delete.http",
    "/products/:id/delete",
    productController.deleteProduct
);

namedRouter.post("productactivate.http", "/products/:id/activate", productController.activateProduct);

module.exports = productRouter;

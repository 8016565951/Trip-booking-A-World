const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const serviceController = require("../../modules/www/service/controller/service.controller");
const Product = require("../../modules/api/products/models/product");
const category = require("../../modules/api/categories/models/category");

const serviceRouter = Router();
const namedServiceRouter = routeLabel(serviceRouter);

namedServiceRouter.get(
    "www.service.ui",
    "/service",
    isAuthUI,

    serviceController.serviceui
);
namedServiceRouter.get(
    "www.searchProductsByCategory",
    "/service/search",
    isAuthUI,

    serviceController.searchProductsByCategory
);

module.exports = serviceRouter;

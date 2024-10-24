const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuth } = require("../../middlewares/auth");
const categoryController = require("../../modules/api/categories/controllers/category.controller");

const categoryRouter = Router();
const namedRouter = routeLabel(categoryRouter);

namedRouter.all("/categories*", isAuth);

namedRouter.get(
    "categories.all",
    "/categories",
    categoryController.getCategories
);
namedRouter.get(
    "categories.single",
    "/categories/:id",
    categoryController.getCategory
);

namedRouter.post(
    "categories.single.create",
    "/categories",
    categoryController.createCategory
);

namedRouter.patch(
    "categories.single.update",
    "/categories/:id",
    categoryController.updateCategory
);

namedRouter.delete(
    "categories.single.delete",
    "/categories/:id",
    categoryController.deleteCategory
);

module.exports = categoryRouter;

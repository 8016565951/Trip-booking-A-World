const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const categoryController = require("../../modules/admin/categories/controllers/category.controller");

const categoryRouter = Router();
const namedRouter = routeLabel(categoryRouter);

namedRouter.all("/categories*", isAuthAdminUI);

namedRouter.get("category.list.ui", "/categories", categoryController.listUI);
namedRouter.get(
    "category.single.create.ui",
    "/categories/create",
    categoryController.createUI
);
namedRouter.get(
    "category.single.update.ui",
    "/categories/:id/edit",
    categoryController.updateUI
);

namedRouter.post(
    "category.single.create.http",
    "/categories",
    categoryController.createCategory
);
namedRouter.post(
    "category.single.update.http",
    "/categories/:id",
    categoryController.updateCategory
);

namedRouter.get(
    "category.single.delete.http",
    "/categories/:id",
    categoryController.deleteCategory
);

module.exports = categoryRouter;

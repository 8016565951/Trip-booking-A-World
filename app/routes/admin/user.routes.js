const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const userController = require("../../modules/admin/users/controllers/user.controller");

const userRouter = Router();
const namedRouter = routeLabel(userRouter);

namedRouter.all("/users*", isAuthAdminUI);

namedRouter.get("users.list.ui", "/users", userController.listUI);
namedRouter.get(
    "users.single.delete.http",
    "/users/:id",
    userController.deleteUser
);

module.exports = userRouter;

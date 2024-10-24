const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuth, isSameUser } = require("../../middlewares/auth");
const userController = require("../../modules/api/users/controllers/user.controller");
const { avatarUpload } = require("../../multer");

const userRouter = Router();
const namedRouter = routeLabel(userRouter);

namedRouter.all("/users*", isAuth);

namedRouter.get("users.all", "/users", userController.getUsers);
namedRouter.get("users.single", "/users/:id", userController.getUser);

namedRouter.patch(
    "users.single.update",
    "/users/:id",
    isSameUser,
    userController.updateUser
);
namedRouter.patch(
    "users.single.update.avatar",
    "/users/:id/avatar",
    isSameUser,
    avatarUpload.single("avatar"),
    userController.updateAvatar
);
namedRouter.patch(
    "users.single.update.password",
    "/users/:id/password",
    isSameUser,
    userController.updatePassword
);

namedRouter.delete(
    "users.single.delete",
    "/users/:id",
    isSameUser,
    userController.deleteUser
);

module.exports = userRouter;

const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI, isTokenValid } = require("../../middlewares/auth");
const adminAuthController = require("../../modules/admin/auth/controller/admin.auth.controller");

const authRouter = Router();
const namedAuthRouter = routeLabel(authRouter);

namedAuthRouter.get(
    "auth.admin.signin.ui",
    "/auth/admin/signin",
    adminAuthController.signInUI
);

namedAuthRouter.post("auth.admin.signin.http", "/auth/signin", adminAuthController.signIn);
namedAuthRouter.get(
    "auth.admin.signout.http",
    "/auth/signout",
    isAuthAdminUI,
    adminAuthController.signOut
);



module.exports = authRouter;

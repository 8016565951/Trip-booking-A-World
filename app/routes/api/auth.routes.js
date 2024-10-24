const { Router } = require("express");
const routeLabel = require("route-label");
const authController = require("../../modules/api/auth/controllers/auth.controller");
const { isAuth, isTokenValid } = require("../../middlewares/auth");

const authRouter = Router();
const namedAuthRouter = routeLabel(authRouter);

namedAuthRouter.get("auth.me", "/auth/me", isAuth, authController.currentUser);

namedAuthRouter.post("auth.signup", "/auth/signup", authController.signUp);
namedAuthRouter.post("auth.signin", "/auth/signin", authController.signIn);
namedAuthRouter.post(
    "auth.signout",
    "/auth/signout",
    isAuth,
    authController.signOut
);

namedAuthRouter.post(
    "auth.verify",
    "/auth/verify-email",
    isTokenValid,
    authController.verifyEmail
);

module.exports = authRouter;

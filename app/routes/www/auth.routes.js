const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const authController = require("../../modules/www/auth/controllers/auth.controller");

const authRouter = Router();
const namedAuthRouter = routeLabel(authRouter);

namedAuthRouter.get("auth.signup.ui", "/auth/signup", authController.signUpUI);
namedAuthRouter.get("auth.signin.ui", "/auth/signin", authController.signInUI);
namedAuthRouter.get(
    "auth.verify.ui",
    "/auth/verify-email",
    isAuthUI,
    authController.verifyEmailUI
);

namedAuthRouter.post("auth.signup.http", "/auth/signup", authController.signUp);
namedAuthRouter.post("auth.signin.http", "/auth/signin", authController.signIn);
namedAuthRouter.get(
    "auth.signout.http",
    "/auth/signout",
    isAuthUI,
    authController.signOut
);

namedAuthRouter.post(
    "auth.verify.http",
    "/auth/verify",
    isTokenValid,

    authController.verifyEmail
);

module.exports = authRouter;

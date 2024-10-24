const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const profileController = require("../../modules/www/profile/controller/profile.controller");
const avatarUpload = require("../../multer/avatar");

const profileRouter = Router();
const namedProfileRouter = routeLabel(profileRouter);

namedProfileRouter.get(
    "www.profile.ui",
    "/profile",
    isAuthUI,
    profileController.profileui
);

namedProfileRouter.post(
    "www.profile.update.http",
    "/profile/update",
    isAuthUI,
    avatarUpload.single("avatarUrl"),
    profileController.updateProfile
);

module.exports = profileRouter;

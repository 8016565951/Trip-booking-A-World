const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const aboutControlle = require("../../modules/www/about/controller/about.controlle");

const aboutRouter = Router();
const namedAboutRouter = routeLabel(aboutRouter);

namedAboutRouter.get(
    "www.about.ui",
    "/about",
    isAuthUI,
    aboutControlle.aboutui
);

module.exports = aboutRouter;

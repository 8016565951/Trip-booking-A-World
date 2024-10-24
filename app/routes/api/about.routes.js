const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const aboutController = require("../../modules/api/about/controller/about.controller");
const aboutUpload = require("../../multer/about");

const aboutRouter = Router();
const namedRouter = routeLabel(aboutRouter);

namedRouter.get("about.list", "/about", aboutController.getAboutPage);
namedRouter.post(
    "about.update",
    "/about/update",
    aboutUpload.single("aboutimage"),
    aboutController.updateAboutPage
);

module.exports = aboutRouter;

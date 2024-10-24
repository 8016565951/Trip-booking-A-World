const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");

const aboutController = require("../../modules/admin/about/controller/about.controller");
const aboutUpload = require("../../multer/about");

const aboutRouter = Router();
const namedRouter = routeLabel(aboutRouter);

namedRouter.all("/about*", isAuthAdminUI);

namedRouter.get("about.list.ui", "/about", aboutController.renderAboutPage);

namedRouter.post(
    "about.single.update.http",
    "/upddate/about",
    aboutUpload.single("aboutimage"),
    aboutController.updateAboutPage
);

module.exports = aboutRouter;

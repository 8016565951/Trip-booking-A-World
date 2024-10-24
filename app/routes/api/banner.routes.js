const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const bannerController = require("../../modules/api/banner/controller/banner.controller");

const bannerRouter = Router();
const namedRouter = routeLabel(bannerRouter);



namedRouter.get("banner.list", "/banner", bannerController.list);
namedRouter.post("banner.add", "/banner/add", bannerController.addBanner);


module.exports = bannerRouter;

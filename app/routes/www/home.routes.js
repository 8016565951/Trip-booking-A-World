const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const homeController = require("../../modules/www/home/controller/home.controller");

const homeRouter = Router();
const namedHomeRouter = routeLabel(homeRouter);

namedHomeRouter.get("www.list.home", "/home", isAuthUI, homeController.listUI);

module.exports = homeRouter;

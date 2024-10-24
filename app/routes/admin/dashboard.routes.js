const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const dashboardController = require("../../modules/admin/dashboard/controllers/dashboard.controller");

const dashRouter = Router();
const namedRouter = routeLabel(dashRouter);

namedRouter.get(
    "dashboard.stats.ui",
    "/stats",
    isAuthAdminUI,
    dashboardController.statsUI
);

module.exports = dashRouter;

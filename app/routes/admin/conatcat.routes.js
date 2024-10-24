const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const AdminContactController = require("../../modules/admin/contact/controller/contact.controller");

const contactRouter = Router();
const namedRouter = routeLabel(contactRouter);

namedRouter.all("/contact*", isAuthAdminUI);

namedRouter.get(
    "contact.list.ui",
    "/contact",
    AdminContactController.list );

module.exports = contactRouter;

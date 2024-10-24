const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuth } = require("../../middlewares/auth");
const contactController = require("../../modules/api/contact/controller/contact.controller");

const contactRouter = Router();
const namedRouter = routeLabel(contactRouter);

namedRouter.all("/contact*", isAuth);

namedRouter.get("contact.all", "/contact", contactController.getContacts);
namedRouter.get("contact.ui", "/contact", contactController.createContact);

module.exports = contactRouter;

const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const contactController = require("../../modules/www/contact/controller/contact.controller");

const contactRouter = Router();
const namedContactRouter = routeLabel(contactRouter);

namedContactRouter.get(
    "www.contact.ui",
    "/contact",
    isAuthUI,
    contactController.contactui
);
namedContactRouter.post(
    "www.contact.http",
    "/contact",
    isAuthUI,
    contactController.createContact
);

module.exports = contactRouter;

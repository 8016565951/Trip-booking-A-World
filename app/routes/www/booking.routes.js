const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const bookingUIController = require("../../modules/www/booking/controller/booking.controller");

const bookingUIRouter = Router();
const namedBookingUIRouter = routeLabel(bookingUIRouter);

namedBookingUIRouter.get(
    "www.booking.ui.create",
    "/booking/:serviceId",
    isAuthUI,
    bookingUIController.renderBookingForm
);

namedBookingUIRouter.post(
    "www.bookedservice.ui.create",
    "/booking/create/:id",
    isAuthUI,
    bookingUIController.createBookingUI
);

namedBookingUIRouter.get(
    "www.booking.ui.list",
    "/bookings",
    isAuthUI,
    bookingUIController.listBookingsUI
);

namedBookingUIRouter.get(
    "www.booking.ui.details",
    "/booking/details/:id",
    isAuthUI,
    bookingUIController.viewSingleBookingUI
);

module.exports = bookingUIRouter;

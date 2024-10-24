const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const bookingController = require("../../modules/admin/booking/controller/booking.controller");

const bookingRouter = Router();
const namedRouter = routeLabel(bookingRouter);

namedRouter.all("/booking*", isAuthAdminUI);

namedRouter.get(
    "booking.list.ui",
    "/booking",
    bookingController.showBookingList
);
namedRouter.post(
    "booking.single.update.http",
    "/booking/update-status/:id",
    bookingController.updateBookingStatus
);

module.exports = bookingRouter;

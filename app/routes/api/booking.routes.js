const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const bookingController = require("../../modules/api/booking/controller/booking.controller");

const bookingRouter = Router();
const namedRouter = routeLabel(bookingRouter);



namedRouter.get("booking.list", "/booking", bookingController.list);
namedRouter.get("booking.single", "/booking/:id", bookingController.singleBooking);
namedRouter.post("booking.create", "/booking", bookingController.create);
namedRouter.post("booking.update", "/booking/:id", bookingController.updateBooking);


module.exports = bookingRouter;

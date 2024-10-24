const Service = require("../../../api/products/models/product"); // Assuming a service model exists
const Booking = require("../../../api/booking/model/booking"); // Your Booking model
const { AppError } = require("../../../../helpers");
const { handleError, CResponse } = require("../../../../helpers/utils");
const bookingSchemaValidate = require("../../../../validations/booking");
const user = require("../../../api/users/models/user");
const mongoose = require("mongoose");

class BookingUIController {
    // Render the booking form
    renderBookingForm = async (req, res) => {
        try {
            const serviceId = req.params.serviceId;
            const services =
                await Service.findById(serviceId).populate("categoryId");
            const bookingId = "BOOK-" + Date.now();

            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            res.render("booking/views/create", {
                title: "Book Service",
                services,
                bookingId,
                User,
            });
        } catch (error) {
            console.log(error);
            handleError(error, res);
        }
    };

    createBookingUI = async (req, res) => {
        try {
            const { error, value } = bookingSchemaValidate.validate(req.body);

            if (error) {
                throw new AppError(
                    "Validation error",
                    400,
                    error.details[0].message
                );
            }

            value.serviceId = req.params.id;

            const newBooking = await Booking.create({
                ...value,
            });

            console.log("noooooooooooooooooooooooooo", newBooking);

            return res.redirect("/bookings");
        } catch (err) {
            handleError(err, res);
        }
    };

    listBookingsUI = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const bookings = await Booking.find({ userId }).populate(
                "serviceId userId"
            );

            res.render("booking/views/list", { bookings, User });
        } catch (error) {
            handleError(error, res);
        }
    };

    viewSingleBookingUI = async (req, res) => {
        try {
            const { id } = req.params; // Assuming id is the bookingId
            const userId = req.ctx?.user.id;

            console.log("Requested bookingId:", id);
            console.log("User ID:", userId);

            const User = await user.findOne({ _id: userId });
            console.log("User object:", User);

            // Find booking by bookingId and userId using populate
            const booking = await Booking.findById(id)
                .populate({
                    path: "serviceId",
                    populate: {
                        path: "categoryId", // This assumes the field name is `categoryId` in your Service model
                    },
                })
                .populate("userId");

            console.log("Booking found:", booking);

            if (!booking) {
                throw new AppError("Booking not found", 404);
            }

            res.render("booking/views/details", { booking, User });
        } catch (error) {
            console.log(error);
            handleError(error, res);
        }
    };
}

module.exports = new BookingUIController();

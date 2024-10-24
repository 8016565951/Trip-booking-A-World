const BookingRepository = require("../../../api/booking/repository/booking.repo");

const { handleError } = require("../../../../helpers/utils");
const { mailer } = require("../../../../nodemailer");

const categoryRepo = require("../../../api/categories/repositories/category.repo");
const user = require("../../../api/users/models/user");

class bookingController {
    showBookingList = async (req, res) => {
        try {
            const categoryId = req.query.categoryId;
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });

            const bookings = await BookingRepository.getAllBookings();
            const categories = await categoryRepo.all();

            console.log(categories);
            res.render("booking/views/update", {
                title: "Bookings",
                bookings,
                categories,
                User,
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    updateBookingStatus = async (req, res) => {
        const { bookingId, status } = req.body;

        try {
            const bookingDetails =
                await BookingRepository.getBookingById(bookingId);

            if (!bookingDetails) {
                return res.status(404).send("Booking not found");
            }

            await BookingRepository.updateBookingStatus(bookingId, status);

            const emailDetails = {
                user: {
                    email: bookingDetails.userDetails.email,
                    username: bookingDetails.userDetails.username,
                },
                booking: {
                    serviceId: bookingDetails.serviceDetails.name,
                    serviceName: bookingDetails.serviceDetails.name,
                    servicePrice: bookingDetails.serviceDetails.price,
                    duration: bookingDetails.duration,
                    description: bookingDetails.description,
                    productImage: bookingDetails.serviceDetails.productImage,
                    serviceStatus: bookingDetails.serviceDetails.status,
                    bookingId: bookingDetails.bookingId,
                    serviceDetails: bookingDetails.serviceDetails,
                    date: bookingDetails.date,
                    address: bookingDetails.address,
                },
                status: status,
            };

            await mailer.sendBookingStatusUpdate(emailDetails);

            res.redirect("/dashboard/booking");
        } catch (error) {
            console.log(error);
            handleError(error, res);
        }
    };
}

module.exports = new bookingController();

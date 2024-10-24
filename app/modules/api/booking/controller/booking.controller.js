const { AppError } = require("../../../../helpers");
const { handleError, CResponse } = require("../../../../helpers/utils");
const bookingSchemaValidate = require("../../../../validations/booking");
const {
    getAllBooking,
    createBooking,
    BookingUpdate,
    getSingleBooking,
} = require("../repository/booking.repo");

class BookingController {
    // Create a new booking
    create = async (req, res) => {
        try {
            // Validate booking data
            const { error, value } = bookingSchemaValidate.validate(req.body);
            if (error) {
                throw new AppError(
                    "Validation Error",
                    400,
                    error.details[0].message
                );
            }

            // Create booking with the validated data and the user making the request
            const booking = await createBooking(value, req.user);

            // Send success response
            return CResponse({
                res,
                message: "Booking created successfully",
                data: booking,
            });
        } catch (err) {
            // Handle errors
            return handleError(err, res);
        }
    };

    // Get a list of all bookings
    list = async (req, res) => {
        try {
            const bookings = await getAllBooking();

            // Send success response
            return CResponse({
                res,
                message: "Bookings retrieved successfully",
                data: bookings,
            });
        } catch (err) {
            // Handle errors
            return handleError(err, res);
        }
    };

    // Get a single booking by ID
    singleBooking = async (req, res) => {
        try {
            const { id } = req.params;

            const booking = await getSingleBooking(id);

            if (!booking) {
                throw new AppError(
                    "Booking not found",
                    404,
                    `No booking found with ID: ${id}`
                );
            }

            // Send success response
            return CResponse({
                res,
                message: "Booking retrieved successfully",
                data: booking,
            });
        } catch (err) {
            // Handle errors
            return handleError(err, res);
        }
    };

    // Update booking status or employee assignment
    updateBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const { employeeId } = req.body;

            const updatedBooking = await BookingUpdate(id, employeeId);

            if (!updatedBooking) {
                throw new AppError(
                    "Booking not found",
                    404,
                    `No booking found with ID: ${id}`
                );
            }

            // Send success response
            return CResponse({
                res,
                message: "Booking updated successfully",
                data: updatedBooking,
            });
        } catch (err) {
            // Handle errors
            return handleError(err, res);
        }
    };
}

module.exports = new BookingController();

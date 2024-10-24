const mongoose = require("mongoose");
const Booking = require("../model/booking");

class BookingRepository {
    // Create a new booking
    async createBooking(data) {
        try {
            const newBooking = new Booking(data);
            return await newBooking.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get a booking by ID and populate service (product) and user details
    async getBookingById(bookingId) {
        try {
            const booking = await Booking.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
                {
                    $lookup: {
                        from: "products", // Product collection
                        localField: "serviceId",
                        foreignField: "_id",
                        as: "serviceDetails",
                    },
                },
                {
                    $lookup: {
                        from: "users", // User collection
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                { $unwind: "$serviceDetails" }, // Unwind the array from $lookup
                { $unwind: "$userDetails" },
                {
                    $project: {
                        bookingId: 1,
                        date: 1,
                        address: 1,
                        status: 1,
                        serviceDetails: {
                            name: 1,
                            price: 1,
                            category: 1,
                        },
                        userDetails: {
                            name: 1,
                            email: 1,
                        },
                    },
                },
            ]);
            return booking[0]; // Since aggregate returns an array
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        try {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { status },
                { new: true }
            );
            return updatedBooking;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Get all bookings with populated service and user details
    async getAllBookings() {
        try {
            
            const bookings = await Booking.aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "serviceId",
                        foreignField: "_id",
                        as: "serviceDetails",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },

                { $unwind: "$serviceDetails" },
                { $unwind: "$userDetails" },
                {
                    $project: {
                        bookingId: 1,
                        date: 1,
                        address: 1,
                        status: 1,

                        serviceDetails: {
                            name: 1,
                            price: 1,
                            productImage: 1,
                            travelers: 1,
                            category: 1,
                            categoryName: 1,
                            contactNumber: 1,
                            categoryId: 1,
                            
                        },
                        userDetails: {
                            username: 1,
                            email: 1,
                        },
                    },
                },
            ]);
            return bookings;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new BookingRepository();

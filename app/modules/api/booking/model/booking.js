const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },

        description: {
            type: String,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        date: {
            type: Date,
        },
        address: {
            type: String,
        },

        status: {
            type: String,
            enum: ["pending", "onprogress", "completed", "cancel"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;

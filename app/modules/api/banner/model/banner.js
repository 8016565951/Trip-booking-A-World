const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        bannerimage: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;

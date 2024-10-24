const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        aboutimage: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const About = mongoose.model("about", aboutSchema);

module.exports = About;

const { model, Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.plugin(aggregatePaginate);

module.exports = model("user", userSchema);

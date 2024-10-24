const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
    {
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;

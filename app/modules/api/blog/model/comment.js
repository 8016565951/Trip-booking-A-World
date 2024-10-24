const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },
        content: {
            type: mongoose.Schema.Types.String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

const Comment = require("../model/comment");

class CommentRepository {
    addComment = async (data) => {
        return await Comment.create(data);
    };

    getCommentsByBlogId = async (blogId) => {
        return await Comment.find({ blogId })
            .populate("createdBy")
            .populate({
                path: "replies",
                populate: { path: "createdBy" },
            });
    };
}

module.exports = new CommentRepository();

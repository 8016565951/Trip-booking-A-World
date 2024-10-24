const { CResponse, handleError } = require("../../../../helpers/utils");
const commentRepository = require("../../../api/blog/repository/comment.repo");
const replyRepository = require("../../../api/blog/repository/reply.repo");

class CommentController {
    addComment = async (req, res) => {
        try {
            const { content } = req.body;
            const blogId = req.params.blogId;
            const createdBy = req.user._id;
            await commentRepository.addComment({ content, blogId, createdBy });
            return CResponse({
                res,
                message: "Comment added successfully",
                data: {},
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    addReply = async (req, res) => {
        try {
            const { content } = req.body;
            const commentId = req.params.commentId;
            const createdBy = req.user._id;
            await replyRepository.addReply({ content, commentId, createdBy });
            return CResponse({
                res,
                message: "Reply added successfully",
                data: {},
            });
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new CommentController();

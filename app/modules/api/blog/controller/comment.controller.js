const { CResponse, handleError } = require("../../../../helpers/utils");
const commentRepository = require("../repository/comment.repo");
const replyRepository = require("../repository/reply.repo");

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
    async addComments(commentData) {
        const comment = new Comment(commentData);
        return await comment.save(); 
    }
}

module.exports = new CommentController();

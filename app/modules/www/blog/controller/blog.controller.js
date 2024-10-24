const { handleError } = require("../../../../helpers/utils");
const Blog = require("../../../api/blog/model/blog");
const Comment = require("../../../api/blog/model/comment");
const Replys = require("../../../api/blog/model/reply");
const BlogRepository = require("../../../api/blog/repository/blog.repo");
const CommentRepository = require("../../../api/blog/repository/comment.repo");
const user = require("../../../api/users/models/user");
const mongoose = require("mongoose");

class BlogController {
    blogui = async (req, res) => {
        try {
            const blogs = await BlogRepository.getAllBlogs();
            const comments = await CommentRepository.getCommentsByBlogId(
                req.params.id
            );
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            res.render("blog/views/blogs", {
                title: "Blogs",
                blogs,
                comments,
                User,
            });
        } catch (error) {
            console.log(error);
            handleError(res, error);
        }
    };

    singleView = async (req, res) => {
        try {
            // Fetch the blog post by ID
            const blog = await BlogRepository.getBlogById(req.params.id);

            const userId = req.ctx?.user?.id; // Safely access user ID
            const User = await user.findOne({ _id: userId });

            // Fetch comments with user details and associated replies
            const comments = await Comment.aggregate([
                {
                    $match: {
                        blogId: new mongoose.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "replies",
                        localField: "_id",
                        foreignField: "commentId",
                        as: "replies",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "replies.createdBy",
                        foreignField: "_id",
                        as: "replyUserDetails",
                    },
                },
                {
                    $project: {
                        content: 1,
                        createdAt: 1,
                        "userDetails.username": 1,
                        "userDetails.avatarUrl": 1,
                        replies: {
                            $map: {
                                input: "$replies",
                                as: "reply",
                                in: {
                                    content: "$$reply.content",
                                    createdAt: "$$reply.createdAt",
                                    username: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$replyUserDetails",
                                                    as: "user",
                                                    cond: {
                                                        $eq: [
                                                            "$$user._id",
                                                            "$$reply.createdBy",
                                                        ],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            ]);

            res.render("blog/views/blog", {
                title: "Blog",
                blog,
                User,
                comments,
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    AddComment = async (req, res) => {
        try {
            const BId = req.params.id;

            console.log("Blog ID from params:", BId);

            const { content } = req.body;

            console.log("Comment content:", content);

            const newComment = await CommentRepository.addComment({
                content: content,
                blogId: BId,
                createdBy: req.ctx?.user.id,
            });

            console.log("New Comment:", newComment);

            return res.redirect(`/blog/${BId}/view`);
        } catch (error) {
            console.error("Error adding comment:", error);
            return handleError(error, res);
        }
    };

    addReply = async (req, res) => {
        try {
            const { content } = req.body;
            const { commentId } = req.params;
            const { blogId } = req.params;

            const reply = new Replys({
                commentId,
                content,
                createdBy: req.ctx?.user.id,
            });

            await reply.save();

            await Comment.findByIdAndUpdate(commentId, {
                $push: { replies: reply._id },
            });

            return res.redirect(`/blog/${blogId}/view`);
        } catch (error) {
            console.error("Error adding reply:", error);
            return handleError(error, res);
        }
    };
}

module.exports = new BlogController();

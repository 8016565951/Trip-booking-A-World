const { CResponse, handleError } = require("../../../../helpers/utils");
const blogRepository = require("../../../api/blog/repository/blog.repo");
const commentRepository = require("../../../api/blog/repository/comment.repo");
const path = require("path");
const user = require("../../../api/users/models/user");
const Comment = require("../../../api/blog/model/comment");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

class BlogController {
    ceateui = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            res.render("blog/views/create", {
                title: "Create Blog",
                User,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };
    async createBlog(req, res) {
        try {
            const { title, content } = req.body;
            const blogImage = req.file ? req.file.path : null;

            // Check if required fields are present
            if (!title || !content) {
                throw new Error("Title and content are required.");
            }

            const newBlog = await blogRepository.createBlog({
                title,
                content,
                blogImage,
            });
            console.log(newBlog);

            res.redirect("/dashboard/blog");
        } catch (error) {
            console.error(error);
            return handleError(error, res);
        }
    }
    list = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const blogs = await blogRepository.getAllBlogs();
            res.render("blog/views/list", {
                title: "Blogs",
                blogs,
                User,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    likeBlog = async (req, res) => {
        try {
            const blogId = req.params.id;
            const updatedBlog = await blogRepository.likeBlog(blogId);
            return CResponse({
                res,
                message: "OK",
                data: updatedBlog,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    viewBlog = async (req, res) => {
        try {
            const blogId = req.params.id;
            const blog = await blogRepository.getBlogById(blogId);
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
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            res.render("blog/views/single", {
                title: "Blog",
                blog,
                comments,
                User,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    deleteBlog = async (req, res) => {
        try {
            const blogId = req.params.id;

            // delete image
            const blogImage = req.file ? req.file.path : null;
            if (blogImage) {
                fs.unlinkSync(blogImage);
                console.log("image deleted: ", blogImage);
            }

            // delete blog
            const blog = await blogRepository.deleteBlog(blogId);
            res.redirect("/dashboard/blog");
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new BlogController();

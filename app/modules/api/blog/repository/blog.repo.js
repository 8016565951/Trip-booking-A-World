const Blog = require("../model/blog");
const mongoose = require("mongoose");
class BlogRepository {
    createBlog = async (data) => {
        return await Blog.create(data);
    };

    getBlogById = async (id) => {
        return await Blog.findById(id).populate("createdBy");
    };

    getAllBlogs = async () => {
        return await Blog.find().populate("createdBy").sort({ createdAt: -1 });
    };

    likeBlog = async (blogId) => {
        return await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { likes: 1 } },
            { new: true }
        );
    };
    getBlogWithComments = async (blogId) => {
        return await Blog.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
            {
                $lookup: {
                    from: "comments", // The name of the comments collection
                    localField: "_id",
                    foreignField: "blogId",
                    as: "comments",
                },
            },
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true, // Optional: Include blogs with no comments
                },
            },
            {
                $lookup: {
                    from: "users", // The name of the users collection
                    localField: "comments.createdBy",
                    foreignField: "_id",
                    as: "comments.createdBy",
                },
            },
            {
                $unwind: {
                    path: "$comments.createdBy",
                    preserveNullAndEmptyArrays: true, // Optional: Handle comments with no user details
                },
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    content: { $first: "$content" },
                    blogImage: { $first: "$blogImage" },
                    createdBy: { $first: "$createdBy" },
                    createdAt: { $first: "$createdAt" },
                    comments: { $push: "$comments" },
                },
            },
        ]);
    };

    deleteBlog = async (id) => {
        return await Blog.findByIdAndDelete(id);
    };
}

module.exports = new BlogRepository();

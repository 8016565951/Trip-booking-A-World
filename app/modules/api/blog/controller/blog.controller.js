const { CResponse, handleError } = require("../../../../helpers/utils");
const blogRepository = require("../repository/blog.repo");
const commentRepository = require("../repository/comment.repo");
const path = require("path");

class BlogController {
    createBlog = async (req, res) => {
        try {
            const { title, content } = req.body;
            const createdBy = req.user._id;
            const blogImage = req.file ? req.file.path : null;
            const newBlog = await blogRepository.createBlog({
                title,
                content,
                createdBy,
                blogImage,
            });
            return CResponse({
                res,
                message: "Blog created successfully",
                data: newBlog,
            });
        } catch (error) {
            return handleError(error, res);
        }
    };

    getBlogs = async (req, res) => {
        try {
            const blogs = await blogRepository.getAllBlogs();
            return CResponse({
                res,
                message: "OK",
                data: blogs,
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
            const comments =
                await commentRepository.getCommentsByBlogId(blogId);
            return CResponse({
                res,
                message: "OK",
                data: { blog, comments },
            });
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new BlogController();

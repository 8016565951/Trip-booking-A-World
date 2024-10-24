const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI } = require("../../middlewares/auth");
const blogController = require("../../modules/api/blog/controller/blog.controller");
const commentController = require("../../modules/api/blog/controller/comment.controller");

const blogRouter = Router();
const namedRouter = routeLabel(blogRouter);

namedRouter.get("blog.list", "/blog", isAuthUI, blogController.getBlogs);
namedRouter.post("blog.create", "/blog", blogController.createBlog);
namedRouter.get("blog.single", "/blog/:id", blogController.viewBlog);
namedRouter.post("blog.like", "/blog/like/:id", blogController.likeBlog);

namedRouter.post(
    "blog.comment",
    "/blog/comment/:id",
    commentController.addComment
);
namedRouter.post("blog.reply", "/blog/reply/:id", commentController.addReply);

module.exports = blogRouter;

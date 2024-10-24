const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthUI, isTokenValid } = require("../../middlewares/auth");
const blogController = require("../../modules/www/blog/controller/blog.controller");

const blogRouter = Router();
const namedBlogRouter = routeLabel(blogRouter);

namedBlogRouter.get(
    "www.blog.ui",
    "/blog",
    isAuthUI,

    blogController.blogui
);
namedBlogRouter.get(
    "www.blog.single.ui",
    "/blog/:id/view",
    isAuthUI,
    blogController.singleView
);
namedBlogRouter.post(
    "www.blog.comment.http",
    "/comments/:id",
    isAuthUI,
    blogController.AddComment
);

namedBlogRouter.post(
    "www.blog.reply.http",
    "/blog/:commentId/reply/:blogId",
    isAuthUI,
    blogController.addReply
);

module.exports = blogRouter;

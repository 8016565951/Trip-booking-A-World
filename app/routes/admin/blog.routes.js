const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");

const blogControlleer = require("../../modules/admin/blog/controller/blog.controller");
const blogUpload = require("../../multer/blog");

const BlogRouter = Router();
const namedRouter = routeLabel(BlogRouter);

namedRouter.all("/blog*", isAuthAdminUI);

namedRouter.get("blog.list.ui", "/blog", blogControlleer.list);
namedRouter.get(
    "blog.single.create.ui",
    "/blog/create",
    isAuthAdminUI,
    blogControlleer.ceateui
);
namedRouter.get(
    "blog.single.view.ui",
    "/blog/:id/view",
    isAuthAdminUI,
    blogControlleer.viewBlog
);

namedRouter.post(
    "blog.single.create.http",
    "/blog/post",
    isAuthAdminUI,
    blogUpload.single("blogImage"),
    blogControlleer.createBlog
);

namedRouter.get(
    "blog.single.delete.ui",
    "/blog/:id/delete",
    isAuthAdminUI,
    blogControlleer.deleteBlog
);

module.exports = BlogRouter;

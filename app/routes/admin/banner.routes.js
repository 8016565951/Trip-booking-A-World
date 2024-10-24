const { Router } = require("express");
const routeLabel = require("route-label");
const { isAuthAdminUI } = require("../../middlewares/auth");
const bannerControlleer = require("../../modules/admin/banner/controller/banner.controlleer");
const bannerUpload = require("../../multer/banner");

const BannerRouter = Router();
const namedRouter = routeLabel(BannerRouter);

namedRouter.all("/banner*", isAuthAdminUI);

namedRouter.get("banner.list.ui", "/banner", bannerControlleer.listUi);
namedRouter.get(
    "banner.single.create.ui",
    "/banner/create",
    isAuthAdminUI,
    bannerControlleer.createUi
);
namedRouter.get(
    "banner.single.update.ui",
    "/banner/:id/edit",
    isAuthAdminUI,
    bannerControlleer.updateUi
);

namedRouter.post(
    "banner.single.create.http",
    "/banner/post",
    isAuthAdminUI,
    bannerUpload.single("bannerimage"),
    bannerControlleer.careateBanner
);

namedRouter.post(
    "banner.single.update.http",
    "/banner/:id",
    isAuthAdminUI,
    bannerUpload.single("bannerimage"),
    bannerControlleer.updateBanner
);

namedRouter.get(
    "banner.single.delete.http",
    "/banner/:id",
    isAuthAdminUI,
    bannerControlleer.deleteBanner
);
module.exports = BannerRouter;

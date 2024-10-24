const { AppError } = require("../../../../helpers");
const { handleError } = require("../../../../helpers/utils");
const bannerRepository = require("../../../api/banner/repository/banner.repository");
const path = require("path");
const fs = require("fs");
const user = require("../../../api/users/models/user");
class BannerUiController {
    listUi = async (req, res) => {
        try {
            const Banner = await bannerRepository.getBanner();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            return res.render("banner/views/list", {
                title: "Banners",
                Banner,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createUi = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            return res.render("banner/views/create", {
                title: "Create Banner",
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateUi = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const { id } = req.params;
            const banner = await bannerRepository.getBannerById(id);
            if (!banner) throw new AppError("Banner not found", "NOT_FOUND");

            req.body.id = id;

            return res.render("banner/views/update", {
                title: "Update Banner",
                banner,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
    careateBanner = async (req, res) => {
        try {
            const { title, description } = req.body;
            const bannerimage = req.file.path;

            const banner = await bannerRepository.createBanner({
                title,
                description,
                bannerimage,
            });
            console.log(banner);
            return res.redirect("/dashboard/banner");
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateBanner = async (req, res) => {
        try {
            const { id } = req.params;

            const bannerimage = req.file?.path;
            // delete old image
            if (req.file) {
                const banner = await bannerRepository.getBannerById(id);
                if (banner.bannerimage) {
                    const oldImage = banner.bannerimage;
                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                        console.log("old image deleted: ", oldImage);
                    }
                }
            }

            const banner = await bannerRepository.updateBanner(id, {
                title: req.body.title,
                description: req.body.description,
                bannerimage: bannerimage,
            });

            console.log(banner);
            return res.redirect("/dashboard/banner");
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteBanner = async (req, res) => {
        try {
            const { id } = req.params;
            const banner = await bannerRepository.getBannerById(id);
            if (!banner) throw new AppError("Banner not found", "NOT_FOUND");
            if (banner.bannerimage) {
                const oldImage = banner.bannerimage;
                if (fs.existsSync(oldImage)) {
                    fs.unlinkSync(oldImage);
                    console.log("old image deleted: ", oldImage);
                }
            }

            await bannerRepository.deleteBanner(id);
            console.log(banner);
            return res.redirect("/dashboard/banner");
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new BannerUiController();

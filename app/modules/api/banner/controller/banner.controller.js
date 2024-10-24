const BannerRepository = require("../repository/banner.repository");
const CResponse = require("../../../../helpers/utils");
const fs = require("fs");
const path = require("path");

class BannerController {
    addBanner = async (req, res) => {
        try {
            const { title, description } = req.body;
            const bannerimage = req.file.path;

            const banner = await BannerRepository.createBanner({
                title,
                description,
                bannerimage,
            });

            return CResponse({
                res,
                message: "OK",
                data: banner,
            });
        } catch (error) {
            return handleError(err, res);
        }
    };
    list = async (req, res) => {
        try {
            const banner = await BannerRepository.getBanner();
            return CResponse({
                res,
                message: "OK",
                data: banner,
            });
        } catch (error) {
            return handleError(err, res);
        }
    };

    updateBanner = async (req, res) => {
        try {
            if (req.file) {
                const banner = await BannerRepository.updateBanner(
                    req.params.id,
                    {
                        title: req.body.title,
                        description: req.body.description,
                        bannerimage: req.file.path,
                    }
                );
                return CResponse({
                    res,
                    message: "OK",
                    data: banner,
                });
            } else {
                const banner = await BannerRepository.updateBanner(
                    req.params.id,
                    {
                        title: req.body.title,
                        description: req.body.description,
                    }
                );
                return CResponse({
                    res,
                    message: "OK",
                    data: banner,
                });
            }
        } catch (error) {
            return handleError(err, res);
        }
    };

    deleteBanner = async (req, res) => {
        try {
            const banner = await BannerRepository.deleteBanner(req.params.id);
            const filePath = path.join(__dirname, banner.bannerimage);
            fs.unlinkSync(filePath);
            return CResponse({
                res,
                message: "OK",
                data: banner,
            });
        } catch (error) {
            return handleError(err, res);
        }
    };
}

module.exports = new BannerController();

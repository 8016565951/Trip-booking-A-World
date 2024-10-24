const aboutRepository = require("../repository/about.repository");
const path = require("path");
const fs = require("fs");
const { CResponse, handleError } = require("../../../../helpers/utils");

class AboutController {
    updateAboutPage = async (req, res) => {
        try {
            const { title, description } = req.body;
            let aboutimage = req.file?.path;

            // delete old image
            if (req.file) {
                const about = await aboutRepository.getAbout();
                if (about.aboutimage) {
                    const oldImage = about.aboutimage;
                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                        console.log("old image deleted: ", oldImage);
                    }
                }
            }

            const updatedAbout = await aboutRepository.updateAbout({
                title,
                description,
                aboutimage,
            });
            console.log(updatedAbout);

            return CResponse(
                res,
                200,
                "About page updated successfully",
                updatedAbout
            );
        } catch (error) {
            return handleError(error, res);
        }
    };
    getAboutPage = async (req, res) => {
        try {
            const about = await aboutRepository.allabout();
            return CResponse(res, 200, "ALL About ", about);
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new AboutController();

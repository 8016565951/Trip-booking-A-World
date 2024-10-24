const fs = require("fs");
const path = require("path");
const aboutRepository = require("../../../api/about/repository/about.repository");
const { handleError } = require("../../../../helpers/utils");
const { AppError } = require("../../../../helpers");
const user = require("../../../api/users/models/user");
class AboutController {
    renderAboutPage = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const aboutData = await aboutRepository.getAbout();
            res.render("about/views/list", {
                title: "About",
                about: aboutData,
                User,
            });
        } catch (error) {
            res.status(500).send("Error fetching About page data");
        }
    };

    updateAboutPage = async (req, res) => {
        try {
            const { title, description } = req.body;
            let aboutimage = req.file ? req.file.path : null;
            if (!title) throw new AppError("Title is required", "NOT_FOUND");

            console.log(aboutimage);

            const about = await aboutRepository.getAbout();
            if (about) {
                if (req.file && about.aboutimage) {
                    const oldImage = path.resolve(about.aboutimage);
                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                        console.log("Old image deleted:", oldImage);
                    }
                }

                const updatedAbout = await aboutRepository.updateAbout({
                    title,
                    description,
                    aboutimage: aboutimage || about.aboutimage,
                });

                console.log(updatedAbout);
            } else {
                const newAbout = await aboutRepository.updateAbout({
                    title,
                    description,
                    aboutimage,
                });
                console.log(newAbout);
            }

            res.redirect("/dashboard/about");
        } catch (error) {
            return handleError(error, res);
        }
    };
}

module.exports = new AboutController();

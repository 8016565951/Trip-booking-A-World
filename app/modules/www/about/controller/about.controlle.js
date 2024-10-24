const { handleError } = require("../../../../helpers/utils");
const aboutRepository = require("../../../api/about/repository/about.repository");
const user = require("../../../api/users/models/user");

class AboutController {
    aboutui= async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const about = await aboutRepository.getAbout();
            res.render("about/views/about", {
                title: "About",
                about,
                User,
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = new AboutController();

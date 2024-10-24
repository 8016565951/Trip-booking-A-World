const UserRepo = require("../../../api/users/repositories/user.repo");
const { handleError } = require("../../../../helpers/utils");
const user = require("../../../api/users/models/user");
const { updateUserSchema } = require("../../../../validations");
const path = require("path");
const fs = require("fs");

class ProfileController {
    profileui = async (req, res) => {
        try {
            const User = await user.findOne({ _id: req.ctx?.user.id });
            console.log(User);
            res.render("profile/views/profile", {
                title: "Profile",
                User,
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    updateProfile = async (req, res) => {
        try {
            const { username, email } = req.body;

            const avatarUrl = req.file.path;

            const user = await UserRepo.updateprofile(req.ctx?.user.id, {
                username,
                email,
                avatarUrl,
            });

            res.redirect("/profile");
        } catch (error) {
            handleError(error, res);
        }
    };
}

module.exports = new ProfileController();

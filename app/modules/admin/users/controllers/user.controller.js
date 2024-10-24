const { AppError } = require("../../../../helpers");
const { handleError } = require("../../../../helpers/utils");
const user = require("../../../api/users/models/user");
const userRepo = require("../../../api/users/repositories/user.repo");

class UserController {
    listUI = async (req, res) => {
        try {
            const users = await userRepo.get();
            const userId = req.ctx?.user.id;
            const User = await user.findOne({ _id: userId });
            const currentUserId = req.ctx?.user.id;
            if (!currentUserId)
                throw new AppError("You need to be logged in", "UNAUTHORIZED");

            return res.render("users/views/list", {
                title: "Users",
                users,
                userId: currentUserId,
                User,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const { id } = req.params;

            const currentUserId = req.ctx?.user.id;
            if (!currentUserId)
                throw new AppError("You need to be logged in", "UNAUTHORIZED");

            const existingUser = await userRepo.getById(id);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            await userRepo.delete(existingUser.id);

            if (currentUserId === existingUser.id)
                res.clearCookie(config.auth.cookies.name);

            return res.redirect(generateDashUrl("users.list.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new UserController();

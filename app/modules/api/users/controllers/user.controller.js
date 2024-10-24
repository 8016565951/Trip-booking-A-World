const { MongooseError } = require("mongoose");
const { AppError } = require("../../../../helpers");
const {
    CResponse,
    handleError,
    generateFileURL,
    getDefaultImageUrl,
    unlinkFile,
    getFilePathFromURL,
} = require("../../../../helpers/utils");
const {
    queryInifniteUserSchema,
    updateUserSchema,
    updatePasswordSchema,
} = require("../../../../validations");
const { comparePassword, hashPassword } = require("../../../../helpers/bcrypt");
const { mailer } = require("../../../../nodemailer");
const config = require("../../../../config");
const userRepo = require("../repositories/user.repo");

class UserController {
    getUsers = async (req, res) => {
        try {
            const { error, value } = queryInifniteUserSchema.validate(
                req.query
            );
            if (error) throw error;

            const { page, limit, paginated } = value;

            if (!paginated) {
                const users = await userRepo.get();

                return CResponse({
                    res,
                    message: "OK",
                    data: users,
                });
            } else {
                const users = await userRepo.getInfinite({
                    options: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: users,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getUser = async (req, res) => {
        try {
            const { id } = req.params;

            const user = await userRepo.getById(id);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: user,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateUser = async (req, res) => {
        try {
            const { error, value } = updateUserSchema.validate(req.body);
            if (error) throw error;

            const { id } = req.params;

            const existingUser = await userRepo.getById(id);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            await userRepo.updateUser(existingUser.id, value);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateAvatar = async (req, res) => {
        try {
            const { id } = req.params;

            const file = req.file;
            if (!file) throw new AppError("No file uploaded", "BAD_REQUEST");

            const existingUser = await userRepo.getById(id);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const avatarUrl = generateFileURL(file);

            if (existingUser.avatarUrl !== getDefaultImageUrl())
                unlinkFile(getFilePathFromURL(existingUser.avatarUrl));

            await userRepo.updateAvatar(existingUser.id, avatarUrl);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            if (!(err instanceof MongooseError)) unlinkFile(req.file?.path);
            return handleError(err, res);
        }
    };

    updatePassword = async (req, res) => {
        try {
            const { id } = req.params;
            const { error, value } = updatePasswordSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getById(id);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const isPasswordValid = await comparePassword(
                value.currentPassword,
                existingUser.password
            );
            if (!isPasswordValid)
                throw new AppError(
                    "Current password is incorrect",
                    "BAD_REQUEST"
                );

            const hashedPassword = await hashPassword(value.newPassword);

            await userRepo.updatePassword(existingUser.id, hashedPassword);

            await mailer.sendPasswordUpdated({
                user: {
                    email: existingUser.email,
                    username: existingUser.username,
                },
            });

            return CResponse({
                res,
                message: "OK",
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

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new UserController();

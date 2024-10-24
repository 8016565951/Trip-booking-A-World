const config = require("../../../../config");
const { AppError } = require("../../../../helpers");
const { hashPassword, comparePassword } = require("../../../../helpers/bcrypt");
const { signJWT } = require("../../../../helpers/jwt");
const {
    handleError,
    CResponse,
    getDefaultImageUrl,
} = require("../../../../helpers/utils");
const { mailer } = require("../../../../nodemailer");
const { createUserSchema, signInSchema } = require("../../../../validations");
const userRepo = require("../../users/repositories/user.repo");

class AuthController {
    /**
     * @param {import ("express").Request} req
     * @param {import ("express").Response} res
     */
    currentUser = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const user = await userRepo.getById(userId);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: {
                    user,
                },
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    /**
     * @param {import ("express").Request} req
     * @param {import ("express").Response} res
     */
    signUp = async (req, res) => {
        try {
            const { error, value } = createUserSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getByEmailOrUsername(
                value.email,
                value.username
            );
            if (existingUser)
                throw new AppError(
                    "A user with the same email or username already exists",
                    "CONFLICT"
                );

            const hashedPassword = await hashPassword(value.password);

            const user = await userRepo.create({
                ...value,
                avatarUrl: getDefaultImageUrl(),
                password: hashedPassword,
            });

            const token = signJWT(
                {
                    id: user.id,
                },
                config.auth.jwt.secret,
                config.auth.jwt.expiresIn
            );

            res.cookie(
                config.auth.cookies.name,
                token,
                config.auth.cookies.options
            );

            await mailer.sendEmailVerification({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });

            return CResponse({
                res,
                message: "CREATED",
                longMessage:
                    "A verification email has been sent to your email address",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    /**
     * @param {import ("express").Request} req
     * @param {import ("express").Response} res
     */
    signIn = async (req, res) => {
        try {
            const { error, value } = signInSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getByEmail(value.email);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const isValidPassword = await comparePassword(
                value.password,
                existingUser.password
            );
            if (!isValidPassword)
                throw new AppError("Invalid password", "UNAUTHORIZED");

            const token = signJWT(
                {
                    id: existingUser.id,
                },
                config.auth.jwt.secret,
                config.auth.jwt.expiresIn
            );

            res.cookie(
                config.auth.cookies.name,
                token,
                config.auth.cookies.options
            );

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    /**
     * @param {import ("express").Request} req
     * @param {import ("express").Response} res
     */
    signOut = async (req, res) => {
        try {
            res.clearCookie(config.auth.cookies.name);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    /**
     * @param {import ("express").Request} req
     * @param {import ("express").Response} res
     */
    verifyEmail = async (req, res) => {
        try {
            const userId = req.ctx?.user.id;
            console.log()
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const user = await userRepo.getById(userId);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            if (user.isVerified)
                throw new AppError("Email already verified", "CONFLICT");

            await userRepo.updateVerification(userId, true);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new AuthController();

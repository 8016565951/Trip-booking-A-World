const config = require("../../../../config");
const { AppError } = require("../../../../helpers");
const { hashPassword, comparePassword } = require("../../../../helpers/bcrypt");
const { signJWT } = require("../../../../helpers/jwt");
const {
    getDefaultImageUrl,
    handleError,
} = require("../../../../helpers/utils");
const { mailer } = require("../../../../nodemailer");
const { signInSchema } = require("../../../../validations");
const userRepo = require("../../../api/users/repositories/user.repo");

class AuthController {
    signInUI = (req, res) => {
        return res.render("auth/views/login", {
            title: "Sign In",
        });
    };

    signIn = async (req, res) => {
        try {
            const { error, value } = signInSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getByEmail(value.email);
            if (!existingUser) {
                res.redirect("/dashboard/auth/admin/signin");
            }

            if (!existingUser.isVerified) {
                res.redirect("/dashboard/auth/admin/signin");
            }
            if (existingUser.role !== "admin") {
                console.log("Not an admin user");
                res.redirect("/dashboard/auth/admin/signin");
            }

            const isValidPassword = await comparePassword(
                value.password,
                existingUser.password
            );
            if (!isValidPassword) {
                res.redirect("/dashboard/auth/admin/signin");
            }

            const token = signJWT(
                {
                    id: existingUser.id,
                    role: existingUser.role,
                },
                config.auth.jwt.secret,
                config.auth.jwt.expiresIn
            );

            res.cookie(
                config.auth.cookies.name,
                token,
                config.auth.cookies.options
            );

            return res.redirect("/dashboard/stats");
        } catch (err) {
            return handleError(err, res);
        }
    };

    signOut = async (req, res) => {
        try {
            res.clearCookie(config.auth.cookies.name);

            return res.redirect("/dashboard/auth/admin/signin");
        } catch (err) {
            return handleError(err, res);
        }
    };
}

module.exports = new AuthController();

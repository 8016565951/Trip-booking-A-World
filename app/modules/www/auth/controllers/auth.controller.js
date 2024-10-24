const config = require("../../../../config");
const { AppError } = require("../../../../helpers");
const { hashPassword, comparePassword } = require("../../../../helpers/bcrypt");
const { signJWT } = require("../../../../helpers/jwt");
const {
    getDefaultImageUrl,
    handleError,
} = require("../../../../helpers/utils");
const { mailer } = require("../../../../nodemailer");
const { createUserSchema, signInSchema } = require("../../../../validations");
const userRepo = require("../../../api/users/repositories/user.repo");
const jwt = require("jsonwebtoken");

class AuthController {
    signUpUI = (req, res) => {
        
        const User = null;
        return res.render("auth/views/signup", {
            title: "Sign Up",
            User,
        });
    };

    signInUI = (req, res) => {
        const User = null;
        return res.render("auth/views/signin", {
            title: "Sign In",
            User,
        });
    };

    verifyEmailUI = (req, res) => {
        const User = null;
        const token = req.params.token;
        return res.render("auth/views/verify-email", {
            title: "Verify Email",
            token,
            User,
        });
    };

    signUp = async (req, res) => {
        try {
            const { error, value } = createUserSchema.validate(req.body);
            
          
            const existingUser = await userRepo.getByEmailOrUsername(
                value.email,
                value.username
            );
            if (existingUser)
            {
                res.redirect("/auth/signup");

            }

            if (value.password !== value.confirmPassword)
                
              {
                res.redirect("/auth/signup");
              }

            const hashedPassword = await hashPassword(value.password);

            const user = await userRepo.create({
                ...value,
                avatarUrl: getDefaultImageUrl(),
                password: hashedPassword,
            });

            const token = signJWT(
                {
                    id: user.id,
                    role: user.role,
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

            return res.redirect("/auth/signin");
        } catch (err) {
            return handleError(err, res);
        }
    };

    signIn = async (req, res) => {
        try {
            const { error, value } = signInSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getByEmail(value.email);
            if (!existingUser.isVerified) {
                res.redirect("/auth/signin");
            }
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
                    email: existingUser.email,
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

            return res.redirect("/home");
        } catch (err) {
            return handleError(err, res);
        }
    };

    signOut = async (req, res) => {
        try {
            res.clearCookie(config.auth.cookies.name);

            return res.redirect("" + generateUrl("auth.signin.ui"));
        } catch (err) {
            return handleError(err, res);
        }
    };

    verifyEmail = async (req, res) => {
        const { token } = req.query;

        try {
            if (!token) {
                console.error(
                    "Token was not provided in the request query." + token
                );
                throw new AppError("Token is required", "BAD_REQUEST");
            }

            const secretKey = process.env.EMAIL_SECRET;

            let decodedToken;
            try {
                decodedToken = jwt.verify(token, secretKey);
            } catch (err) {
                console.error("Token verification failed:", err);
                throw new AppError("Invalid or expired token", "UNAUTHORIZED");
            }

            const userId = decodedToken.id;

            const user = await userRepo.getById(userId);
            if (!user) {
                throw new AppError("User not found", "NOT_FOUND");
            }

            // Check if the user is already verified
            if (user.isVerified) {
                res.redirect("/auth/signin");
            }

            await userRepo.updateVerification(userId, true);

            return res.redirect("/auth/signin");
        } catch (err) {
            console.error("Error during email verification:", err);
            return handleError(err, res);
        }
    };
}

module.exports = new AuthController();

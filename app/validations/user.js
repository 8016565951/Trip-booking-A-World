const Joi = require("joi");

const createUserSchema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/
        )
        .messages({
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        }),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({
            "any.only": "New password and confirm password do not match.",
        }),
    role: Joi.string().valid("admin", "user").default("user"),
});

const updateUserSchema = Joi.object().keys({
    username: Joi.string().required(),
});

const updatePasswordSchema = Joi.object().keys({
    currentPassword: Joi.string()
        .required()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/
        )
        .messages({
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        }),
    newPassword: Joi.string()
        .required()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/
        )
        .messages({
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        }),
    confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": "New password and confirm password do not match.",
        }),
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    updatePasswordSchema,
};

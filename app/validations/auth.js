const Joi = require("joi");

const signInSchema = Joi.object({
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
    role: Joi.string().valid("admin", "user").default("user"),
});

module.exports = {
    signInSchema,
};

const Joi = require("joi");

const queryTokenSchema = Joi.object({
    token: Joi.string().required(),
});

const paramUserSchema = Joi.object({
    id: Joi.string().required(),
});

const queryInifiniteSchema = Joi.object({
    page: Joi.string().optional().default("1"),
    limit: Joi.string().optional().default("10"),
});

const queryInifniteUserSchema = Joi.object({
    page: Joi.string().optional().default("1"),
    limit: Joi.string().optional().default("10"),
    paginated: Joi.string().valid("true").optional(),
});

const queryInifniteCategorySchema = Joi.object({
    page: Joi.string().optional().default("1"),
    limit: Joi.string().optional().default("10"),
    paginated: Joi.string().valid("true").optional(),
});

const queryInifniteProductSchema = Joi.object({
    page: Joi.string().optional().default("1"),
    limit: Joi.string().optional().default("10"),
    paginated: Joi.string().valid("true").optional(),
    cId: Joi.string().optional(),
    duration: Joi.string().optional(),
    type: Joi.string()
        .valid("lte", "gte", "lt", "gt", "eq")
        .default("lte")
        .optional(),
});

module.exports = {
    queryTokenSchema,
    paramUserSchema,
    queryInifiniteSchema,
    queryInifniteUserSchema,
    queryInifniteCategorySchema,
    queryInifniteProductSchema,
};

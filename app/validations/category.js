const Joi = require("joi");

const createCategorySchema = Joi.object({
    name: Joi.string().required(),
});

const updateCategorySchema = Joi.object({
    name: Joi.string(),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};

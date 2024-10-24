const Joi = require("joi");

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    categoryId: Joi.string().required(),
    duration: Joi.number().required(),
    productImage: Joi.string().optional(),
    contactNumber: Joi.string().required(),
    travelers: Joi.string().required(),
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    categoryId: Joi.string().optional(),
    duration: Joi.number().optional(),
    productImage: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    travelers: Joi.string().optional(),
    
});
const activeProductSchema = Joi.object({
    isActive: Joi.string().valid("true", "false").default("true"),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    activeProductSchema
};

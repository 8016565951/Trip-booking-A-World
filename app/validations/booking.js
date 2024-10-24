const Joi = require("joi");

const bookingSchemaValidate = Joi.object({
    bookingId: Joi.string(),

    serviceId: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid service ID format."),

    description: Joi.string().required(),

    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid user ID format."),

    employeeId: Joi.string(),

    address: Joi.string().required(),

    date: Joi.date().required(),

    status: Joi.string()
        .valid("pending", "onprogress", "completed", "cancel")
        .default("pending"),
});

module.exports = bookingSchemaValidate;

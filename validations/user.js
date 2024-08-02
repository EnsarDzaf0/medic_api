const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const updateUserSchema = Joi.object({
    name: Joi.string().optional(),
    username: Joi.string().optional(),
    orders: Joi.number().optional(),
    image: Joi.string().optional(),
    status: Joi.string().optional(),
    dateOfBirth: Joi.date().optional()
});


module.exports = {
    loginSchema,
    updateUserSchema
};
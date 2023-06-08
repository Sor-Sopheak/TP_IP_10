const Joi = require('joi');

module.exports = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required(),
    firstName: Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(6)
        .max(20)
        .required(),
    confirm_password: Joi.ref('password'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()

}).with('password', 'confirm_password');

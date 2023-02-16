const Joi = require('joi');

module.exports.campgroundJoiSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required(),
    }).required()
});


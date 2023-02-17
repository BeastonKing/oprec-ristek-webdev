const Joi = require('joi');

module.exports.postJoiSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required(),
    }).required()
});


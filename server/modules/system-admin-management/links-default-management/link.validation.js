const Joi = require('@hapi/joi');

exports.createValidation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            url: Joi.string()
                .required(),
            description: Joi.string()
                .required()
        });
        const { error } = await schema.validate({
            url: req.body.url,
            description: req.body.description
        });
        if(error) throw(error);

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}

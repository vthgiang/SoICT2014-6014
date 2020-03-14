const Joi = require('@hapi/joi');

exports.createValidation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            name: Joi.string()
                .required(),
            short_name: Joi.string()
                .required(),
            description: Joi.string()
                .required(),
            email: Joi.string()
                .email()
                .required()
        });
        const { error } = await schema.validate({
            name: req.body.name,
            short_name: req.body.short_name,
            description: req.body.description,
            email: req.body.email
        });
        if(error) throw(error);

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}

exports.editValidation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            name: Joi.string()
                .required(),
            short_name: Joi.string()
                .required(),
            description: Joi.string()
                .required(),
            log: Joi.required()
        });
        const { error } = await schema.validate({
            name: req.body.name,
            short_name: req.body.short_name,
            description: req.body.description,
            log: req.body.log
        });
        if(error) throw(error);

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}
const Joi = require('@hapi/joi');

exports.validation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            name: Joi.string()
                .required()
        });
        const { error } = await schema.validate({
            name: req.body.name
        });
        if(error) throw(error);

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}
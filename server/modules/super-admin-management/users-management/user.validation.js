const Joi = require('@hapi/joi');

exports.createValidation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            name: Joi.string()
                .required(),
            email: Joi.string()
                .min(10)
                .required()
                .email(),
        });
        const { error } = await schema.validate(req.body);
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
                .required()
        });
        const { error } = await schema.validate({
            name: req.body.name
        });
        if(error){
            console.log(error);
            throw(error)
        };

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}
const Joi = require('@hapi/joi');

exports.createValidation = async (req, res, next) => {
    try {
        const schema = await Joi.object({
            name: Joi.string()
                .required(),
            description: Joi.string()
                .required(),
            dean: Joi.string()
                .required(),
            vice_dean: Joi.string()
                .required(),
            employee: Joi.string()
                .required()
        });
        const { error } = await schema.validate({
            name: req.body.name,
            description: req.body.description,
            dean: req.body.dean,
            vice_dean: req.body.vice_dean,
            employee: req.body.employee
        });
        if(error){
            console.log(error);
            throw(error);
        };

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}
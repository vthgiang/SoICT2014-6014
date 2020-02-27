const Joi = require('@hapi/joi');

exports.createValidation = async (req, res, next) => {
    try {
        if(!Array.isArray(req.body.parents)) throw {message: 'array_invalid'};
        const schema = await Joi.object({
            name: Joi.string()
                .required(),
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

exports.editValidation = async (req, res, next) => {
    try {
        if(!Array.isArray(req.body.parents)) throw {message: 'array_invalid'};
        const schema = await Joi.object({
            name: Joi.string()
                .required()
        });
        const { error } = await schema.validate({
            name: req.body.name
        });
        if(error){
            console.log("CÓ LỖI VALIDATE", error);
            throw(error);
        }

        next();
    } catch (err) {
        res.status(400).json({ message: 'field_invalid' });
    }   
}
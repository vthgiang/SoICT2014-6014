const Company = require('../../models/company.model');

exports.get = async (req, res) => {
    
    return await Company.find();
}

exports.getById = async (req, res) => {
    
    return await Company.findById(req.params.id);
}

exports.create = async(req, res) => {
    var test = await Company.findOne({ short_name: req.body.short_name });
    if(test) return res.status(400).json({ msg: 'Short name already exists' });
    
    return await Company.create({
        name: req.body.name,
        description: req.body.description,
        short_name: req.body.short_name
    });
}

exports.edit = async(req, res) => {
    var company = await Company.findById(req.params.id);
    if(company.short_name !== req.body.short_name){
        //check shortname invalid?
        var test = await Company.findOne({ short_name: req.body.short_name }); 
        if(test) return res.status(400).json({ msg: 'Short name already exists' }); 
    }
    company.name = req.body.name,
    company.description = req.body.description,
    company.short_name = req.body.short_name
    company.save();

    return company;
}

exports.delete = async(req, res) => {

    return await Company.deleteOne({ _id: req.params.id });
}
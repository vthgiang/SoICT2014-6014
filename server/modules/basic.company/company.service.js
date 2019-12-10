const Company = require('../../models/company.model');

exports.get = async () => {
    
    return await Company.find();
}

exports.getById = async (id) => {
    
    return await Company.findById(id);
}

exports.create = async(data) => {
    var test = await Company.findOne({ short_name: data.short_name });
    if(test) throw { msg: 'Short name already exists' };
    
    return await Company.create({
        name: data.name,
        description: data.description,
        short_name: data.short_name
    });
}

exports.edit = async(id, data) => {
    var company = await Company.findById(id);
    if(company.short_name !== data.short_name){
        //check shortname invalid?
        var test = await Company.findOne({ short_name: data.short_name }); 
        if(test) throw { msg: 'Short name already exists' }; 
    }
    company.name = data.name;
    company.description = data.description;
    company.short_name = data.short_name;
    company.save();

    return company;
}

exports.delete = async(id) => {

    return await Company.deleteOne({ _id: id });
}
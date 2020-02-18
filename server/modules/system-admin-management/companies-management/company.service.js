const Company = require('../../../models/company.model');

exports.get = async () => {
    
    return await Company.find();
}

exports.getById = async (id) => {
    
    return await Company.findById(id);
}

exports.getPaginate = async (limit, page, data={}) => {
    const newData = await Object.assign( {}, data );
    return await Company
        .paginate( newData , { 
            page, 
            limit
        });
}

exports.create = async(data) => {
    var name = await Company.findOne({ name: data.name });
    var test = await Company.findOne({ short_name: data.short_name });
    if(name || test) throw { msg: 'Short name already exists' };
    
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
    if(data.name !== null) company.name = data.name;
    if(data.description !== null) company.description = data.description;
    if(data.short_name !== null) company.short_name = data.short_name;
    if(data.active !== null) company.active = data.active;
    company.save();

    return company;
}

exports.delete = async(id) => {

    return await Company.deleteOne({ _id: id });
}
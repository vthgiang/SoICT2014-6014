const Company = require('../../../models/company.model');

exports.get = async () => {
    
    return await Company.find({customer: true});
}

exports.getById = async (id) => {
    
    return await Company.findOne({_id: id, customer: true});
}

exports.getPaginate = async (limit, page, data={}) => {
    const newData = await Object.assign( {customer: true}, data );
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
    console.log("data com:", data);
    var company = await Company.findOne({_id: id, customer: true});
    if(company.short_name !== data.short_name){
        //check shortname invalid?
        var test = await Company.findOne({ short_name: data.short_name }); 
        if(test) throw { msg: 'Short name already exists' }; 
    }
    company.name = data.name;
    company.description = data.description;
    company.short_name = data.short_name;
    company.log = data.log;
    if(data.active !== null) company.active = data.active;
    company.save();

    return company;
}

exports.delete = async(id) => {

    return await Company.deleteOne({ _id: id, customer: true });
}
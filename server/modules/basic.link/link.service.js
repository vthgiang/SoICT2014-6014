const Link = require('../../models/link.model');

exports.get = async () => {

    return await Link.find();
}

exports.getById = async (id) => {

    return await Link.findById(id);
}

exports.create = async(data) => {

    return await Link.create({
        url: data.url,
        description: data.description,
        company: data.company
    });
}

exports.edit = async(id, data) => {
    var link = await Link.findById(id);
    link.url = data.url;
    link.description = data.description;
    link.company = data.company ? data.company : link.company;
    link.save();

    return link;
}

exports.delete = async(id) => {
    
    return await Link.deleteOne({ _id: id});
}

/*----------------------------------------------------------
-----------------Manage links of 1 company -----------------
-----------------------------------------------------------*/

exports.getLinksOfCompany = async(id) => {

    return await Link.find({ company: id });
} 

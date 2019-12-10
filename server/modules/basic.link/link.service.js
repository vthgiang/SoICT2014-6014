const Link = require('../../models/link.model');

exports.get = async (req, res) => {

    return await Link.find();
}

exports.getById = async (req, res) => {

    return await Link.findById(req.params.id);
}

exports.create = async(req, res) => {

    return await Link.create({
        url: req.body.url,
        description: req.body.description,
        company: req.body.company
    });
}

exports.edit = async(req, res) => {
    var link = await Link.findById(req.params.id);
    link.url = req.body.url;
    link.description = req.body.description;
    link.company = req.body.company ? req.body.company : link.company;
    link.save();

    return link;
}

exports.delete = async(req, res) => {
    
    return await Link.deleteOne({ _id: req.params.id });
}

/*----------------------------------------------------------
-----------------Manage links of 1 company -----------------
-----------------------------------------------------------*/

exports.getLinksOfCompany = async(req, res) => {

    return await Link.find({ company: req.params.idCompany });
} 

exports.getLinkOfCompanyById = async(req, res) => {

    return await Link.findOne({ 
        _id: req.params.id,
        company: req.params.idCompany,
    });
}


const Privilege = require('../../models/privilege.model');

exports.get = async (req, res) => {

    return await Link.find();
}

exports.getById = async (req, res) => {

    return await Link.findById(req.params.id);
}

exports.create = async(req, res) => {

    return await Link.create({
        url: req.body.url,
        description: req.body.description
    });
}

exports.edit = async(req, res) => {
    var link = await Link.findById(req.params.id);
    link.url = req.body.url;
    link.description = req.body.description;
    link.save();

    return link;
}

exports.delete = async(req, res) => {
    
    return await Link.deleteOne({ _id: req.params.id });
}
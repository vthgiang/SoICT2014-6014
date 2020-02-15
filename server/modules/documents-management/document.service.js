const Document = require('../../models/document.model');
const DocumentType = require('../../models/documentType.model');

exports.get = async (company) => {
    return await Document.find({ company });
}

exports.getById = async (company, _id) => {
    return await Document.findOne({ _id, company })
}

exports.create = async(data) => {
    //code here
}

exports.edit = async(id, data) => {
    //code here}
}

exports.delete = async(id) => {
    //code here
}


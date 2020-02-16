const Document = require('../../models/document.model');
const DocumentType = require('../../models/documentType.model');

exports.get = async (company) => {
    return await Document.find({ company });
}

exports.getById = async (company, _id) => {
    return await Document.findOne({ _id, company })
}

exports.create = async(company, data) => {
    return await Document.create({
        company,
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        dataApply: data.dateApply,
        version: data.version,
        relationship: data.relationship,
        storageLocation: data.storageLocation
    });
}

exports.createDocumentType = async (company, data) => {

}

exports.edit = async(id, data) => {
    //code here}
}

exports.delete = async(id) => {
    //code here
}


const {DocumentType} = require('../../models').schema;

exports.getDocumentTypes = async (company) => {
    return await DocumentType.find({ company });
}

exports.createDocumentType = async (company, data) => {
    return await DocumentType.create({
        company,
        name: data.name,
        description: data.description
    });
}

exports.edit = async(id, data) => {
    //code here}
}

exports.delete = async(id) => {
    //code here
}


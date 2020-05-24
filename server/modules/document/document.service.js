const {DocumentCategory, DocumentDomain} = require('../../models').schema;
const arrayToTree = require('array-to-tree');

exports.getDocumentCategories = async (company) => {
    return await DocumentCategory.find({ company });
}

exports.createDocumentCategory = async (company, data) => {
    return await DocumentCategory.create({
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

// Danh mục văn bản - domain
exports.getDocumentDomains = async (company) => {
    const list = await DocumentDomain.find({ company });
    const dataConverted = list.map( domain => {
        return {
            id: domain._id.toString(),
            key: domain._id.toString(),
            value: domain._id.toString(),
            title: domain.name,
            parent_id: domain.parent !== undefined ? domain.parent.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});

    return {list, tree};
}

exports.createDocumentDomain = async (company, data) => {
    await DocumentDomain.create({
        company,
        name: data.name,
        description: data.description,
        parent: data.parent
    });

    return await this.getDocumentDomains(company);
}

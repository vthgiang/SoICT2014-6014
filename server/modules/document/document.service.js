const {DocumentCategory, DocumentDomain} = require('../../models').schema;
const arrayToTree = require('array-to-tree');

/**
 * Lấy danh sách tất cả các tài liệu văn bản
 * @company id của công ty
 */
exports.getDocuments = async (company) => {
    var list = await Document.find({ company });
    var paginate;
    return {list, paginate};
}

/**
 * Tạo một tài liệu văn bản mới
 */
exports.createDocument = async (company, data) => {
    return await Document.create({
        company,
        name: data.name,
        domains: data.domains,
        category: data.category,
        description: data.description,

        versionName: data.name,
        issuingBody: data.issuingBody,
        officialNumber: data.officialNumber,
        issuingDate: data.issuingDate,
        effectiveDate: data.effectiveDate,
        expiredDate: data.expiredDate,
        signer: data.signer,
        file: data.file,
        scannedFileOfSignedDocument: data.scannedFileOfSignedDocument,

        relationship: {
            description: data.relationship !== undefined ? data.relationship.description : undefined,
            documents: data.relationship !== undefined ? data.relationship.documents : undefined
        },
        roles: data.roles,
        archivedRecordPlace: {
            information: data.archivedRecordPlace !== undefined ? data.archivedRecordPlace.information : undefined,
            organizationalUnit: data.archivedRecordPlace !== undefined ? data.archivedRecordPlace.organizationalUnit: undefined,
            manager: data.archivedRecordPlace !== undefined ? data.archivedRecordPlace.manager : undefined
        }
    });
}

/**
 * Lấy tất cả các loại văn bản
 */
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

/**
 * Danh mục văn bản
 */
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

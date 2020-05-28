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

        versionName: data.versionName,
        issuingBody: data.issuingBody,
        officialNumber: data.officialNumber,
        issuingDate: data.issuingDate,
        effectiveDate: data.effectiveDate,
        expiredDate: data.expiredDate,
        signer: data.signer,
        file: data.file,
        scannedFileOfSignedDocument: data.scannedFileOfSignedDocument,

        relationshipDescription: data.relationshipDescription !== 'undefined' ? data.relationshipDescription : undefined ,
        relationshipDocuments: data.relationshipDocuments !== 'undefined' ? data.relationshipDocuments : undefined,

        roles: data.roles,

        archivedRecordPlaceInfo: data.archivedRecordPlaceInfo !== 'undefined'?data.archivedRecordPlaceInfo:undefined ,
        archivedRecordPlaceOrganizationalUnit: data.archivedRecordPlaceOrganizationalUnit,
        archivedRecordPlaceManager: data.archivedRecordPlaceManager !== 'undefined' ? data.archivedRecordPlaceManager : undefined
    });
}

/**
 * Chỉnh sửa thông tin tài liệu văn bản
 */
exports.editDocument = async (id, data) => {
    const doc = await Document.findById(id);
    if(doc.versionName !== data.versionName) // ghi nhận là thay thành một phiên bản mới khác
    doc.versions.push(doc);

    doc.name = data.name
    doc.domains = data.domains
    doc.category = data.category
    doc.description = data.description

    doc.versionName = data.versionName
    doc.issuingBody = data.issuingBody
    doc.officialNumber = data.officialNumber
    doc.issuingDate = data.issuingDate
    doc.effectiveDate = data.effectiveDate
    doc.expiredDate = data.expiredDate
    doc.signer = data.signer
    doc.file = data.file
    doc.scannedFileOfSignedDocument = data.scannedFileOfSignedDocument

    doc.relationshipDescription = data.relationshipDescription 
    doc.relationshipDocuments = data.relationshipDocuments

    doc.roles = data.roles

    doc.archivedRecordPlaceInfo = data.archivedRecordPlaceInfo 
    doc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit
    doc.archivedRecordPlaceManager = data.archivedRecordPlaceManager 

    await doc.save();

    return doc;
}

exports.downloadDocumentFile = async (id) => {
    const file = await Document.findById(id);
    file.numberOfDownload += 1;
    await file.save();
    return {
        path: file.file,
        name: file.name
    };
}

exports.downloadDocumentFileScan = async (id) => {
    const file = await Document.findById(id);
    file.numberOfDownload += 1;
    await file.save();
    return {
        path: file.file,
        name: file.scannedFileOfSignedDocument
    };
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

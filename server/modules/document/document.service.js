const {DocumentCategory, DocumentDomain} = require('../../models').schema;
const arrayToTree = require('array-to-tree');
const fs = require('fs');

/**
 * Lấy danh sách tất cả các tài liệu văn bản
 * @company id của công ty
 */
exports.getDocuments = async (company, query) => {
    console.log("query: ", query)
    var page = query.page;
    var limit = query.limit;
    
    if(page === undefined && limit === undefined ){
        
        return await Document.find({company}).populate([
            { path: 'category', model: DocumentCategory},
            { path: 'domains', model: DocumentDomain},
        ]);
    }else{
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {};
        console.log("option: ", option);
        return await Document.paginate( option , { 
            page, 
            limit,
            populate: [
                { path: 'category', model: DocumentCategory},
                { path: 'domains', model: DocumentDomain},
            ]
        });
    }
}

/**
 * Lấy thông tin về một tài liệu văn bản
 */
exports.showDocument = async (id) => {
    return await Document.findById(id).populate([
        { path: 'category', model: DocumentCategory},
        { path: 'domains', model: DocumentDomain},
    ]);
}

exports.increaseNumberView = async (id) => {
    const doc = await Document.findById(id);

    doc.numberOfView += 1;
    await doc.save();

    return doc;
}


/**
 * Tạo một tài liệu văn bản mới
 */
exports.createDocument = async (company, data) => {
    const doc = await Document.create({
        company,
        name: data.name,
        domains: data.domains,
        category: data.category,
        description: data.description,
        issuingBody: data.issuingBody,
        signer: data.signer,
        officialNumber: data.officialNumber,
        
        versions: [{
            versionName: data.versionName,
            issuingDate: data.issuingDate,
            effectiveDate: data.effectiveDate,
            expiredDate: data.expiredDate,
            file: data.file,
            scannedFileOfSignedDocument: data.scannedFileOfSignedDocument,
        }],

        relationshipDescription: data.relationshipDescription !== 'undefined' ? data.relationshipDescription : undefined ,
        relationshipDocuments: data.relationshipDocuments !== 'undefined' ? data.relationshipDocuments : undefined,

        roles: data.roles,

        archivedRecordPlaceInfo: data.archivedRecordPlaceInfo !== 'undefined'?data.archivedRecordPlaceInfo:undefined ,
        archivedRecordPlaceOrganizationalUnit: data.archivedRecordPlaceOrganizationalUnit,
        archivedRecordPlaceManager: data.archivedRecordPlaceManager !== 'undefined' ? data.archivedRecordPlaceManager : undefined
    });

    return await Document.findById(doc._id).populate([
        { path: 'category', model: DocumentCategory},
        { path: 'domains', model: DocumentDomain},
    ]);
}

/**
 * Chỉnh sửa thông tin tài liệu văn bản
 */
exports.editDocument = async (id, data, query=undefined) => {
    const doc = await Document.findById(id);
    console.log("EDIT QUERY:", query)

    if(query !== undefined && Object.keys(query).length > 0){
        switch(query.option) {
            case 'ADD_VERSION':
                doc.versions.push(data);
                console.log("doc version new: ", doc);
                await doc.save();

                return doc;

            case 'EDIT_VERSION':
                return doc;

            case 'DELETE_VERSION':
                return doc;

            default:
                return doc;
        }
    }else{
        doc.name = data.name
        doc.domains = data.domains
        doc.category = data.category
        doc.description = data.description
        doc.issuingBody = data.issuingBody
        doc.officialNumber = data.officialNumber
        doc.signer = data.signer
    
        doc.relationshipDescription = data.relationshipDescription 
        doc.relationshipDocuments = data.relationshipDocuments
    
        doc.roles = data.roles
    
        if(data.archivedRecordPlaceInfo !== 'undefined' && data.archivedRecordPlaceInfo !== undefined) 
            doc.archivedRecordPlaceInfo = data.archivedRecordPlaceInfo 
        if(data.archivedRecordPlaceOrganizationalUnit !== 'undefined' && data.archivedRecordPlaceOrganizationalUnit !== undefined) 
            doc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit
        if(data.archivedRecordPlaceManager !== 'undefined' && data.archivedRecordPlaceManager !== undefined) 
            doc.archivedRecordPlaceManager = data.archivedRecordPlaceManager 
    
        await doc.save();
    
        return doc;
    }
}

exports.deleteDocument = async (id) => {
    const doc = await Document.findById(id);
    console.log("DOCUMENT DELETE: ", doc)
    for (let i = 0; i < doc.versions.length; i++) {
        if(fs.existsSync(doc.versions[i].file)) fs.unlinkSync(doc.versions[i].file);
        if(fs.existsSync(doc.versions[i].scannedFileOfSignedDocument)) fs.unlinkSync(doc.versions[i].scannedFileOfSignedDocument);
    }
    await Document.deleteOne({_id: id});

    return doc;
}

exports.downloadDocumentFile = async (id, numberVersion) => {
    const doc = await Document.findById(id);
    if(doc.versions.length < numberVersion) throw ['cannot_download_doc_file', 'version_not_found'];
    doc.numberOfDownload += 1;
    await doc.save();
    console.log("DOC dơn:", doc)
    return {
        path: doc.versions[numberVersion].file,
        name: doc.name
    };
}

exports.downloadDocumentFileScan = async (id, numberVersion) => {
    const doc = await Document.findById(id);
    if(doc.versions.length < numberVersion) throw ['cannot_download_doc_file_scan', 'version_scan_not_found'];
    doc.numberOfDownload += 1;
    await doc.save();

    return {
        path: doc.versions[numberVersion].scannedFileOfSignedDocument,
        name: doc.name
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

exports.editDocumentCategory = async(id, data) => {
    console.log("DFDFD:", id, data)
    const category = await DocumentCategory.findById(id);
    category.name = data.name;
    category.description = data.description;
    await category.save();

    return category;
}

exports.deleteDocumentCategory = async(id) => {
    const category = await DocumentCategory.findById(id);
    const docs = await Document.find({category: id});
    if(docs.length > 0) throw ['category_used_to_document', 'cannot_delete_category'];
    await DocumentCategory.deleteOne({_id: id});

    return category;
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

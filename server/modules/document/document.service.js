const { DocumentCategory, DocumentDomain, DocumentArchive, Role, User, UserRole, OrganizationalUnit, Document } = require('../../models').schema;
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Lấy danh sách tất cả các tài liệu văn bản
 * @company id của công ty
 */
exports.getDocuments = async (company, query) => {
    console.log('ttt', query);
    let page = query.page;
    let limit = query.limit;

    if (!(page || limit)) {

        return await Document.find({ company }).populate([
            { path: 'category', model: DocumentCategory, select: 'name id' },
            { path: 'domains', model: DocumentDomain, select: 'name id' },
            { path: 'archives', model: DocumentArchive, select: 'name id path' },
            { path: 'views.viewer', model: User, select: 'name id' },
            { path: "downloads.downloader", model: User, select: 'name id' },
            { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
            { path: "logs.creator", model: User, select: 'name id' },
            { path: "relationshipDocuments", model: Document, select: "name id" },
        ]);
    } else {
        let option = {
            company: company,
        };
        // const option = (query.key !== undefined && query.value !== undefined)
        //     ? Object.assign({ company }, { [`${query.key}`]: new RegExp(query.value, "i") })
        //     : { company };
        if (query.category) {
            option.category = query.category;
        }
        if (query.domains) {
            option.domains = query.domains;
        }
        if (query.archives) {
            option.archives = query.archives
        }
        if (query.name) {
            option.name = new RegExp(query.name, "i")
        }
        console.log("option: ", option);
        return await Document.paginate(option, {
            page,
            limit,
            populate: [
                { path: 'category', model: DocumentCategory, select: 'name id' },
                { path: 'domains', model: DocumentDomain, select: 'name id' },
                { path: 'archives', model: DocumentArchive, select: 'name id path' },
                { path: 'views.viewer', model: User, select: 'name id' },
                { path: "downloads.downloader", model: User, select: 'name id' },
                { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
                { path: "logs.creator", model: User, select: 'name id' },
                { path: "relationshipDocuments", model: Document, select: "name id" },

            ]
        });
    }
}

/**
 * Lấy thông tin về một tài liệu văn bản
 */
exports.showDocument = async (id, viewer) => {
    const doc = await Document.findById(id).populate([
        { path: 'category', model: DocumentCategory, select: 'name id' },
        { path: 'archives', model: DocumentArchive, select: 'name id path' },

    ]);
    doc.numberOfView += 1;
    const getIndex

        = (array, value) => {
            let res = -1;
            for (let i = 0; i < array.length; i++) {
                if (array[i].viewer.toString() === value.toString()) {
                    res = i;
                    break;
                }
            }

            return res;
        }
    let index = getIndex(doc.views, viewer);
    if (index !== -1) doc.views.splice(index, 1);
    doc.views.push({ viewer });
    await doc.save();

    return doc;
}

exports.increaseNumberView = async (id, viewer) => {
    const doc = await Document.findById(id);
    doc.numberOfView += 1;
    const getIndex = (array, value) => {
        let res = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].viewer.toString() === value.toString()) {
                res = i;
                break;
            }
        }

        return res;
    }
    let index = getIndex(doc.views, viewer);
    if (index !== -1) doc.views.splice(index, 1);
    doc.views.push({ viewer });
    await doc.save();

    return doc;
}


/**
 * Tạo một tài liệu văn bản mới
 */
exports.createDocument = async (company, data) => {
    console.log('create', data)
    const newDoc = {
        company,
        name: data.name,
        domains: data.domains,
        archives: data.archives,
        category: data.category,
        description: data.description,
        issuingBody: data.issuingBody,
        signer: data.signer,
        officialNumber: data.officialNumber,
        relationshipDocuments: data.relationshipDocuments,
        versions: [{
            versionName: data.versionName,
            issuingDate: (data.issuingDate === 'Invalid date') ? "" : data.issuingDate,
            effectiveDate: data.effectiveDate,
            expiredDate: data.expiredDate,
            file: data.file,
            scannedFileOfSignedDocument: data.scannedFileOfSignedDocument,
        }],
        roles: data.roles,
    }
    if (data.relationshipDescription !== 'undefined') newDoc.relationshipDescription = data.relationshipDescription;
    if (data.archivedRecordPlaceInfo !== 'undefined') newDoc.archivedRecordPlaceInfo = data.archivedRecordPlaceInfo;
    if (data.archivedRecordPlaceOrganizationalUnit !== 'undefined') newDoc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit;

    const doc = await Document.create(newDoc);

    return await Document.findById(doc._id).populate([
        { path: 'category', model: DocumentCategory, select: 'name id' },
        { path: 'domains', model: DocumentDomain, select: 'name id' },
        { path: 'archives', model: DocumentArchive, select: 'name id path' },
    ]);
}

/**
 * Chỉnh sửa thông tin tài liệu văn bản
 */
exports.editDocument = async (id, data, query = undefined) => {
    // thêm lịch sử chỉnh sửa
    console.log('querry', query, data);
    let { creator, title, descriptions } = data;
    let createdAt = Date.now();
    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: descriptions,
    }

    let document = await Document.findByIdAndUpdate(
        id,
        {
            $push: { logs: log }
        },
        { new: true }
    )
    // chỉnh sửa
    if (query !== undefined && Object.keys(query).length > 0) {

        const doc = await Document.findById(id);
        switch (query.option) {
            case 'ADD_VERSION':
                doc.versions.push(data);
                await doc.save();

                return doc;

            case 'EDIT_VERSION':
                return doc;

            case 'DELETE_VERSION':
                return doc;

            default:
                return doc;
        }
    } else {
        const doc = await Document.findById(id);
        if (doc.name !== data.name) {
            doc.name = data.name
        }
        if (data.domains) {
            doc.domains = data.domains
        }
        if (data.archives) {
            doc.archives = data.archives
        }
        if (data.category) {
            doc.category = data.category
        }
        if (data.description) {
            doc.description = data.description
        }
        if (data.issuingBody) {
            doc.issuingBody = data.issuingBody
        }
        if (data.officialNumber) {
            doc.officialNumber = data.officialNumber
        }
        if (data.signer) {
            doc.signer = data.signer
        }

        if (data.relationshipDescription) {
            doc.relationshipDescription = data.relationshipDescription
        }
        if (data.relationshipDocuments) {
            doc.relationshipDocuments = data.relationshipDocuments
        }

        if (data.roles) {
            doc.roles = data.roles
        }

        // if (data.archivedRecordPlaceInfo !== 'undefined' && data.archivedRecordPlaceInfo !== undefined)
        //     doc.archivedRecordPlaceInfo = data.archivedRecordPlaceInfo
        if (data.archivedRecordPlaceOrganizationalUnit && data.archivedRecordPlaceOrganizationalUnit !== "[object Object]") {
            //  console.log(data.archivedRecordPlaceOrganizationalUnit)
            doc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit
        }
        if (data.archivedRecordPlaceManagerd)
            doc.archivedRecordPlaceManager = data.archivedRecordPlaceManager

        await doc.save();
        let docs = doc.logs.reverse();
        return doc;
    }
}

exports.deleteDocument = async (id) => {
    const doc = await Document.findById(id);

    for (let i = 0; i < doc.versions.length; i++) {
        if (fs.existsSync(doc.versions[i].file)) fs.unlinkSync(doc.versions[i].file);
        if (fs.existsSync(doc.versions[i].scannedFileOfSignedDocument)) fs.unlinkSync(doc.versions[i].scannedFileOfSignedDocument);
    }
    await Document.deleteOne({ _id: id });

    return doc;
}

// exports.addDocumentLog = async (params, body) => {
//     let { creator, title, description } = body;
//     let log = {
//         creator: creator,
//         title: title,
//         description: description,
//         createdAt: Date.now,
//     }
//     let document = await Document.findByIdAndUpdate(
//         params.id,
//         {
//             $push: { logs: log }
//         },
//         { new: true }
//     ).populate({ path: "logs.creator", model: User, select: "name id" })
//     let documentLog = document.logs.reserve();
//     return documentLog;
// }

/**
 * Download File and File Scan
 * @param {} data: id(document), numberofVersion, downloaderId (id of user, who downloaded this document)
 *  
 */
exports.downloadDocumentFile = async (data) => {
    console.log("dataaa", data);
    const doc = await Document.findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file', 'version_not_found'];
    await downloadFile(doc, data.downloaderId)
    return {
        path: doc.versions[data.numberVersion].file ? doc.versions[data.numberVersion].file : "",
        name: doc.name
    };
}

exports.downloadDocumentFileScan = async (data) => {
    const doc = await Document.findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file_scan', 'version_scan_not_found'];
    await downloadFile(doc, data.downloaderId)
    console.log('eeeeee', doc.versions[data.numberVersion].scannedFileOfSignedDocument)
    return {
        path: doc.versions[data.numberVersion].scannedFileOfSignedDocument ? doc.versions[data.numberVersion].scannedFileOfSignedDocument : "",
        name: doc.name
    };
}
// hàm thực hiện download 
async function downloadFile(doc, downloaderId) {
    doc.numberOfDownload += 1;
    const getIndex = (array, value) => {
        let res = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].downloader.toString() === value.toString()) {
                res = i;
                break;
            }
        }

        return res;
    }
    let index = getIndex(doc.downloads, downloaderId);
    if (index !== -1) doc.downloads.splice(index, 1);
    doc.downloads.push({ downloader: downloaderId });
    await doc.save();
}

exports.importDocument = async (company, data) => {
    console.log('uuuu', data)

    for (let i in data) {
        let document = {
            name: data[i].name,
            description: data[i].description,
            issuingBody: data[i].issuingBody,
            signer: data[i].signer,
            officialNumber: data[i].officialNumber,
            versionName: data[i].versionName,
            issuingDate: data[i].issuingDate,
            effectiveDate: data[i].effectiveDate,
            expiredDate: data[i].expiredDate,
            relationshipDescription: data[i].relationshipDescription,
        }

        // find category
        if (data[i].category) {
            const category = await DocumentCategory.findOne({ name: data[i].category });
            if (category) {
                document.category = category.id;
            }
        }

        // find archivedRecordPlaceOrganizationalUnit
        if (data[i].organizationUnitManager) {
            const unit = await OrganizationalUnit.findOne({
                $and: [
                    { company: company },
                    { name: data[i].organizationUnitManager },
                ]
            })
            if (unit) {
                document.archivedRecordPlaceOrganizationalUnit = unit.id;
            }
        }

        // find domain
        if (data[i].domains && data[i].domains.length) {
            let domains = [];
            for (let j in data[i].domains) {
                const domain = await DocumentDomain.findOne({ name: data[i].domains[j] });
                if (domain) {
                    domains.push(domain.id);
                }
            }
            document.domains = domains;
        }

        // find archive

        if (data[i].archives && data[i].archives.length) {
            let archives = [];
            for (let j in data[i].archives) {
                let path = data[i].archives[j].split('-').map(x => { return x.trim() }).join(" - ");
                console.log('pathhh', path);
                const Archive = await DocumentArchive.findOne({ path: path });
                if (Archive) {
                    archives.push(Archive.id);
                }
            }
            document.archives = archives;
        }

        // file role

        if (data[i].roles && data[i].roles.length) {
            let roles = [];
            for (let j in data[i].roles) {
                const role = await Role.findOne({
                    $and: [
                        { company: company },
                        { name: data[i].roles[j] }
                    ]
                });
                roles.push(role.id);
            }
            document.roles = roles;
        }

        // find document relation ship
        if (data[i].relationshipDocuments && data[i].relationshipDescription.length) {
            let relationshipDocuments = [];
            for (let j in relationshipDocuments) {
                let document = await Document.findOne({ name: data[i].relationshipDocuments[j] });
                relationshipDocuments.push(document.id);
            }
            document.relationshipDocuments = relationshipDocuments;
        }

        let res = await this.createDocument(company, document);


    }
    let query = { page: '1', limit: '5' }
    return await this.getDocuments(company, query);
}


/**
 * Lấy tất cả các loại văn bản
 */
exports.getDocumentCategories = async (company, query) => {

    let page = query.page;
    let limit = query.limit;

    if (page === undefined && limit === undefined) {

        return await DocumentCategory.find({ company });
    } else {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({ company }, { [`${query.key}`]: new RegExp(query.value, "i") })
            : { company };
        return await DocumentCategory.paginate(option, { page, limit });
    }
}

exports.createDocumentCategory = async (company, data) => {
    return await DocumentCategory.create({
        company,
        name: data.name,
        description: data.description
    });
}

exports.editDocumentCategory = async (id, data) => {

    const category = await DocumentCategory.findById(id);
    category.name = data.name;
    category.description = data.description;
    await category.save();

    return category;
}

exports.deleteDocumentCategory = async (id) => {
    const category = await DocumentCategory.findById(id);
    const docs = await Document.find({ category: id });
    if (docs.length > 0) throw ['category_used_to_document', 'cannot_delete_category'];
    await DocumentCategory.deleteOne({ _id: id });

    return category;
}

/**
 * import các loại tài liệu từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentCategory = async (company, data) => {
    for (let i in data) {
        description = data[i].description;
        let category = {
            name: data[i].name,
            description: data[i].description,
        }

        console.log(category);
        let res = await this.createDocumentCategory(company, category);

    }
    return await this.getDocumentDomains(company);
}

/**
 * Danh mục văn bản
 */
exports.getDocumentDomains = async (company) => {
    const list = await DocumentDomain.find({ company });
    //console.log(list, 'list')
    const dataConverted = list.map(domain => {
        return {
            id: domain._id.toString(),
            key: domain._id.toString(),
            value: domain._id.toString(),
            label: domain.name,
            title: domain.name,
            parent_id: domain.parent !== undefined ? domain.parent.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});

    return { list, tree };
}

exports.createDocumentDomain = async (company, data) => {
    let query = {
        company,
        name: data.name,
        description: data.description,
    }
    await DocumentDomain.create(query);

    return await this.getDocumentDomains(company);
}

exports.getDocumentsThatRoleCanView = async (company, query) => {
    let page = query.page;
    let limit = query.limit;
    // console.log(query);
    let role = await Role.findById(query.roleId);
    // console.log(role);
    let roleArr = [role._id].concat(role.parents);

    if (page === undefined && limit === undefined) {

        return await Document.find({
            company,
            roles: { $in: roleArr }
        }).populate([
            { path: 'category', model: DocumentCategory, select: 'name id' },
            { path: 'domains', model: DocumentDomain, select: 'name id' },
            { path: 'archives', model: DocumentArchive, select: 'name id path' },
            { path: 'relationshipDocuments', model: Document },
            { path: 'views.viewer', model: User, select: 'name id' },
            { path: "downloads.downloader", model: User, select: 'name id' },
            { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
            { path: "logs.creator", model: User, select: 'name id' },
            { path: "relationshipDocuments", model: Document, select: "name id" },
        ]);
    } else {
        // const option = (query.key !== undefined && query.value !== undefined)
        //     ? Object.assign({ company, roles: { $in: roleArr } }, { [`${query.key}`]: new RegExp(query.value, "i") })
        //     : { company, roles: { $in: roleArr } };
        let option = {
            company: company,
            roles: { $in: roleArr }
        };

        if (query.category) {
            option.category = query.category;
        }
        if (query.domains) {
            option.domains = query.domains;
        }
        if (query.archives) {
            option.archives = query.archives
        }
        if (query.name) {
            option.name = new RegExp(query.name, "i")
        }
        console.log("option: ", option);

        return await Document.paginate(option, {
            page,
            limit,
            populate: [
                { path: 'category', model: DocumentCategory, select: 'name id' },
                { path: 'domains', model: DocumentDomain, select: 'name id' },
                { path: 'archives', model: DocumentArchive, select: 'name id path' },
                { path: 'relationshipDocuments', model: Document },
                { path: 'views.viewer', model: User, select: 'name id' },
                { path: "downloads.downloader", model: User, select: 'name id' },
                { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
                { path: "logs.creator", model: User, select: 'name id' },
                { path: "relationshipDocuments", model: Document, select: "name id" },
            ]
        });
    }
}

exports.getDocumentsUserStatistical = async (userId, query) => {
    const user = await User.findById(userId).populate({
        path: 'roles', model: UserRole
    });
    let { option } = query;
    switch (option) {
        case 'downloaded': //những tài liệu văn bản mà người dùng đã tải xuống
            return await Document.find({ "downloads.downloader": userId }).populate([
                { path: 'category', model: DocumentCategory, select: 'name id' },
                { path: 'domains', model: DocumentDomain, select: 'name id' },
                { path: 'archives', model: DocumentArchive, select: 'name id path' },
            ]).limit(10);
        case 'common': //những tài liệu phổ biến - được xem và tải nhiều nhất gần đây
            return await Document.find({
                roles: { $in: user.roles.map(res => res.roleId) }
            }).populate([
                { path: 'category', model: DocumentCategory, select: 'name id' },
                { path: 'domains', model: DocumentDomain, select: 'name id' },
                { path: 'archives', model: DocumentArchive, select: 'name id path' },
            ]).sort({ numberOfView: -1 }).limit(10);
        case 'latest': //những tài liệu văn bản mà người dùng chưa xem qua lần nào
            return await Document.find({
                roles: { $in: user.roles.map(res => res.roleId) },
                "views.viewer": { "$ne": userId }
            }).populate([
                { path: 'category', model: DocumentCategory, select: 'name id' },
                { path: 'domains', model: DocumentDomain, select: 'name id' },
                { path: 'archives', model: DocumentArchive, select: 'name id path' },
            ]);
        default:
            return null;
    }

}

exports.editDocumentDomain = async (id, data) => {
    const domain = await DocumentDomain.findById(id);
    domain.name = data.name,
        domain.description = data.description,
        domain.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    await domain.save();

    return domain;
}

exports.deleteDocumentDomain = async (id) => {
    const domain = await DocumentDomain.findById(id);
    if (domain === null) throw ['document_domain_not_found']
    await DocumentDomain.deleteOne({ _id: id });

    return await this.getDocumentDomains(domain.company);
}


exports.deleteManyDocumentDomain = async (array, company) => {
    await DocumentDomain.deleteMany({ _id: { $in: array } });

    return await this.getDocumentDomains(company);
}
/**
 * import các danh mục từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentDomain = async (company, data) => {
    let results = [];
    for (let i in data) {
        description = data[i].description;
        let domain = {
            name: data[i].name,
            description: data[i].description,
        }
        if (data[i].parent) {
            const parentDomain = await DocumentDomain.findOne({ name: data[i].parent });
            if (parentDomain) {
                domain.parent = parentDomain.id;
            }
        }
        console.log(domain);
        let res = await this.createDocumentDomain(company, domain);

    }
    return await this.getDocumentDomains(company);
}

/**
 * Kho lưu trữ vật lí 
 */

exports.getDocumentArchives = async (company) => {
    const list = await DocumentArchive.find({ company });

    const dataConverted = list.map(archive => {
        return {
            id: archive._id.toString(),
            key: archive._id.toString(),
            value: archive._id.toString(),
            label: archive.name,
            title: archive.name,
            parent_id: archive.parent ? archive.parent.toString() : null,
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { list, tree };
}

exports.createDocumentArchive = async (company, data) => {
    console.log('dataaa', data);
    let query = {
        company,
        name: data.name,
        description: data.description,
    }
    if (data.parent && data.parent.length) {
        query.parent = data.parent;
    }
    query.path = await findPath(data);
    await DocumentArchive.create(query);
    return await this.getDocumentArchives(company);
}

exports.deleteDocumentArchive = async (id) => {
    const archive = await DocumentArchive.findById(id);
    await deleteNode(id);
    return await this.getDocumentArchives(archive.company);
}

exports.deleteManyDocumentArchive = async (array, company) => {
    // console.log
    // await DocumentArchive.deleteMany({ _id: { $in: array } });
    for (let i = 0; i < array.length; i++) {
        deleteNode(array[i]);
    }

    return await this.getDocumentArchives(company);
}

exports.editDocumentArchive = async (id, data) => {
    console.log('dataaa', data);
    const archive = await DocumentArchive.findById(id);
    let array = data.array;
    archive.name = data.name;
    archive.description = data.description;
    archive.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    archive.path = await findPath(data)
    await archive.save();
    for (let i = 0; i < array.length; i++) {

        const archive = await DocumentArchive.findById(array[i]);
        archive.path = await findPath(archive);
        await archive.save();
    }
    const document = await this.getDocumentArchives(archive.company)
    return document;
}
async function findPath(data) {
    let path = "";
    let arrayParent = [];
    arrayParent.push(data.name);
    if (data.parent && data.parent !== "#") {

        let parent = data.parent;
        while (parent) {
            let tmp = await DocumentArchive.findById(parent);
            arrayParent.push(tmp.name);
            parent = tmp.parent;
        }

    }
    path = arrayParent.reverse().join(" - ");
    return path;
}

async function deleteNode(id) {
    const archive = await DocumentArchive.findById(id);
    if (!archive) throw ['document_archive_not_found'];
    let parent = archive.parent;
    let archives = await DocumentArchive.find({ parent: id });
    if (archives.length) {
        for (let i = 0; i < archives.length; i++) {
            archives[i].parent = parent;
            archives[i].path = await findPath(archives[i]);
            await archives[i].save();
        }
    }
    await DocumentArchive.deleteOne({ _id: id });
}


/**
 * import các danh mục từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentArchive = async (company, data) => {

    for (let i in data) {
        description = data[i].description;
        let archive = {
            name: data[i].name,
            description: data[i].description,
        }
        if (data[i].pathParent) {
            let path = data[i].pathParent.split('-').map(x => { return x.trim() }).join(" - ");
            const parentArchive = await DocumentArchive.findOne({ path: path });
            if (parentArchive) {
                archive.parent = parentArchive.id;
            }
        }
        let res = await this.createDocumentArchive(company, archive);

    }
    return await this.getDocumentArchives(company);
}

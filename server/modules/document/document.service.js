const { DocumentCategory, DocumentDomain, DocumentArchive, Role, User, UserRole, OrganizationalUnit } = require('../../models').schema;
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Lấy danh sách tất cả các tài liệu văn bản
 * @company id của công ty
 */
exports.getDocuments = async (company, query) => {
    console.log('ttt', query);
    var page = query.page;
    var limit = query.limit;

    if (!(page || limit)) {

        return await Document.find({ company }).populate([
            { path: 'category', model: DocumentCategory },
            { path: 'domains', model: DocumentDomain },
            { path: 'views.viewer', model: User, select: 'name id' },
            { path: "downloads.downloader", model: User, select: 'name id' },
            { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
        ]);
    } else {
        let option = {
            company: company,
        };
        // const option = (query.key !== undefined && query.value !== undefined)
        //     ? Object.assign({ company }, { [`${query.key}`]: new RegExp(query.value, "i") })
        //     : { company };
        if (query.category) option.category = query.category;
        if (query.domains) option.domains = query.domains;
        if (query.archives) option.archives = query.archives
        console.log("option: ", option);
        return await Document.paginate(option, {
            page,
            limit,
            populate: [
                { path: 'category', model: DocumentCategory },
                { path: 'domains', model: DocumentDomain },
                { path: 'archives', model: DocumentArchive },
                { path: 'views.viewer', model: User, select: 'name id' },
                { path: "downloads.downloader", model: User, select: 'name id' },
                { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
            ]
        });
    }
}

/**
 * Lấy thông tin về một tài liệu văn bản
 */
exports.showDocument = async (id, viewer) => {
    const doc = await Document.findById(id).populate([
        { path: 'category', model: DocumentCategory },
        { path: 'archives', model: DocumentArchive },

    ]);
    doc.numberOfView += 1;
    const getIndex

        = (array, value) => {
            var res = -1;
            for (let i = 0; i < array.length; i++) {
                if (array[i].viewer.toString() === value.toString()) {
                    res = i;
                    break;
                }
            }

            return res;
        }
    var index = getIndex(doc.views, viewer);
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
    var index = getIndex(doc.views, viewer);
    if (index !== -1) doc.views.splice(index, 1);
    doc.views.push({ viewer });
    await doc.save();

    return doc;
}


/**
 * Tạo một tài liệu văn bản mới
 */
exports.createDocument = async (company, data) => {
    console.log(data);
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
        { path: 'category', model: DocumentCategory },
        { path: 'domains', model: DocumentDomain },
        { path: 'archives', model: DocumentArchive },
    ]);
}

/**
 * Chỉnh sửa thông tin tài liệu văn bản
 */
exports.editDocument = async (id, data, query = undefined) => {
    console.log('data', data);
    // thêm lịch sử chỉnh sửa
    console.log('querry', query);
    let { creator, title, descriptions } = data;
    let log = {
        creator: creator,
        title: title,
        description: descriptions,
        //createdAt: Date.now,
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
        doc.name = data.name
        doc.domains = data.domains
        doc.archives = data.archives
        doc.category = data.category
        doc.description = data.description
        doc.issuingBody = data.issuingBody
        doc.officialNumber = data.officialNumber
        doc.signer = data.signer

        doc.relationshipDescription = data.relationshipDescription
        doc.relationshipDocuments = data.relationshipDocuments

        doc.roles = data.roles

        // if (data.archivedRecordPlaceInfo !== 'undefined' && data.archivedRecordPlaceInfo !== undefined)
        //     doc.archivedRecordPlaceInfo = data.archivedRecordPlaceInfo
        if (data.archivedRecordPlaceOrganizationalUnit !== 'undefined' && data.archivedRecordPlaceOrganizationalUnit !== undefined && data.archivedRecordPlaceOrganizationalUnit !== "[object Object]") {
            console.log(data.archivedRecordPlaceOrganizationalUnit)
            doc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit
        }
        if (data.archivedRecordPlaceManager !== 'undefined' && data.archivedRecordPlaceManager !== undefined)
            doc.archivedRecordPlaceManager = data.archivedRecordPlaceManager

        await doc.save();

        let docs = doc.logs.reverse();
        return docs;
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
exports.downloadDocumentFile = async (data) => {
    const doc = await Document.findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file', 'version_not_found'];
    await downloadFile(doc, data.downloaderId)
    return {
        path: doc.versions[data.numberVersion].file,
        name: doc.name
    };
}

exports.downloadDocumentFileScan = async (data) => {
    const doc = await Document.findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file_scan', 'version_scan_not_found'];
    await downloadFile(doc, data.downloaderId)
    return {
        path: doc.versions[data.numberVersion].scannedFileOfSignedDocument,
        name: doc.name
    };
}
// hàm thực hiện download 
async function downloadFile(doc, downloaderId) {
    doc.numberOfDownload += 1;
    const getIndex = (array, value) => {
        var res = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].downloader.toString() === value.toString()) {
                res = i;
                break;
            }
        }

        return res;
    }
    var index = getIndex(doc.downloads, downloaderId);
    if (index !== -1) doc.downloads.splice(index, 1);
    doc.downloads.push({ downloader: downloaderId });
    await doc.save();
}
/**
 * Lấy tất cả các loại văn bản
 */
exports.getDocumentCategories = async (company, query) => {

    var page = query.page;
    var limit = query.limit;

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
    if (data.parent.length) {
        query.parent = data.parent
    }
    await DocumentDomain.create(query);

    return await this.getDocumentDomains(company);
}

exports.getDocumentsThatRoleCanView = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    console.log(query);
    var role = await Role.findById(query.roleId);
    console.log(role);
    var roleArr = [role._id].concat(role.parents);

    if (page === undefined && limit === undefined) {

        return await Document.find({
            company,
            roles: { $in: roleArr }
        }).populate([
            { path: 'category', model: DocumentCategory },
            { path: 'domains', model: DocumentDomain },
            { path: 'archives', model: DocumentArchive },
            { path: 'relationshipDocuments', model: Document },
            { path: 'views.viewer', model: User, select: 'name id' },
            { path: "downloads.downloader", model: User, select: 'name id' },
            { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
        ]);
    } else {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({ company, roles: { $in: roleArr } }, { [`${query.key}`]: new RegExp(query.value, "i") })
            : { company, roles: { $in: roleArr } };

        return await Document.paginate(option, {
            page,
            limit,
            populate: [
                { path: 'category', model: DocumentCategory },
                { path: 'domains', model: DocumentDomain },
                { path: 'archives', model: DocumentArchive },
                { path: 'relationshipDocuments', model: Document },
                { path: 'views.viewer', model: User, select: 'name id' },
                { path: "downloads.downloader", model: User, select: 'name id' },
                { path: "archivedRecordPlaceOrganizationalUnit", model: OrganizationalUnit, select: "name id" },
            ]
        });
    }
}

exports.getDocumentsUserStatistical = async (userId, query) => {
    const user = await User.findById(userId).populate({
        path: 'roles', model: UserRole
    });
    var { option } = query;
    switch (option) {
        case 'downloaded': //những tài liệu văn bản mà người dùng đã tải xuống
            return await Document.find({ "downloads.downloader": userId }).populate([
                { path: 'category', model: DocumentCategory },
                { path: 'domains', model: DocumentDomain },
                { path: 'archives', model: DocumentArchive },
            ]).limit(10);
        case 'common': //những tài liệu phổ biến - được xem và tải nhiều nhất gần đây
            return await Document.find({
                roles: { $in: user.roles.map(res => res.roleId) }
            }).populate([
                { path: 'category', model: DocumentCategory },
                { path: 'domains', model: DocumentDomain },
                { path: 'archives', model: DocumentArchive },
            ]).sort({ numberOfView: -1 }).limit(10);
        case 'latest': //những tài liệu văn bản mà người dùng chưa xem qua lần nào
            return await Document.find({
                roles: { $in: user.roles.map(res => res.roleId) },
                "views.viewer": { "$ne": userId }
            }).populate([
                { path: 'category', model: DocumentCategory },
                { path: 'domains', model: DocumentDomain },
                { path: 'archives', model: DocumentArchive },
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
        archive.save();
    }
    const document = await this.getDocumentArchives(archive.company)
    return archive;
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

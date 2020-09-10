const {Link, Privilege} = require(SERVER_MODELS_DIR).schema;
const {LINK_CATEGORY} = require(SERVER_SEED_DIR+'/terms.js');

/**
 * Lấy danh sách tất cả các link của 1 công ty
 * @company id của công ty
 */
exports.getLinks = async (company, query) => {
    let {type, page, limit} = query;
    
    let options = (type === 'active') ? {company, deleteSoft: false} : {company};

    if (!page && !limit) {
        let links = await Link
            .find(options)
            .populate({ path: 'roles', model: Privilege });

        return links;
    } else {
        let option = (query.key && query.value)
            ? Object.assign(options, {[`${query.key}`]: new RegExp(query.value, "i")})
            : options;

        return await Link
        .paginate( option , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }}
            ]
        });
    }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
exports.getLink = async (id) => {
    return await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }});
}

/**
 * Tạo link mới
 * @data dữ liệu về link
 * @companyId id công ty
 */
exports.createLink = async(data, companyId) => {
    if (data.url === '/system') {
        throw ['cannot_create_this_url', 'this_url_cannot_be_use'];
    }

    let check = await Link.findOne({company: componentId, url: data.url});

    if(check !== null) {
        throw ['url_exist'];
    }

    return await Link.create({
        url: data.url,
        description: data.description,
        company: companyId,
        deleteSoft: false
    });
}

/**
 * Chỉnh sửa link
 * @id id link
 * @data dữ liệu về link
 */
exports.editLink = async(id, data) => {
    let link = await Link.findById(id);

    link.url = data.url;
    link.description = data.description;
    link.company = data.company? data.company: link.company;
    await link.save();

    return link;
}

/**
 * Xóa link (chỉ xóa tạm thời - không xóa hẳn)
 * @id id link
 */
exports.deleteLink = async(id, type) => {
    if(type === 'soft') {
        let link = await Link.findById(id);
        link.deleteSoft = true;
        await link.save();
    } else {
        await Privilege.deleteMany({
            resourceId: id,
            resourceType: 'Link'
        });
        await Link.deleteOne({ _id: id});
    }

    return id;

}

/**
 * Thiếp lập mới quan hệ cho role và link
 * @linkId id của link
 * @roleArr mảng id các role
 */
exports.relationshipLinkRole = async(linkId, roleArr) => {
    await Privilege.deleteMany({
        resourceId: linkId,
        resourceType: 'Link'
    });
    let data = roleArr.map( role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    let privilege = await Privilege.insertMany(data);

    return privilege;
}

/**
 * Thêm component vào 1 trang
 * @id id link
 * @componentId id component
 */
exports.addComponentOfLink = async(id, componentId) => {
    let link = await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege });

    link.components.push(componentId);
    await link.save();

    return link;
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
exports.getLinkCategories = async (id) => {
    return LINK_CATEGORY;
}

exports.updateCompanyLinks = async (data) => {
    for (let i = 0; i < data.length; i++) {
        await Link.updateOne({_id: data[i]._id}, {deleteSoft: data[i].deleteSoft});
    }

    return true;
}
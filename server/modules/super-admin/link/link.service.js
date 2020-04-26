const Link = require('../../../models/super-admin/link.model');
const Privilege = require('../../../models/auth/privilege.model');

/**
 * Lấy danh sách tất cả các link của 1 công ty
 * @company id của công ty
 */
exports.getAllLinks = async (company) => {
    return await Link
        .find({ company })
        .populate({ path: 'roles', model: Privilege });
}

/**
 * Phân trang danh sách các link
 * @company id công ty
 * @limit giới hạn hiển thị trên 1 bảng
 * @page số thứ tự của trang muốn lấy
 * @data dữ liệu truy vấn
 */
exports.getPaginatedLinks = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Link
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }}
            ]
        });
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
exports.getLinkById = async (id) => {

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
    if(data.url === '/system') throw ['cannot_create_this_url', 'this_url_cannot_be_use'];
    const check = await Link.findOne({company: componentId, url: data.url});
    if(check !== null) throw ['url_exist'];

    return await Link.create({
        url: data.url,
        description: data.description,
        company: companyId
    });
}
/**
 * Chỉnh sửa link
 * @id id link
 * @data dữ liệu về link
 */

exports.editLink = async(id, data) => {
    const link = await Link.findById(id);

    link.url = data.url;
    link.description = data.description;
    link.company = data.company ? data.company : link.company;
    await link.save();

    return link;
}

/**
 * Xóa link
 * @id id link
 */
exports.deleteLink = async(id) => {
    var relationshiopDelete = await Privilege.deleteMany({
        resourceId: id,
        resourceType: 'Link'
    });
    var deleteRole = await Link.deleteOne({ _id: id});

    return {relationshiopDelete, deleteRole};
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
    var data = roleArr.map( role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    var privilege = await Privilege.insertMany(data);

    return privilege;
}

/**
 * Thêm component vào 1 trang
 * @id id link
 * @componentId id component
 */
exports.addComponentOfLink = async(id, componentId) => {
    var link = await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege });

    link.components.push(componentId);
    link.save();

    return link;
}
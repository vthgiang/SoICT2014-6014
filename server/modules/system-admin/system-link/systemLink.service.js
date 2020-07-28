const { SystemLink, RootRole, SystemComponent } = require('../../../models').schema;
const {LINK_CATEGORY} = require('../../../seed/terms');

/**
 * Lấy danh sách tất cả các system link 
 */
exports.getAllSystemLinks = async (query) => {

    let page = query.page;
    let limit = query.limit;
    
    if (!page && !limit) {
        return await SystemLink
            .find()
            .populate([
                { path: 'roles', model: RootRole },
                { path: 'components', model: SystemComponent }
            ]);
    } else {
        const option = (query.key && query.value)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};

        return await SystemLink.paginate(option, {
            page, 
            limit, 
            populate: [
                { path: 'roles', model: RootRole },
                { path: 'components', model: SystemComponent }
            ]
        });
    }
}

/**
 * Lấy tất cả các category của các system link
 * 
 */
exports.getAllSystemLinkCategories = async () => {
    
    return Object.keys(LINK_CATEGORY).map(key => LINK_CATEGORY[key]);
}

/**
 * Lấy 1 system link
 * @id id của system link
 */
exports.getSystemLink = async (systemLinkId) => {
    console.log(systemLinkId)
    return await SystemLink
        .findById(systemLinkId)
        .populate({path: 'roles', model: RootRole});
}

/**
 * Tạo 1 system link mới
 * @url url của system link
 * @description mô tả
 * @roles mảng các role có quyền vào trang với link này
 * @category danh mục của system link
 */
exports.createSystemLink = async (url, description, roles, category) => {

    const link = await SystemLink.findOne({ url });
    if (link) throw ['system_link_url_exist'];
    
    const systemLink = await SystemLink.create({ url, description, category, roles });

    return systemLink;
}

/**
 * Chỉnh sửa 1 system link
 * @id id của system link
 * @url url của system link
 * @description mô tả
 * @roles mảng các role được truy cập
 * @category danh mục
 */
exports.editSystemLink = async (systemLinkId, url, description, roles, category) => {

    let link = await SystemLink.findById(systemLinkId)
    
    link.url = url;
    link.description = description;
    link.roles = roles;
    link.category = category;

    await link.save();

    return link;
}

/**
 * Xóa 1 system link
 * @id id của system link
 */
exports.deleteSystemLink = async (systemLinkId) => {
    return await SystemLink.deleteOne({ _id: systemLinkId });
}
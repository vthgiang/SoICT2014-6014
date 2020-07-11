const { SystemLink, RootRole, SystemComponent } = require('../../../models').schema;
const {LINK_CATEGORY} = require('../../../seed/terms');

/**
 * Lấy danh sách tất cả các system link 
 */
exports.getAllSystemLinks = async (query) => {
    var page = query.page;
    var limit = query.limit;
    
    if(page === undefined && limit === undefined ){
        return await SystemLink.find().populate([
            { path: 'roles', model: RootRole },
            { path: 'components', model: SystemComponent }
        ]);
    }else{
        const option = (query.key !== undefined && query.value !== undefined)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};
        console.log("option: ", option);
        return await SystemLink.paginate( option, {page, limit, populate: [
            { path: 'roles', model: RootRole },
            { path: 'components', model: SystemComponent }
        ]});
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
exports.getSystemLink = async (id) => {

    return await SystemLink.findById(id).populate({path: 'roles', model: RootRole});
}

/**
 * Tạo 1 system link mới
 * @url url của system link
 * @description mô tả
 * @roles mảng các role có quyền vào trang với link này
 * @category danh mục của system link
 */
exports.createSystemLink = async(url, description, roles, category) => {
    const link = await SystemLink.findOne({ url });
    if(link !== null) throw ['system_link_url_exist'];

    return await SystemLink.create({ url, description, category, roles });
}

/**
 * Chỉnh sửa 1 system link
 * @id id của system link
 * @url url của system link
 * @description mô tả
 * @roles mảng các role được truy cập
 * @category danh mục
 */
exports.editSystemLink = async(id, url, description, roles, category) => {
    var link = await SystemLink.findById(id);
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
exports.deleteSystemLink = async(id) => {
    return await SystemLink.deleteOne({ _id: id });
}
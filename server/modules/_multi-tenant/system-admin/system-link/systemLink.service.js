const { SystemLink, RootRole, SystemComponent, Privilege } = require(SERVER_MODELS_DIR).schema;
const {LINK_CATEGORY} = require(SERVER_SEED_DIR+'/terms');

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

    const sysLink = await SystemLink.create({ url, description, category, roles });
    const systemLink = await SystemLink.findById(sysLink._id).populate({path: 'roles', model: RootRole})
    const companyList = await Company.find();
    for (let i = 0; i < companyList.length; i++) {
        let link = await Link.create({
            company: companyList[i]._id, 
            url, 
            description, 
            category
        });
        let roles = await Role.find({
            name: { $in: systemLink.roles.map(role=>role.name)}
        });
        let privileges = roles.map(role=>{
            return {
                resourceId: link._id,
                resourceType: 'Link',
                roleId: role._id
            }
        });
        await Privilege.insertMany(privileges);
    }

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
    let systemLink = await SystemLink.findById(systemLinkId);
    // 1. Xóa tất các link tương ứng của các công ty
    let links = await Link.find({url: systemLink.url});
    //xóa phân quyền
    await Privilege.deleteMany({ 
        resourceType: 'Link',
        resourceId: { $in: links.map(link=>link._id) }
    });
    //links trong component tương ứng
    for (let i = 0; i < links.length; i++) {
        let components = await Link.find({links: links[i]._id});
        for (let j = 0; j < components.length; j++) {
            let updateComponent = await Component.findById(components[j]._id);
            let index = updateComponent.links.indexOf(links[i]._id);
            if(index !== -1) updateComponent.links.splice(index, 1);
            await updateComponent.save();
        }
    }
    await Link.deleteMany({url: systemLink.url});

    // 2. Xóa system link 
    return await SystemLink.deleteOne({ _id: systemLinkId });
}
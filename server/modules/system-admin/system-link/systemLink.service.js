const { LinkDefault, RoleDefault, ComponentDefault } = require('../../../models').schema;
const {CATEGORY_LINKS} = require('../../../seed/terms');

exports.getAllSystemLinks = async () => {

    return await LinkDefault.find().populate([
        { path: 'roles', model: RoleDefault },
        { path: 'components', model: ComponentDefault }
    ]);
}

exports.getAllSystemLinkCategories = async () => {
    
    return CATEGORY_LINKS;
}

exports.getPaginatedSystemLinks = async (limit, page, data={}) => {
    
    return await LinkDefault.paginate( data, {page, limit, populate: [
        { path: 'roles', model: RoleDefault },
        { path: 'components', model: ComponentDefault }
    ]});
}

exports.getSystemLink = async (id) => {

    return await LinkDefault.findById(id).populate({path: 'roles', model: RoleDefault});
}

exports.createSystemLink = async(url, description, roles, category) => {
    const link = await LinkDefault.findOne({ url });
    if(link !== null) throw ('link_default_exist');

    return await LinkDefault.create({ url, description, category, roles });
}

exports.editSystemLink = async(id, url, description, roles, category) => {
    var link = await LinkDefault.findById(id);
    link.url = url;
    link.description = description;
    link.roles = roles;
    link.category = category;
    await link.save();

    return link;
}

exports.deleteSystemLink = async(id) => {
    return await LinkDefault.deleteOne({ _id: id });
}
const { SystemLink, RootRole, SystemComponent } = require('../../../models').schema;
const {CATEGORY_LINKS} = require('../../../seed/terms');

exports.getAllSystemLinks = async () => {

    return await SystemLink.find().populate([
        { path: 'roles', model: RootRole },
        { path: 'components', model: SystemComponent }
    ]);
}

exports.getAllSystemLinkCategories = async () => {
    
    return CATEGORY_LINKS;
}

exports.getPaginatedSystemLinks = async (limit, page, data={}) => {
    
    return await SystemLink.paginate( data, {page, limit, populate: [
        { path: 'roles', model: RootRole },
        { path: 'components', model: SystemComponent }
    ]});
}

exports.getSystemLink = async (id) => {

    return await SystemLink.findById(id).populate({path: 'roles', model: RootRole});
}

exports.createSystemLink = async(url, description, roles, category) => {
    const link = await SystemLink.findOne({ url });
    if(link !== null) throw ('link_default_exist');

    return await SystemLink.create({ url, description, category, roles });
}

exports.editSystemLink = async(id, url, description, roles, category) => {
    var link = await SystemLink.findById(id);
    link.url = url;
    link.description = description;
    link.roles = roles;
    link.category = category;
    await link.save();

    return link;
}

exports.deleteSystemLink = async(id) => {
    return await SystemLink.deleteOne({ _id: id });
}
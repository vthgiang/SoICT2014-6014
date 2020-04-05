const { LinkDefault, RoleDefault, ComponentDefault } = require('../../../models/_export').data;

exports.get = async () => {

    return await LinkDefault.find().populate([
        { path: 'roles', model: RoleDefault },
        { path: 'components', model: ComponentDefault }
    ]);
}

exports.getPaginate = async (limit, page, data={}) => {
    
    return await LinkDefault.paginate( data, {page, limit, populate: [
        { path: 'roles', model: RoleDefault },
        { path: 'components', model: ComponentDefault }
    ]});
}

exports.show = async (id) => {

    return await LinkDefault.findById(id).populate({path: 'roles', model: RoleDefault});
}

exports.create = async(url, description, roles) => {
    const link = await LinkDefault.findOne({ url });
    if(link !== null) throw ('link_default_exist');

    return await LinkDefault.create({ url, description, roles });
}

exports.edit = async(id, url, description, roles) => {
    var link = await LinkDefault.findById(id);
    link.url = url;
    link.description = description;
    link.roles = roles;
    await link.save();

    return link;
}

exports.delete = async(id) => {
    return await LinkDefault.deleteOne({ _id: id });
}
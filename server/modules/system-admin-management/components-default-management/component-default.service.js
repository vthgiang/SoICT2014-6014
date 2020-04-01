const { ComponentDefault, LinkDefault, RoleDefault } = require('../../../models/_export').data;

exports.get = async () => {

    return await ComponentDefault.find().populate([
        { path: 'roles', model: RoleDefault },
        { path: 'link', model: LinkDefault }
    ]);
}

exports.getPaginate = async (limit, page, data={}) => {

    return await ComponentDefault
        .paginate( data , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: RoleDefault },
                { path: 'link', model: LinkDefault }
            ]
        });
}

exports.show = async (id) => {

    return await ComponentDefault.findById(id).populate([
        { path: 'roles', model: RoleDefault },
        { path: 'link', model: LinkDefault }
    ]);
}

exports.create = async(name, description, link, roles) => {

    return await ComponentDefault.create({ name, description, link, roles });
}

exports.edit = async(id, name, description, link, roles) => {
    var component = await ComponentDefault.findById(id);
    component.name = name;
    component.description = description;
    component.link = link;
    component.roles = roles;
    await component.save();

    return component;
}

exports.delete = async(id) => {
    var component = await ComponentDefault.findById(id);
    await ComponentDefault.deleteOne({ _id: id});

    return component;
}

exports.addComponentsToLink = async(linkId, componentId) => {
    var link = await LinkDefault.findById(linkId);
    link.components.push(componentId);
    await link.save();

    return link;
}

exports.deleteComponentInLink = async(linkId, componentId) => {
    var link = await LinkDefault.findById(linkId);
    var index = link.components.indexOf(componentId);
    if(index !== -1) link.components.slice(index, 1); //xóa component khỏi link
    await link.save();

    return link;
}



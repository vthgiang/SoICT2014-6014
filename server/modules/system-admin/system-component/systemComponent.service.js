const { SystemComponent, SystemLink, RootRole } = require('../../../models').schema;

exports.getAllSystemComponents = async () => {

    return await SystemComponent.find().populate([
        { path: 'roles', model: RootRole },
        { path: 'link', model: SystemLink }
    ]);
}

exports.getPaginatedSystemComponents = async (limit, page, data={}) => {

    return await SystemComponent
        .paginate( data , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: RootRole },
                { path: 'link', model: SystemLink }
            ]
        });
}

exports.getSystemComponent = async (id) => {

    return await SystemComponent.findById(id).populate([
        { path: 'roles', model: RootRole },
        { path: 'link', model: SystemLink }
    ]);
}

exports.createSystemComponent = async(name, description, link, roles) => {
    const component = await SystemComponent.findOne({name});
    if(component !== null) throw ['system_component_name_invalid', 'system_component_name_exist'];

    return await SystemComponent.create({ name, description, link, roles });
}

exports.editSystemComponent = async(id, name, description, link, roles) => {
    const component = await SystemComponent.findById(id);
    const checkComponent = await SystemComponent.findOne({name});
    if(JSON.stringify(component._id) !== JSON.stringify(checkComponent._id)) throw ['system_component_name_invalid', 'system_component_name_exist'];

    component.name = name;
    component.description = description;
    component.link = link;
    component.roles = roles;
    await component.save();

    return component;
}

exports.deleteSystemComponent = async(id) => {
    var component = await SystemComponent.findById(id);
    await SystemComponent.deleteOne({ _id: id});

    return component;
}

exports.addSystemComponentsToSystemLink = async(linkId, componentId) => {
    var link = await SystemLink.findById(linkId);
    link.components.push(componentId);
    await link.save();

    return link;
}

exports.removeSystemComponentFromSystemLink = async(linkId, componentId) => {
    var link = await SystemLink.findById(linkId);
    var index = link.components.indexOf(componentId);
    if(index !== -1) link.components.slice(index, 1); //xóa component khỏi link
    await link.save();

    return link;
}



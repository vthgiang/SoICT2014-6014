const { SystemComponent, SystemLink, RootRole } = require('../../../models').schema;

exports.getAllSystemComponents = async (query) => {

    let page = query.page;
    let limit = query.limit;
    
    if (!page && !limit) {
        return await SystemComponent
            .find()
            .populate([
                { path: 'roles', model: RootRole },
                { path: 'link', model: SystemLink }
            ]);
    } else {
        const option = (query.key && query.value)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};

        return await SystemComponent
            .paginate(option, { 
                page, 
                limit,
                populate: [
                    { path: 'roles', model: RootRole },
                    { path: 'link', model: SystemLink }
                ]
            });
    }
}

exports.getSystemComponent = async (systemComponentId) => {

    return await SystemComponent
        .findById(systemComponentId)
        .populate([
            { path: 'roles', model: RootRole },
            { path: 'link', model: SystemLink }
        ]);
}

exports.createSystemComponent = async (name, description, link, roles) => {

    const component = await SystemComponent.findOne({ name });
    if(component) throw ['system_component_name_invalid', 'system_component_name_exist'];

    return await SystemComponent.create({ name, description, link, roles });
}

exports.editSystemComponent = async (systemComponentId, name, description, link, roles) => {
    
    const component = await SystemComponent.findById(systemComponentId);
    const checkComponent = await SystemComponent.findOne({ name });
    if(checkComponent) throw ['system_component_name_invalid', 'system_component_name_exist'];
    
    component.name = name;
    component.description = description;
    component.link = link;
    component.roles = roles;
    await component.save();

    return component;
}

exports.deleteSystemComponent = async (systemComponentId) => {

    let component = await SystemComponent.findById(systemComponentId);
    await SystemComponent.deleteOne({ _id: systemComponentId });
    
    return component;
}

exports.addSystemComponentsToSystemLink = async (linkId, componentId) => {

    let link = await SystemLink.findById(linkId);
    if (link) {
        link.components.push(componentId);
        await link.save();
    }

    return link;
}

exports.removeSystemComponentFromSystemLink = async (linkId, componentId) => {
    
    let link = await SystemLink.findById(linkId);
    if(link) {
        let index = link.components.indexOf(componentId);
        if(index !== -1) link.components.slice(index, 1); //xóa component khỏi link

        await link.save();
    }
    
    return link;
}



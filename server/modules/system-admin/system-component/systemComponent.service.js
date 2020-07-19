const { SystemComponent, SystemLink, RootRole } = require('../../../models').schema;

exports.getAllSystemComponents = async (query) => {
    var page = query.page;
    var limit = query.limit;
    
    if(page === undefined && limit === undefined ){
        return await SystemComponent.find().populate([
            { path: 'roles', model: RootRole },
            { path: 'link', model: SystemLink }
        ]);
    }else{
        const option = (query.key !== undefined && query.value !== undefined)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};
        console.log("option: ", option);
        return await SystemComponent
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'roles', model: RootRole },
                    { path: 'link', model: SystemLink }
                ]
            });
    }
}

exports.getSystemComponent = async (id) => {

    return await SystemComponent.findById(id).populate([
        { path: 'roles', model: RootRole },
        { path: 'link', model: SystemLink }
    ]);
}

exports.createSystemComponent = async(name, description, link, roles) => {
    console.log("DATA SERVICE: ", name, description, link, roles)
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
    if(link !== null){
        link.components.push(componentId);
        await link.save();
    }

    return link;
}

exports.removeSystemComponentFromSystemLink = async(linkId, componentId) => {
    var link = await SystemLink.findById(linkId);
    var index = link.components.indexOf(componentId);
    if(index !== -1) link.components.slice(index, 1); //xóa component khỏi link
    await link.save();

    return link;
}



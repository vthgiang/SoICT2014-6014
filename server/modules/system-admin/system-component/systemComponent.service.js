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

exports.createSystemComponent = async (name, description, link, roles) => {
    const systemCom = await SystemComponent.findOne({ name });
    if (systemCom) throw ['system_component_name_exist'];
    const systemLink = await SystemLink.findById(link);
    const sysComponent = await SystemComponent.create({ name, description, link, roles });
    const systemComponent = await SystemComponent.findById(sysComponent._id).populate({path: 'roles', model: RootRole})
    const companyList = await Company.find();
    for (let i = 0; i < companyList.length; i++) {
        let link = await Link.findOne({url: systemLink.url, company: companyList[i]._id});
        if(link === null) throw ['company_link_invalid'];
        let component = await Component.create({
            company: companyList[i]._id, 
            name, 
            description,
            link: link._id
        });
        link.components.push(component._id);
        await link.save();

        let roles = await Role.find({
            name: { $in: systemComponent.roles.map(role=>role.name)}
        });
        let privileges = roles.map(role=>{
            return {
                resourceId: link._id,
                resourceType: 'Component',
                roleId: role._id
            }
        });
        await Privilege.insertMany(privileges);
    }

    return systemComponent;
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
    let systemComponent = await SystemComponent.findById(systemComponentId);
    // 1. Xóa tất các component tương ứng của các công ty
    let component = await Component.find({name: systemComponent.name});
    let priDel = [systemComponent._id, ...component.map(com=>com._id)];
    await Privilege.deleteMany({ 
        resourceType: 'Component',
        resourceId: { $in: priDel }
    });
    const deleteComponent = await Component.deleteMany({name: systemComponent.name});

    // 2. Xóa system link 
    return await SystemComponent.deleteOne({ _id: systemComponentId });
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



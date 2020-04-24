const { Privilege, Role, Link, Component } = require('../../../models').schema;

exports.getAllComponents = async (id) => {

    return await Component
        .find({ company: id })
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });
}

exports.getPaginatedComponents = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Component
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }},
            ]
        });
}

exports.getComponentById = async (id) => {

    return await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });
}

exports.createComponent = async(data) => {
    const check = await Component.findOne({name: data.name});
    if(check !== null) throw ('component_name_exist');

    return await Component.create({
        name: data.name,
        description: data.description,
        company: data.company
    });
}

exports.editComponent = async(id, data) => {
    const component = await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });

    component.name = data.name;
    component.description = data.description;
    component.company = data.company ? data.company : component.company;
    component.save();

    return component;
}

exports.deleteComponent = async(id) => {
    const relationshiopDelete = await Privilege.deleteMany({
        resourceId: id,
        resourceType: 'Component'
    });
    const deleteComponent = await Component.deleteOne({ _id: id});

    return {relationshiopDelete, deleteComponent};
}

exports.relationshipComponentRole = async(componentId, roleArr) => {
    await Privilege.deleteMany({
        resourceId: componentId,
        resourceType: 'Component'
    });
    const data = roleArr.map( role => {
        return {
            resourceId: componentId,
            resourceType: 'Component',
            roleId: role
        };
    });
    const privilege = await Privilege.insertMany(data);

    return privilege;
}

exports.getComponentsOfUserInLink = async(roleId, linkId) => {

    const role = await Role.findById(roleId);
    let roleArr = [role._id];
    roleArr = roleArr.concat(role.parents);
    
    const link = await Link.findById(linkId)
        .populate([
            { path: 'components', model: Component }
        ]); //lấy được thông tin về link
        
    const data = await Privilege.find({
        roleId: {$in: roleArr},
        resourceType: 'Component',
        resourceId: { $in: link.components }
    }).distinct('resourceId');

    const components = Component.find({_id: {$in: data}});

    return components;
}

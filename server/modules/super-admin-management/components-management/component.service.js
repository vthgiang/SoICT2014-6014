const Component = require('../../../models/component.model');
const Privilege = require('../../../models/privilege.model');
const Link = require('../../../models/link.model');
const Role = require('../../../models/role.model');

exports.get = async (id) => {

    return await Component
        .find({ company: id })
        .populate({ path: 'roles', model: Privilege });
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Component
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: Privilege},
            ]
        });
}

exports.getById = async (id) => {

    return await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege });
}

exports.create = async(data) => {
    return await Component.create({
        name: data.name,
        description: data.description,
        company: data.company
    });
}

exports.edit = async(id, data) => {
    var component = await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege });

    component.name = data.name;
    component.description = data.description;
    component.company = data.company ? data.company : component.company;
    component.save();

    return component;
}

exports.delete = async(id) => {
    var relationshiopDelete = await Privilege.deleteMany({
        resourceId: id,
        resourceType: 'Component'
    });
    var deleteComponent = await Component.deleteOne({ _id: id});

    return {relationshiopDelete, deleteComponent};
}

exports.relationshipComponentRole = async(componentId, roleArr) => {
    await Privilege.deleteMany({
        resourceId: componentId,
        resourceType: 'Component'
    });
    console.log('creat data')
    var data = roleArr.map( role => {
        return {
            resourceId: componentId,
            resourceType: 'Component',
            roleId: role
        };
    });
    var privilege = await Privilege.insertMany(data);

    return privilege;
}

exports.getComponentsOfUserInLink = async(roleId, linkId) => {
    var role = await Role.findById(roleId);
    var roleArr = [role._id];
    roleArr = roleArr.concat(role.parents);
    
    var link = await Link.findById(linkId)
        .populate([
            { path: 'components', model: Component }
        ]); //lấy được thông tin về link

    var componentArr = link.components; //lấy các component trong page này
    var data = await Privilege.find({
        roleId: {$in: roleArr},
        resourceType: 'Component',
        resourceId: { $in: componentArr }
    }).populate({ path: 'resourceId', model: Component });

    var components = data.map(component => component.resourceId);

    return components;
}

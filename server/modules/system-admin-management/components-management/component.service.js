const Component = require('../../../models/component.model');
const Privilege = require('../../../models/privilege.model');

exports.get = async (id) => {

    return await Component
        .find({ company: id })
        .populate({ path: 'roles', model: Privilege });
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    console.log("DATA: ", newData);
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
    console.log("relation ship: ", componentId, roleArr)
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
    console.log("Created data: ", privilege)

    return privilege;
}
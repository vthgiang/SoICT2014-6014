const { Privilege, Role, Link, Component } = require('../../../models').schema;

/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getAllComponents = async (id) => {

    return await Component
        .find({ company: id })
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });
}

/**
 * Phân trang danh sách các component
 * @company id công ty
 * @limit giới hạn
 * @page số thứ tự trang muốn lấy
 * @data dữ liệu truy vấn
 */
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

/**
 * Lấy component theo id
 * @id id component
 */
exports.getComponentById = async (id) => {

    return await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });
}

/**
 * Tạo component
 * @data dữ liệu component
 */
exports.createComponent = async(data) => {
    const check = await Component.findOne({name: data.name});
    if(check !== null) throw ['component_name_exist'];

    return await Component.create({
        name: data.name,
        description: data.description,
        company: data.company
    });
}

/**
 * Sửa component
 * @id id component
 * @data dữ liệu
 */
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

/**
 * Xóa component
 * @id id component
 */
exports.deleteComponent = async(id) => {
    const relationshiopDelete = await Privilege.deleteMany({
        resourceId: id,
        resourceType: 'Component'
    });
    const deleteComponent = await Component.deleteOne({ _id: id});

    return {relationshiopDelete, deleteComponent};
}

/**
 * Thiết lập mối quan hệ component - role
 * @componentId id component
 * @roleArr mảng id các role
 */
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

/**
 * Lấy các component trên 1 trang mà user này có quyền
 * @roleId id role của user
 * @linkId id của trang user muốn lấy
 */
exports.getComponentsOfUserInLink = async(roleId, linkId) => {

    const role = await Role.findById(roleId);
    let roleArr = [role._id];
    roleArr = roleArr.concat(role.parents);
    
    const link = await Link.findById(linkId)
        .populate([
            { path: 'components', model: Component }
        ]);
        
    const data = await Privilege.find({
        roleId: {$in: roleArr},
        resourceType: 'Component',
        resourceId: { $in: link.components }
    }).distinct('resourceId');

    const components = Component.find({_id: {$in: data}});

    return components;
}

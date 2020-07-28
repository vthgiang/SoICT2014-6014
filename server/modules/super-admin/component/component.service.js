const { Privilege, Role, Link, Component } = require('../../../models').schema;

/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getComponents = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if (!page && limit){
        return await Component
            .find({ company })
            .populate([
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } },
                { path: 'link', model: Link },
            ]);
    } else{
        const option = (query.key && query.value)
            ? Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {company};
        console.log("option: ", option);
        return await Component
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }},
                    { path: 'link', model: Link },
                ]
            });
    }
}

/**
 * Lấy component theo id
 * @id id component
 */
exports.getComponent = async (id) => {
    return await Component
        .findById(id)
        .populate([
            { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } },
            { path: 'link', model: Link },
        ]);
}

/**
 * Lấy các component trên 1 trang mà user này có quyền
 * @roleId id role của user
 * @linkId id của trang user muốn lấy
 */
exports.getComponentsOfUserInLink = async (roleId, linkId) => {
    const role = await Role.findById(roleId);
    let roleArr = [role._id];
    roleArr = roleArr.concat(role.parents);
    
    const link = await Link.findById(linkId)
        .populate([
            { path: 'components', model: Component }
        ]);
        
    const data = await Privilege.find({
        roleId: { $in: roleArr },
        resourceType: 'Component',
        resourceId: { $in: link.components }
    }).distinct('resourceId');

    const components = await Component.find({ _id: { $in: data } });

    return components;
}

/**
 * Tạo component
 * @data dữ liệu component
 */
exports.createComponent = async(data) => {
    const check = await Component.findOne({name: data.name});

    if(check) {
        throw ['component_name_exist'];
    }

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
    console.log("data component: ", data)
    const component = await Component
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } });

    component.name = data.name;
    component.link = data.link;
    component.description = data.description;
    component.company = data.company ? data.company : component.company;
    await component.save();

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
    const deleteComponent = await Component.deleteOne({ _id: id });

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
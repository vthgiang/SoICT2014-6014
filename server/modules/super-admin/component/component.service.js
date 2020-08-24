const { Privilege, Role, Link, Component } = require(SERVER_MODELS_DIR).schema;

/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getComponents = async (company, query) => {
    let {page, limit, currentRole, linkId, type} = query;
    
    let optionExpression = (type === 'active') ? {company, deleteSoft: false} : {company};


    if (!page && !limit && !currentRole && !linkId){
        return await Component
            .find(optionExpression)
            .populate([
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role } },
                { path: 'links', model: Link },
            ]);
    } else if (page && limit && !currentRole && !linkId) {
        let option = (query.key && query.value)
            ? Object.assign(optionExpression, {[`${query.key}`]: new RegExp(query.value, "i")})
            : optionExpression;
        
        return await Component
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }},
                    { path: 'links', model: Link },
                ]
            });
    } else if (!page && !limit && currentRole && linkId) {
        let role = await Role.findById(currentRole);
        let roleArr = [role._id];
        roleArr = roleArr.concat(role.parents);
        
        let link = await Link.findOne({_id: linkId, deleteSoft: false})
            .populate([
                { path: 'components', model: Component }
            ]);
        if(link === null) throw ['link_access_invalid'];
            
        let data = await Privilege.find({
            roleId: { $in: roleArr },
            resourceType: 'Component',
            resourceId: { $in: link.components }
        }).distinct('resourceId');

        let components = await Component.find({ _id: { $in: data }, deleteSoft: false });

        return components;
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
 * Tạo component
 * @data dữ liệu component
 */
exports.createComponent = async(data) => {
    let check = await Component.findOne({name: data.name});

    if(check) {
        throw ['component_name_exist'];
    }

    return await Component.create({
        name: data.name,
        description: data.description,
        company: data.company,
        deleteSoft: false
    });
}

/**
 * Sửa component
 * @id id component
 * @data dữ liệu
 */
exports.editComponent = async(id, data) => {
    let component = await Component
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
exports.deleteComponent = async(id, type) => {
    if(type === 'soft'){
        let component = await Component.findById(id);
        component.deleteSoft = true;
        await component.save();
    } else {
        await Privilege.deleteMany({
            resourceId: id,
            resourceType: 'Component'
        });
        await Component.deleteOne({ _id: id });
    }

    return id;
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

    let data = roleArr.map( role => {
        return {
            resourceId: componentId,
            resourceType: 'Component',
            roleId: role
        };
    });

    let privilege = await Privilege.insertMany(data);

    return privilege;
}

exports.updateCompanyComponents = async (data) => {
    for (let i = 0; i < data.length; i++) {
        await Component.updateOne({_id: data[i]._id}, {deleteSoft: data[i].deleteSoft});
    }

    return true;
}
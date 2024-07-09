const { Privilege, Role, Link, Component, Attribute, UserRole } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getComponents = async (portal, query) => {
    let { page, limit, currentRole, linkId, type, userId } = query;

    let optionExpression = (type === 'active') ? { deleteSoft: false } : {};

    if (!page && !limit && !currentRole && !linkId) {
        return await Component(connect(DB_CONNECTION, portal))
            .find(optionExpression)
            .populate([
                { path: 'roles', populate: { path: 'roleId' } },
                { path: 'links', },
            ]);
    } else if (page && limit && !currentRole && !linkId) {
        let option = (query.key && query.value)
            ? Object.assign(optionExpression, { [`${query.key}`]: new RegExp(query.value, "i") })
            : optionExpression;

        return await Component(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'roles', populate: { path: 'roleId' } },
                    { path: 'links' },
                ]
            });
    } else if (!page && !limit && currentRole && linkId) {
        let role = await Role(connect(DB_CONNECTION, portal))
            .findById(currentRole);
        let roleArr = [role._id];
        roleArr = roleArr.concat(role.parents);

        let link = await Link(connect(DB_CONNECTION, portal))
            .findOne({ _id: linkId, deleteSoft: false })
            .populate([
                { path: 'components' }
            ]);
        if (link === null) throw ['link_access_invalid'];

        let data = await Privilege(connect(DB_CONNECTION, portal))
            .find({
                roleId: { $in: roleArr },
                resourceType: 'Component',
                resourceId: { $in: link.components }
            }).populate({ path: "resourceId" });

        // .distinct('resourceId');

        const userrole = await UserRole(connect(DB_CONNECTION, portal)).findOne({ userId, roleId: role._id });

        let dataComponents = await data.filter((pri) => pri.resourceId.deleteSoft === false && pri.policies.length == 0)

        // lấy ds các component theo RBAC original và theo policy được phân quyền thêm nếu tồn tại map policy giữa privilege và userrole
        data.forEach(pri => {
            if (pri.policies.length > 0) {
                if (userrole.policies.length > 0) {
                    if (pri.policies.some(policy => userrole.policies.includes(policy)) && pri.resourceId.deleteSoft === false) {
                        dataComponents = dataComponents.concat(pri)
                    }
                }
            }
        })

        let components = await Component(connect(DB_CONNECTION, portal))
            .find({ _id: { $in: dataComponents.map(pri => pri.resourceId._id) }, deleteSoft: false });

        return components;
    }
}

/**
 * Lấy component theo id
 * @id id component
 */
exports.getComponent = async (portal, id) => {
    return await Component(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: { path: 'roleId' } },
            { path: 'links' },
        ]);
}

/**
 * Tạo component
 * @data dữ liệu component
 */
exports.createComponent = async (portal, data) => {
    let check = await Component(connect(DB_CONNECTION, portal))
        .findOne({ name: data.name });
    if (check) throw ['component_name_exist'];

    return await Component(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            description: data.description,
            deleteSoft: false
        });
}

exports.createComponentAttribute = async (portal, data) => {
    console.log("create-component-attribute")

    // Lấy danh sách các attribute valid
    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                // const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    // array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }

    const attrArray = await filterValidAttributeArray(data.attributes ?? []);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            // name: attr.name.trim(),
            value: attr.value.trim(),
            description: attr.description.trim()
        }
    });

    // lấy ds các component cập nhật thuộc tính
    const componentAddAttribute = await Component(connect(DB_CONNECTION, portal)).find({
        _id: {
            $in: data.componentList.map(id => mongoose.Types.ObjectId(id))
        }
    }).populate({ path: 'roles', populate: { path: 'roleId' } });

    // Thêm - cập nhật thuộc tính
    componentAddAttribute.forEach(async (component) => {
        // Kiểm tra trùng thuộc tính thì không tên mới mà chỉ cập nhật value và description
        component.attributes.forEach((attr) => {
            dataAttr.forEach((inputAttr) => {
                if (attr.attributeId == inputAttr.attributeId) {
                    attr.value = inputAttr.value;
                    attr.description = inputAttr.description
                }
            })
        })
        // Thêm các thuộc tính chưa có
        if (component.attributes.length > 0) {
            const componentAttrId = component.attributes.map(attr => attr.attributeId);
            component.attributes = component.attributes.concat(dataAttr.filter(a => !componentAttrId.includes(a.attributeId)));
        }
        // Thêm mới nếu chưa có thuộc tính nào
        else {
            component.attributes = dataAttr

        }
        await component.save()

    })

    console.log("componentAddAttribute", componentAddAttribute)
    return componentAddAttribute;

}

/**
 * Sửa component
 * @id id component
 * @data dữ liệu
 */
exports.editComponent = async (portal, id, data) => {
    let component = await Component(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: { path: 'roleId' } },
            { path: 'links' },
        ]);

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }
    if (data.attributes) {
        const attrArray = await filterValidAttributeArray(data.attributes ?? []);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                name: attr.name.trim(),
                value: attr.value.trim(),
                description: attr.description?.trim(),
            }
        });

        component.attributes = dataAttr;
    }

    component.name = data.name;
    component.link = data.link;
    component.description = data.description;
    await component.save();

    return component;
}

/**
 * Xóa component
 * @id id component
 */
exports.deleteComponent = async (portal, id, type) => {
    if (type === 'soft') {
        let component = await Component(connect(DB_CONNECTION, portal))
            .findById(id);
        component.deleteSoft = true;
        await component.save();
    } else {
        await Privilege(connect(DB_CONNECTION, portal))
            .deleteMany({
                resourceId: id,
                resourceType: 'Component'
            });
        await Component(connect(DB_CONNECTION, portal))
            .deleteOne({ _id: id });
    }

    return id;
}

/**
 * Thiết lập mối quan hệ component - role
 * @componentId id component
 * @roleArr mảng id các role
 */
exports.relationshipComponentRole = async (portal, componentId, roleArr) => {
    await Privilege(connect(DB_CONNECTION, portal))
        .deleteMany({
            resourceId: componentId,
            resourceType: 'Component',
            policies: { $in: [[], undefined] }
        });

    let data = roleArr.map(role => {
        return {
            resourceId: componentId,
            resourceType: 'Component',
            roleId: role
        };
    });

    let privilege = await Privilege(connect(DB_CONNECTION, portal))
        .insertMany(data);

    return privilege;
}

exports.updateCompanyComponents = async (portal, data) => {
    for (let i = 0; i < data.length; i++) {
        await Component(connect(DB_CONNECTION, portal))
            .updateOne({ _id: data[i]._id }, { deleteSoft: data[i].deleteSoft });
    }

    return true;
}
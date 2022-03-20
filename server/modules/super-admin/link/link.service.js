const Models = require(`../../../models`);
const { Link, Privilege, Role, Attribute } = Models;
// const { LINK_CATEGORY } = require(`../../../seed/terms`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Lấy danh sách tất cả các link của 1 công ty
 * @company id của công ty
 */
exports.getLinks = async (portal, query) => {
    let { type, page, limit } = query;

    let options = (type === 'active') ? { deleteSoft: false } : {};

    if (!page && !limit) {
        let links = await Link(connect(DB_CONNECTION, portal))
            .find(options)
            .populate({
                path: 'roles',
                model: Privilege(connect(DB_CONNECTION, portal)),
                populate: {
                    path: 'roleId',
                    model: Role(connect(DB_CONNECTION, portal))
                }
            });

        return links;
    } else {
        let option = (query.key && query.value)
            ? Object.assign(options, { [`${query.key}`]: new RegExp(query.value, "i") })
            : options;

        return await Link(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    {
                        path: 'roles',
                        model: Privilege(connect(DB_CONNECTION, portal)),
                        populate: {
                            path: 'roleId',
                            model: Role(connect(DB_CONNECTION, portal))
                        }
                    }
                ]
            });
    }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
exports.getLink = async (portal, id) => {
    return await Link(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'roles', populate: { path: 'roleId' } });
}

/**
 * Tạo link mới 
 * @data dữ liệu về link
 * @portal portal tương ứng với database cần sửa
 */
exports.createLink = async (portal, data) => {
    if (data.url === '/system') {
        throw ['cannot_create_this_url', 'this_url_cannot_be_use'];
    }

    let check = await Link(connect(DB_CONNECTION, portal))
        .findOne({ url: data.url });

    if (check !== null) {
        throw ['url_exist'];
    }

    return await Link(connect(DB_CONNECTION, portal))
        .create({
            url: data.url,
            description: data.description,
            deleteSoft: false
        });
}

/**
 * Chỉnh sửa link
 * @portal portal tương ứng với db
 * @id id link
 * @data dữ liệu về link
 */
exports.editLink = async (portal, id, data) => {
    console.log("EDIT link")
    let link = await Link(connect(DB_CONNECTION, portal))
        .findById(id);

    link.url = data.url;
    link.description = data.description;

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    array[i] = { ...array[i], name: attribute.attributeName};
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }
    if (data.attributes) {
        const attrArray = await filterValidAttributeArray(data.attributes);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                name: attr.name.trim(),
                value: attr.value.trim(),
                description: attr.description?.trim(),
            }
        });
    
        link.attributes = dataAttr;
    }

    await link.save();

    return link;
}

/**
 * Xóa link (chỉ xóa tạm thời - không xóa hẳn)
 * @id id link
 */
exports.deleteLink = async (portal, id, type) => {
    if (type === 'soft') {
        let link = await Link(connect(DB_CONNECTION, portal))
            .findById(id);
        link.deleteSoft = true;
        await link.save();
    } else {
        await Privilege(connect(DB_CONNECTION, portal))
            .deleteMany({
                resourceId: id,
                resourceType: 'Link'
            });
        await Link(connect(DB_CONNECTION, portal))
            .deleteOne({ _id: id });
    }

    return id;

}

/**
 * Thiếp lập mới quan hệ cho role và link
 * @portal portal của db
 * @linkId id của link
 * @roleArr mảng id các role
 */
exports.relationshipLinkRole = async (portal, linkId, roleArr) => {
    await Privilege(connect(DB_CONNECTION, portal))
        .deleteMany({
            resourceId: linkId,
            resourceType: 'Link'
        });
    let data = roleArr.map(role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    let privilege = await Privilege(connect(DB_CONNECTION, portal)).insertMany(data);

    return privilege;
}

/**
 * Thêm component vào 1 trang
 * @portal portal của db
 * @id id link
 * @componentId id component
 */
exports.addComponentOfLink = async (portal, id, componentId) => {
    let link = await Link(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'roles' });

    link.components.push(componentId);
    await link.save();

    return link;
}

exports.createLinkAttribute = async (portal, data) => {
    console.log("create-link-attribute")

    // Lấy danh sách các attribute valid
    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    array[i] = { ...array[i], name: attribute.attributeName};
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }

    const attrArray = await filterValidAttributeArray(data.attributes);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            name: attr.name.trim(),
            value: attr.value.trim(),
            description: attr.description.trim()
        }
    });

    // lấy ds các link cập nhật thuộc tính
    const linkAddAttribute = await Link(connect(DB_CONNECTION, portal)).find({
        _id: {
            $in: data.linkList.map(id => mongoose.Types.ObjectId(id))
        }
    }).populate({ path: 'roles', populate: { path: 'roleId' } });

    // Thêm - cập nhật thuộc tính
    linkAddAttribute.forEach(async (link) => {
        // Kiểm tra trùng thuộc tính thì không têm mới mà chỉ cập nhật value và description
        link.attributes.forEach((attr) => {
            dataAttr.forEach((inputAttr) => {
                if (attr.attributeId == inputAttr.attributeId) {
                    attr.value = inputAttr.value;
                    attr.description = inputAttr.description
                }
            })
        })
        // Thêm các thuộc tính chưa có
        if (link.attributes.length > 0) {
            const linkAttrId = link.attributes.map(attr => attr.attributeId);
            link.attributes = link.attributes.concat(dataAttr.filter(a => !linkAttrId.includes(a.attributeId)));
        }
        // Thêm mới nếu chưa có thuộc tính nào
        else {
            link.attributes = dataAttr

        }
        await link.save()

    })

    console.log("linkAddAttribute", linkAddAttribute)
    return linkAddAttribute;

}

/**
 * Lấy thông tin LINK_CATEGORY
 */
// exports.getLinkCategories = async () => {
//     return LINK_CATEGORY;
// }

exports.updateCompanyLinks = async (portal, data) => {
    for (let i = 0; i < data.length; i++) {
        await Link(connect(DB_CONNECTION, portal))
            .updateOne({ _id: data[i]._id }, { deleteSoft: data[i].deleteSoft });
    }

    return true;
}
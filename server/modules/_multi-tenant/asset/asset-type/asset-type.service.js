const Models = require(`${SERVER_MODELS_DIR}/_multi-tenant`);
const { AssetType } = Models;
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Danh mục văn bản
 */
exports.getAssetTypes = async (portal, query) => {
    const { typeNumber, typeName, page, limit } = query;

    if (typeNumber || typeName || page || limit) {
        var keySearch = {};

        // Bắt sựu kiện mã loại tài sản tìm kiếm khác ""
        if (typeNumber !== "") {
            keySearch = { ...keySearch, typeNumber: { $regex: typeNumber, $options: "i" } }
        }

        // Bắt sựu kiện tên loại tài sản tìm kiếm khác ""
        if (typeName !== "") {
            keySearch = { ...keySearch, typeName: { $regex: typeName, $options: "i" } }
        };

        var totalList = await AssetType(connect(DB_CONNECTION, portal)).count(keySearch);
        var listAssetTypes = await AssetType(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createDate': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0).populate({ path: 'parent' });

        return { totalList, listAssetTypes };
    } else {
        const list = await AssetType(connect(DB_CONNECTION, portal)).find();
        const dataConverted = list.map(type => {
            return {
                id: type._id.toString(),
                key: type._id.toString(),
                value: type._id.toString(),
                label: type.typeName,
                title: type.typeName,
                parent_id: type.parent ? type.parent.toString() : null
            }
        });
        const tree = await arrayToTree(dataConverted, {});
        return { list, tree };
    }

}

exports.createAssetTypes = async (portal, data) => {

    let dataArray;
    if (!Array.isArray(data)) {
        dataArray = [data]
    } else {
        dataArray = data;
    }
    for (let i = 0; i < dataArray.length; i++) {
        let query = {
            typeNumber: dataArray[i].typeNumber,
            typeName: dataArray[i].typeName,
            description: dataArray[i].description,
            defaultInformation: dataArray[i].defaultInformation,
        }

        if (dataArray[i].parent && dataArray[i].parent.length) {
            query.parent = dataArray[i].parent
        }
        await AssetType(connect(DB_CONNECTION, portal)).create(query);
    }

    return await this.getAssetTypes(portal, {});
}

exports.editAssetType = async (portal, id, data) => {
    const type = await AssetType(connect(DB_CONNECTION, portal)).findById(id);

    type.typeNumber = data.typeNumber,
        type.typeName = data.typeName,
        type.description = data.description,
        type.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    type.defaultInformation = data.defaultInformation,

        await type.save();

    return type;
}

exports.deleteAssetTypes = async (portal, id) => {
    const type = await AssetType(connect(DB_CONNECTION, portal)).findById(id);

    if (!type) {
        throw ['document_domain_not_found']
    }

    await AssetType(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    return await this.getAssetTypes(portal, {});
}


exports.deleteManyAssetType = async (portal, array) => {
    await AssetType(connect(DB_CONNECTION, portal)).deleteMany({ _id: { $in: array } });

    return await this.getAssetTypes(portal, {});
}
const AssetType = require('../../../models/asset/assetType.model');
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Danh mục văn bản
 */
exports.getAssetTypes = async (query, company) => {
    const { typeNumber, typeName, page, limit } = query;

    if (typeNumber || typeName || page || limit) {
        var keySearch = { company: company };

        // Bắt sựu kiện mã loại tài sản tìm kiếm khác ""
        if (typeNumber !== "") {
            keySearch = { ...keySearch, typeNumber: { $regex: typeNumber, $options: "i" } }
        }

        // Bắt sựu kiện tên loại tài sản tìm kiếm khác ""
        if (typeName !== "") {
            keySearch = { ...keySearch, typeName: { $regex: typeName, $options: "i" } }
        };

        var totalList = await AssetType.count(keySearch);
        var listAssetTypes = await AssetType.find(keySearch).sort({ 'createDate': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0).populate('parent');

        return { totalList, listAssetTypes };
    } else {
        const list = await AssetType.find({ company });
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

exports.createAssetTypes = async (company, data) => {

    let dataArray;
    if (!Array.isArray(data)) {
        dataArray = [data]
    } else {
        dataArray = data;
    }
    console.log("55", dataArray)
    for (let i = 0; i < dataArray.length; i++) {
        let query = {
            company,
            typeNumber: dataArray[i].typeNumber,
            typeName: dataArray[i].typeName,
            description: dataArray[i].description,
            defaultInformation: dataArray[i].defaultInformation,
        }

        if (dataArray[i].parent && dataArray[i].parent.length) {
            query.parent = dataArray[i].parent
        }
        console.log(query)
        await AssetType.create(query);
    }
    
    return await this.getAssetTypes({}, company);
}

exports.editAssetType = async (id, data) => {
    const type = await AssetType.findById(id);

    type.typeNumber = data.typeNumber,
    type.typeName = data.typeName,
    type.description = data.description,
    type.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    type.defaultInformation = data.defaultInformation,

    await type.save();

    return type;
}

exports.deleteAssetTypes = async (id) => {
    const type = await AssetType.findById(id);

    if (!type) {
        throw ['document_domain_not_found']
    }

    await AssetType.deleteOne({ _id: id });

    return await this.getAssetTypes({}, type.company);
}


exports.deleteManyAssetType = async (array, company) => {
    await AssetType.deleteMany({ _id: { $in: array } });

    return await this.getAssetTypes({}, company);
}
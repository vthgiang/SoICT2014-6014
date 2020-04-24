const AssetType = require('../../../models/asset/assetType.model');

//lấy danh sách loại tài sản
exports.searchAssetTypes = async (company) => {
    var listAssetTypes = await AssetType.find({
        company: company
    })
    return listAssetTypes;

}

// thêm mới loại tài sản
exports.createAssetType = async (data, company) => {
    console.log(data);
    var createAssetType = await AssetType.create({
        company: company,
        typeNumber: data.typeNumber,
        typeName: data.typeName,
        timeDepreciation: data.timeDepreciation,
        parent: null,
        // parent: ObjectId.isValid(data.parent) ? data.parent : null,
        description: data.description,
    });
    return createAssetType;
}

// Xoá thông tin loại tài sản
exports.deleteAssetType = async (id) => {
    return await AssetType.findOneAndDelete({
        _id: id
    });
}

// Update thông tin loại tài sản
exports.updateAssetType = async (id, data) => {
    var assetTypeChange = {
        typeNumber: data.typeName,
        typeName: data.typeName,
        timeDepreciation: data.timeDepreciation,
        parent: data.parent,
        description: data.description,
    };
    await AssetType.findOneAndUpdate({
        _id: id
    }, {
        $set: assetTypeChange
    });
    return await AssetType.findOne({
        _id: id
    })
}
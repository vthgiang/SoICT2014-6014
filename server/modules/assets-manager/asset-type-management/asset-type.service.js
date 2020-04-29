const AssetType = require('../../../models/asset/assetType.model');

/**
 * Lấy danh sách loại tài sản
 */
exports.searchAssetTypes = async (company) => {
    var listAssetTypes = await AssetType.find({
        company: company
    })
    return listAssetTypes;
//
}

/**
 * Thêm mới thông tin loại tài sản
 * @data: dữ liệu loại tài sản mới
 * @company: id công ty người tạo
 */
exports.createAssetType = async (data, company) => {
    console.log(data);
    var createAssetType = await AssetType.create({
        company: company,
        typeNumber: data.typeNumber,
        typeName: data.typeName,
        timeDepreciation: data.timeDepreciation,
        parent: data.parent,
        // parent: ObjectId.isValid(data.parent) ? data.parent : null,
        description: data.description,
    });
    return createAssetType;
}

/**
 * Xoá thông tin loại tài sản
 * @id: id loại tài sản muốn xoá
 */
exports.deleteAssetType = async (id) => {
    return await AssetType.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin loại tài sản
 * @id: id loại tài sản muốn update
 */
exports.updateAssetType = async (id, data) => {
    var assetTypeChange = {
        typeNumber: data.typeNumber,
        typeName: data.typeName,
        timeDepreciation: data.timeDepreciation,
        parent: data.parent,
        description: data.description,
    };
    // Cập nhật thông tin loại tài sản vào database
    await AssetType.findOneAndUpdate({
        _id: id
    }, {
        $set: assetTypeChange
    });
    return await AssetType.findOne({
        _id: id
    })
}

// Kiểm tra sự tồn tại của typeNumber
exports.checkAssetTypeExisted = async (typeNumber, company) => {
    var idTypeNumber = await AssetType.find({
        typeNumber: typeNumber,
        company: company
    }, {
        field1: 1
    })
    var checkTypeNumber = false;
    if (idTypeNumber.length !== 0) {
        checkTypeNumber = true
    }
    return checkTypeNumber;
}

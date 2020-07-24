const AssetType = require('../../../models/asset/assetType.model');
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
/**
 * Lấy danh sách loại tài sản
 */
exports.searchAssetTypes = async (data, company) => {
    var keySearch = {company: company};

    // Bắt sựu kiện mã loại tài sản tìm kiếm khác ""
    if (data.typeNumber !== "") {
        keySearch = {...keySearch, typeNumber: {$regex: data.typeNumber, $options: "i"}}
    }

    // Bắt sựu kiện tên loại tài sản tìm kiếm khác ""
    if (data.typeName !== "") {
        keySearch = {...keySearch, typeName: {$regex: data.typeName, $options: "i"}}
    };

    var totalList = await AssetType.count(keySearch);
    var listAssetTypes = await AssetType.find(keySearch).sort({'createDate': 'desc'}).skip(data.page).limit(data.limit).populate('parent');

    return {totalList, listAssetTypes};
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
        // parent: data.parent,
        parent: data.parent ? data.parent : null,
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
        // parent: data.parent,
        parent: data.parent ? data.parent : null,
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


/**
 * Danh mục văn bản
 */
exports.getAssetTypes = async (company) => {
    const list = await AssetType.find({ company });
    console.log(list, 'list')
    const dataConverted = list.map( type => {
        return {
            id: type._id.toString(),
            key: type._id.toString(),
            value: type._id.toString(),
            label: type.typeName,
            title: type.typeName,
            parent_id: type.parent !== undefined ? type.parent.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});

    return {list, tree};
}

exports.createAssetTypes = async (company, data) => {
    console.log(data, 'data')
    await AssetType.create({
        company,
        typeNumber: data.typeNumber,
        typeName: data.typeName,
        description: data.description,
        parent: data.parent
    });

    return await this.getAssetTypes(company);
}

exports.editAssetType = async (id, data) => {
    const type = await AssetType.findById(id);
    type.typeNumber = data.typeNumber,
    type.typeName = data.typeName,
    type.description = data.description,
    type.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    await type.save();

    return type;
}

exports.deleteAssetTypes = async (id) => {
    const type = await AssetType.findById(id);
    if(type === null) throw ['document_domain_not_found']
    await AssetType.deleteOne({_id: id});

    return await this.getAssetTypes(type.company);
}


exports.deleteManyAssetType = async (array, company) => {
    await AssetType.deleteMany({_id: {$in: array}});

    return await this.getAssetTypes(company);
}
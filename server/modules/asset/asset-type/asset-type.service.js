const Models = require('../../../models');
const { AssetType, Asset } = Models;
const { connect } = require(`../../../helpers/dbHelper`);
const arrayToTree = require('array-to-tree');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Danh mục văn bản
 */
exports.getAssetTypes = async (portal, company, query) => {
    let { typeNumber, typeName, page, perPage } = query;
    let skip;

    if (perPage >= 0) {
        perPage = Number(perPage);
        if (page) {
            page = Number(page);
            skip = perPage * (page - 1);
        } 
    }

    if (typeNumber || typeName || page || perPage) {
        var keySearch = { };

        // Bắt sựu kiện mã loại tài sản tìm kiếm khác ""
        if (typeNumber) {
            keySearch = { ...keySearch, typeNumber: { $regex: typeNumber, $options: "i" } }
        }

        // Bắt sựu kiện tên loại tài sản tìm kiếm khác ""
        if (typeName) {
            keySearch = { ...keySearch, typeName: { $regex: typeName, $options: "i" } }
        };

        var totalList = await AssetType(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        const list = await AssetType(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createDate': 'desc' }).skip(skip ? parseInt(skip) : 0).limit(perPage ? parseInt(perPage) : 0).populate({ path: 'parent' });

         const dataConverted = list && list.map(type => {
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
        const totalPage = totalList && perPage ? Math.ceil(totalList / perPage) : 1;
        
        return { totalList, list, tree, totalPage };
    } else {
        const list = await AssetType(connect(DB_CONNECTION, portal)).find().populate({ path: 'parent' });
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
        return { list, tree , totalList: list?.length};
    }

}

exports.createAssetTypes = async (portal, company, data) => {
    let checkName = await AssetType(connect(DB_CONNECTION, portal)).findOne({typeName: data.typeName});
    if (checkName) throw ['asset_type_name_exist'];

    let checkNumber = await AssetType(connect(DB_CONNECTION, portal)).findOne({typeNumber: data.typeNumber});
    if (checkNumber) throw ['asset_type_number_exist'];

    let dataArray;
    if (!Array.isArray(data)) {
        dataArray = [data]
    } else {
        dataArray = data;
    }

    for (let i = 0; i < dataArray.length; i++) {
        let query = {
            company: company,
            typeNumber: dataArray[i].typeNumber,
            typeName: dataArray[i].typeName,
            description: dataArray[i].description,
            defaultInformation: dataArray[i].defaultInformation.filter(info => Boolean(info)),
        }

        if (dataArray[i].parent && dataArray[i].parent.length) {
            query.parent = dataArray[i].parent
        }
        await AssetType(connect(DB_CONNECTION, portal)).create(query);
    }

    return await this.getAssetTypes(portal, company, {});
}

exports.importAssetTypes = async (portal, company, data) => {
    if (data?.length) {
        const dataLength = data.length;
        for (let i = 0; i < dataLength; i++){
            if (data[i].parent) {
                const getAssetTypeParent = await AssetType(connect(DB_CONNECTION, portal)).findOne({ typeName: data[i]?.parent?.trim() });
                data[i].parent = getAssetTypeParent?._id;
            } else {
                data[i].parent = null;
            }
            await AssetType(connect(DB_CONNECTION, portal)).create({
                company: company,
                typeNumber: data[i].typeNumber,
                typeName: data[i]?.typeName?.trim(),
                description: data[i].description,
                defaultInformation: data[i].defaultInformation.filter(info => Boolean(info)),
                parent: data[i].parent
            });
        }
        // console.log('dataa', data);
    }
    return await this.getAssetTypes(portal, company, {});
}

exports.editAssetType = async (portal, id, data) => {
    const type = await AssetType(connect(DB_CONNECTION, portal)).findById(id);
    if (type.typeName !== data.typeName) {
        let checkName = await AssetType(connect(DB_CONNECTION, portal)).findOne({
            typeName: data.typeName
        });

        if (checkName) {
            throw ['asset_type_name_exist'];
        }
    }

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

    return await this.getAssetTypes(portal, type.company, {});
}


/**
 * Xóa danh sách các loại tài sản
 * @param {*} portal 
 * @param {*} company 
 * @param {*} array 
 */
exports.deleteManyAssetType = async (portal, company, array) => {
    const assetType = await AssetType(connect(DB_CONNECTION, portal)).find({ _id: { $in: array } });
    let errors = [];

    const deleteAssetType = async(assetTypeId) => {
        const assets = await Asset(connect(DB_CONNECTION, portal)).find({ assetType: assetTypeId });
        for(let i=0; i < assets.length; i++){
            if(Array.isArray(assets[i].assetType)){
                assets[i].assetType = assets[i].assetType.filter(type => type.toString() !== assetTypeId);
                console.log('asset update: ', assets[i]);
                await assets[i].save();
            }
        }
        await AssetType(connect(DB_CONNECTION, portal)).deleteOne({ _id: assetTypeId });
    }

    for(let i=0; i < assetType.length; i++){
        await deleteAssetType(assetType[i]._id);
    }

    const assetTypes = await this.getAssetTypes(portal, company, {});

    return assetTypes;
}
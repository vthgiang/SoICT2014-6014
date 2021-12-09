const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { Console } = require("winston/lib/winston/transports");
const { Asset } = require("../../../models");
const AssetService = require('../asset-management/asset.service');
const { freshObject } = require(`../../../helpers/functionHelper`);

const { AssetLot, } = Models;

/**
 * Lấy danh sách lô tài sản theo key tìm kiếm
 * @params : dữ liệu key tìm kiếm
 */
exports.searchAssetLots = async (portal, params) => {
    let keySearch = {};
    //tìm kiếm theo mã lô
    if (params.code) {
        keySearch = { ...keySearch, code: { $regex: param.code, $options: "i" } };
    }
    //tìm kiếm theo tên lô
    if (params.assetLotName) {
        keySearch = { ...keySearch, assetLotName: { $regex: param.assetLotName, $option: "i" } };
    }
    //tìm kiếm theo nha san xuat
    if (params.supplier) {
        keySearch = { ...keySearch, supplier: { $regex: param.supplier, $option: "i" } };
    }
    //tim kiem theo loai tai san
    if (params.assetType) {
        keySearch = { ...keySearch, assetType: { $in: JSON.parse(params.assetType) } };
    }
    // tim kiem theo nhom tai san
    if (params.group) {
        keySearch = { ...keySearch, group: { $in: params.group } };
    }
    let totalList = 0,
        listAssetLots = [];
    // Lấy danh sách lô tài sản
    totalList = await AssetLot(connect(DB_CONNECTION, portal)).countDocuments(
        keySearch
    );

    listAssetLots = await AssetLot(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .populate([
            { path: "assetType assignedToOrganizationalUnit" },
        ])
        .sort({ createdAt: "desc" })
        .skip(params.page)
        .limit(params.limit);
    return { data: listAssetLots, totalList };
}

/**
 * Thêm lô tài sản 
 * @params : code, assetLotName, total, price, assetType, group, listAssets
 */
exports.createAssetLot = async (portal, company, data, fileInfo) => {
    let checkAssetLot = [];
    data = freshObject(data);
    console.log("hang data", data);
    // const session = await mongoose.startSession();
    // session.startTransaction();

    //kiểm tra trùng mã lô tài sản
    let checkCodeAssetLot = await AssetLot(
        connect(DB_CONNECTION, portal)
    ).findOne({
        code: data.code
    });

    if (checkCodeAssetLot) {
        checkAssetLot.push(data.code);
    }

    if (checkAssetLot.length === 0) {
        //thỏa mãn ko bị trùng
        let avatar =
            fileInfo && fileInfo.avatar === ""
                ? data.avatar
                : fileInfo.avatar,
            file = fileInfo && fileInfo.file;

        let {
            listAssets,
            files,
        } = data;
        files = files && this.mergeUrlFileToObject(file, files);

        //thêm lô tài sản vào db
        //const db = await mongoose.createConnection(DB_CONNECTION);
        // const session = await DB_CONNECTION.startSession();
        // session.startTransaction();
        //try {
        //const opts = { session };
        var createAssetLot = await AssetLot(connect(DB_CONNECTION, portal)).create([{
            company: company,
            code: data.code,
            assetLotName: data.assetLotName,
            assetType: data.assetType,
            supplier: data.supplier,
            group: data.group ? data.group : "other",
            total: data.total,
            price: data.price,
            document: files
        }]);

        //thêm từng tài sản vào db asset
        listAssets = listAssets.map((item) => {
            return {
                ...item,
                company: company,
                avatar: avatar,
                assetName: data.assetLotName,
                assetLot: createAssetLot._id,
                assetType: data.assetType,
                group: data.group ? data.group : "other",
                purchaseDate: data.purchaseDate
                    ? data.purchaseDate
                    : undefined,
                warrantyExpirationDate: data.warrantyExpirationDate
                    ? data.warrantyExpirationDate
                    : undefined,
                //khấu hao của các tài sản trong lô là giống nhau
                cost: data.cost ? data.cost : 0,
                usefulLife: data.usefulLife ? data.usefulLife : 0,
                residualValue: data.residualValue,
                startDepreciation: data.startDepreciation,
                depreciationType: data.depreciationType
                    ? data.depreciationType
                    : "none",
            };
        });

        for (let i = 0; i < listAssets.length; i++) {
            listAssets[i] = freshObject(listAssets[i]);
            await Asset(connect(DB_CONNECTION, portal)).create(listAssets[i]);
        }

        //lấy thông tin lô tài sản vừa thêm
        let assetLot = await AssetLot(connect(DB_CONNECTION, portal)).find({
            _id: createAssetLot._id
        }).populate({ path: 'assetType' });

        // await session.commitTransaction();
        // session.endSession();
        return { assetLot };
        //}
        // } catch(ex) {
        //     console.log('loi',ex.toString());
        //     // await session.abortTransaction();
        //     // session.endSession();
        //     throw {
        //         messages: "create_asset_lot_failed",
        //     };
        // }

    } else {
        throw {
            messages: "asset_lot_code_exist",
            assetLotCodeError: checkAssetLot,
        };
    }
}

exports.updateAssetLot = async (portal, company, id, data, fileInfo) => {
    data = freshObject(data);
    let file = fileInfo && fileInfo.file;
    let {
        files,
    } = data;
    files = files && this.mergeUrlFileToObject(file, files);
    let oldLot = await AssetLot(connect(DB_CONNECTION, portal)).findById(id);
    //console.log("hang qlcv: ", oldLot);
    //cho phép sửa mã lô, tên lô, nhà cung cấp, khấu hao, loại tài sản, nhóm tài sản
    if (oldLot.code !== data.code) {
        let checkCodeAsset = await AssetLot(
            connect(DB_CONNECTION, portal)
        ).findOne({
            code: data.code,
        });

        if (checkCodeAsset) {
            throw ["asset_lot_code_exist"];
        }
        //console.log("hang qlcv asset: ", arrAssetEdit);
    }

    /* thay đổi mã tài sản, nhóm tài sản, loại tài sản, ngày mua, ngày hết hạn bảo hành,
    thông tin khấu hao của các tài sản trong lô */
    let arrAssetEdit = await Asset(connect(DB_CONNECTION, portal))
        .find({ assetLot: mongoose.Types.ObjectId(oldLot._id) });
    let lengthOldCode = oldLot.code.length;
    for (let i = 0; i < arrAssetEdit.length; i++) {
        var oldAsset = await Asset(
            connect(DB_CONNECTION, portal)
        ).findOne({
            _id: arrAssetEdit[i]._id,
        });
        if (oldAsset.code.includes(oldLot.code)) {
            oldAsset.code = oldAsset.code.replace(oldLot.code, data.code);
        }
        oldAsset.group = data.group;
        oldAsset.assetType = typeof (data.assetType) === "string" ? JSON.parse(data.assetType) : data.assetType;
        oldAsset.purchaseDate = data.purchaseDate;
        oldAsset.warrantyExpirationDate = data.warrantyExpirationDate;
        //khấu hao
        oldAsset.cost = data.cost;
        oldAsset.usefulLife = data.usefulLife;
        oldAsset.residualValue = data.residualValue;
        oldAsset.startDepreciation = data.startDepreciation;
        oldAsset.depreciationType = data.depreciationType
            ? data.depreciationType
            : "none";
        await oldAsset.save();
    }

    oldLot.code = data.code;
    oldLot.assetLotName = data.assetLotName;
    oldLot.supplier = data.supplier;
    oldAsset.group = data.group;
    oldAsset.total = data.total;
    oldAsset.price = data.price;
    oldAsset.assetType = typeof (data.assetType) === "string" ? JSON.parse(data.assetType) : data.assetType;
    await oldLot.save();
    let assetLot = await AssetLot(connect(DB_CONNECTION, portal)).findById(id);
    return assetLot;
}

exports.deleteAssetLots = async (portal, assetLotIds) => {
    let assetLots = await AssetLot(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: assetLotIds.map(item => mongoose.Types.ObjectId(item)) } });

    //xóa các tài sản trong lô tài sản đã xóa
    let assets = await Asset(connect(DB_CONNECTION, portal))
        .deleteMany({ assetLot: { $in: assetLotIds.map(item => mongoose.Types.ObjectId(item)) } });

    return assetLots;

}
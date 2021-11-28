const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { Console } = require("winston/lib/winston/transports");
const { Asset } = require("../../../models");
const AssetService = require('../asset-management/asset.service');

const { AssetLot, AssetType } = Models;

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

exports.createAssetLot = async (portal, company, data, fileInfo) => {
    let checkAssetLot = [];
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
            maintainanceLogs,
            files,
        } = data;
        files = files && this.mergeUrlFileToObject(file, files);
        console.log("hangbui listAssets: "+listAssets);
        //thêm lô tài sản vào db
        var createAssetLot = await AssetLot(
            connect(DB_CONNECTION, portal)
        ).create({
            company: company,
            code: data.code,
            assetLotName: data.assetLotName,
            assetType: data.assetType,
            supplier: data.supplier,
            group: data.group ? data.group : undefined,
            total: data.total,
            price: data.price,
            document: files
        })
        console.log("hangbui assetlotid: ",createAssetLot._id);
        console.log("hangbui listAssets: ",listAssets);
        //thêm từng tài sản vào db asset
        listAssets = listAssets.map((item) => {
            return {
                ...item,
                company: company,
                avatar: avatar,
                assetName: data.assetLotName,
                assetLot: createAssetLot._id,
                maintainanceLogs: maintainanceLogs,
                assetType: data.assetType,
                group: data.group,
                purchaseDate: data.purchaseDate
                    ? data.purchaseDate
                    : undefined,
                warrantyExpirationDate: data.warrantyExpirationDate
                    ? data.warrantyExpirationDate
                    : undefined,
            };
        });
        console.log("hangbui listAssets: ",listAssets);
        for(let i =0; i< listAssets.length; i++){
            await Asset(
                connect(DB_CONNECTION,portal)
                ).create(listAssets[i]);
        }
        
    } else {
        throw {
            messages: "asset_lot_code_exist",
            assetLotCodeError: checkAssetLot,
        };
    }

    //lấy thông tin lô tài sản vừa thêm
    let assetLot = await AssetLot(connect(DB_CONNECTION, portal)).find({
        _id: createAssetLot._id
    }).populate({ path: 'assetType' });
    return { assetLot };
}
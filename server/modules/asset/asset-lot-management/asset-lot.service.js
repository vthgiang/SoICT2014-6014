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
        keySearch = { ...keySearch, code: { $regex: params.code, $options: "i" }, };
    }
    //tìm kiếm theo tên lô
    if (params.assetLotName) {
        keySearch = { ...keySearch, assetLotName: { $regex: params.assetLotName, $options: "i" }, };
    }
    //tìm kiếm theo nha san xuat
    if (params.supplier) {
        keySearch = { ...keySearch, supplier: { $regex: params.supplier, $options: "i" }, };
    }
    //tim kiem theo loai tai san
    if (params.assetType) {
        keySearch = { ...keySearch, assetType: { $in: JSON.parse(params.assetType) }, };
    }
    // tim kiem theo nhom tai san
    if (params.group) {
        keySearch = { ...keySearch, group: { $in: params.group }, };
    }
    let totalList = 0, listAssetLots = [];

    if (params.getAll === false) {
        console.log("hang");

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
    } else {
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
        return { data: listAssetLots, totalList };
    }

}

/**
 * Thêm lô tài sản 
 * @params : code, assetLotName, total, price, assetType, group, listAssets
 */
exports.createAssetLot = async (portal, company, data, fileInfo) => {
    let checkAssetLot = [];
    data = freshObject(data);
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

        files = files && AssetService.mergeUrlFileToObject(file, files);
        var createAssetLot = await AssetLot(connect(DB_CONNECTION, portal)).create({
            avatar: avatar,
            company: company,
            code: data.code,
            assetLotName: data.assetLotName,
            assetType: data.assetType,
            supplier: data.supplier,
            group: data.group ? data.group : "other",
            total: data.total,
            price: data.price,
            documents: files
        });

        //thêm từng tài sản vào db asset
        listAssets = listAssets.map((item) => {
            return {
                ...item,
                company: company,
                assetLot: createAssetLot._id,
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
        }
        await AssetService.createAsset(portal, company, listAssets);

        //lấy thông tin lô tài sản vừa thêm
        let assetLot = await AssetLot(connect(DB_CONNECTION, portal)).find({
            _id: createAssetLot._id
        }).populate({ path: 'assetType' });
        return { assetLot };
    } else {
        throw {
            messages: "asset_lot_code_exist",
            assetLotCodeError: checkAssetLot,
        };
    }
}

exports.updateAssetLot = async (portal, company, userId, id, data, fileInfo) => {
    data = freshObject(data);
    let avatar =
        fileInfo && fileInfo.avatar === ""
            ? data.avatar
            : fileInfo.avatar;
    let file = fileInfo && fileInfo.file;
    let {
        deleteAssetInLot,
        createFiles,
        editFiles,
        deleteFiles,
        files,
        listAssets,
    } = data;
    files = files && AssetService.mergeUrlFileToObject(file, files);
    let oldLot = await AssetLot(connect(DB_CONNECTION, portal)).findById(id);

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

    deleteEditCreateObjectInArrayObject = (
        arrObject,
        arrDelete,
        arrEdit,
        arrCreate,
        fileInfor = undefined
    ) => {
        if (arrDelete) {
            for (let n in arrDelete) {
                arrObject = arrObject.filter(
                    (x) => x._id.toString() !== arrDelete[n]._id
                );
            }
        }

        if (arrEdit) {
            if (fileInfor) {
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for (let n in arrEdit) {
                arrObject = arrObject.map((x) =>
                    x._id.toString() !== arrEdit[n]._id ? x : arrEdit[n]
                );
            }
        }

        if (arrCreate) {
            if (fileInfor) {
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach((x) => {
                if (x.incidentCode && arrObject.some(curNode => curNode.incidentCode === x.incidentCode))
                    throw ['incident_code_exist'];
                arrObject.push(x)
            });
        }

        return arrObject;
    };

    oldLot.documents = deleteEditCreateObjectInArrayObject(
        oldLot.documents,
        deleteFiles,
        editFiles,
        createFiles,
        file
    );

    oldLot.avatar = avatar;
    oldLot.code = data.code;
    oldLot.assetLotName = data.assetLotName;
    oldLot.supplier = data.supplier;
    oldLot.group = data.group;
    oldLot.total = data.total;
    oldLot.price = data.price;
    oldLot.assetType = typeof (data.assetType) === "string" ? JSON.parse(data.assetType) : data.assetType;
    await oldLot.save();

    if (deleteAssetInLot !== undefined && deleteAssetInLot.length > 0) {
        await AssetService.deleteAsset(portal, deleteAssetInLot);
    }
    listAssets.forEach(element => {

        AssetService.updateAssetInformation(portal, company, userId, element._id, element);
    });

    let assetLot = await AssetLot(connect(DB_CONNECTION, portal)).find({
        _id: oldLot._id
    }).populate({ path: 'assetType' });
    return assetLot;
}

exports.deleteAssetLots = async (portal, assetLotIds) => {
    //console.log("hang deleteID ", assetLotIds);
    let assetLots = await AssetLot(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: assetLotIds.map(item => mongoose.Types.ObjectId(item)) } });

    //xóa các tài sản trong lô tài sản đã xóa
    let assets = await Asset(connect(DB_CONNECTION, portal))
        .deleteMany({ assetLot: { $in: assetLotIds.map(item => mongoose.Types.ObjectId(item)) } });

    return assetLots;

}

exports.getAssetLotInforById = async (portal, assetLotIds) => {
    let assetLot = await AssetLot(connect(DB_CONNECTION, portal))
        .findById(assetLotIds);
    let listAssets = await Asset(connect(DB_CONNECTION, portal))
        .find({ assetLot: mongoose.Types.ObjectId(assetLotIds) })
        .populate({ path: 'assetType' });;
    return { assetLot, listAssets }
}
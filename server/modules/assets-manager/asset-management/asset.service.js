const {
    Asset,
} = require('../../../models').schema;


/**
 * Lấy thông tin tài sản theo id
 * @id : id thông tin tài sản cần lấy
 */
exports.getAssetInforById = async (id) => {
    return await Asset.findById(id);
}


/**
 * Lấy danh sách tài sản theo key tìm kiếm
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchAssetProfiles = async (params, company) => {
    let keySearch = { company: company };

    // Bắt sựu kiện MSTS tìm kiếm khác ""
    if (params.code !== undefined && params.code.length !== 0) {
        keySearch = { ...keySearch, code: { $regex: params.code, $options: "i" } }
    };

    // Bắt sựu kiện Tên tài sản tìm kiếm khác ""
    if (params.assetName !== undefined && params.assetName.length !== 0) {
        keySearch = { ...keySearch, assetName: { $regex: params.assetName, $options: "i" } }
    };

    // Thêm key tìm kiếm tài sản theo trạng thái hoạt động vào keySearch
    if (params.status !== undefined && params.status.length !== 0) {
        keySearch = { ...keySearch, status: { $in: params.status } };
    };

    // Lấy danh sách tài sản
    let totalList = await Asset.count(keySearch);
    let listAssets = await Asset.find(keySearch, { field1: 1, emailInCompany: 1 })
        .sort({ 'createdAt': 'desc' }).skip(params.page).limit(params.limit);
    let data = [];
    for (let n in listAssets) {
        let assets = await Asset.find({ _id: listAssets[n]._id });
        data[n] = { assets }
    }
    return { data, totalList }
}


/**
 * Function merge urlFile upload với object
 * @arrayFile : mảng chứa các file
 * @arrayObject :mảng chứa các object
 */
exports.mergeUrlFileToObject = (arrayFile, arrayObject) => {
    if (arrayFile !== undefined) {
        arrayObject.forEach(x => {
            arrayFile.forEach(y => {
                if (x.file === y.originalname) {
                    x.urlFile = `/${y.path}`;
                }
            })
        });
        return arrayObject;
    } else return arrayObject;
}

/**
 * Thêm mới tài sản
 * @data : Dữ liệu thông tin tài sản
 * @company : Id công ty
 * @fileInfo : Thông tin file đính kèm
 */
exports.createAsset = async (data, company, fileInfo) => {
    console.log(data);
    console.log(fileInfo);

    let avatar = fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        file = fileInfo.file;
    let { maintainanceLogs, usageLogs, incidentLogs, locationLogs, files } = data;
    files = this.mergeUrlFileToObject(file, files);

    let createAsset = await Asset.create({
        company: company,
        avatar: avatar,
        assetName: data.assetName,
        code: data.assetName,
        serial: data.serial,
        assetType: data.assetType,
        purchaseDate: data.purchaseDate,
        warrantyExpirationDate: data.warrantyExpirationDate,
        managedBy: data.managedBy,
        assignedTo: data.assignedTo,
        handoverFromDate: data.handoverFromDate,
        handoverToDate: data.handoverToDate,
        location: data.location,
        status: data.status,
        description: data.description,
        detailInfo: data.detailInfo,

        // khấu hao
        cost: data.cost,
        usefulLife: data.usefulLife,
        residualValue: data.residualValue,
        startDepeciation: data.startDepeciation,

        // sửa chữa - bảo trì
        maintainanceLogs: maintainanceLogs, // khi thêm mới tôi chưa thêm 
        // day la toi khai bao o tren roi . oi,ông thu mo cai cua toi xem 

        //cấp phát - sử dụng
        usageLogs: usageLogs,

        // sự cố tài sản
        incidentLogs: incidentLogs,

        // Lịch sử vị trí tài sản
        locationLogs: locationLogs,

        archivedRecordNumber: data.archivedRecordNumber,
        files: files,
    });

    // Lấy thông tin nhân viên vừa thêm vào
    let assets = await Asset.find({ _id: createAsset._id });

    return { assets };
}


/**
 * Cập nhât thông tin tài sản theo id
 */
exports.updateAssetInformation = async (id, data, fileInfo, company) => {
    let { asset,
        createMaintainanceLogs, deleteMaintainanceLogs, editMaintainanceLogs,
        createUsageLogs, editUsageLogs, deleteUsageLogs,
        createIncidentLogs, editIncidentLogs, deleteIncidentLogs,
        createFiles, editFiles, deleteFiles } = data;
    let avatar = fileInfo.avatar === "" ? asset.avatar : fileInfo.avatar,
        file = fileInfo.file;

    let oldAsset = await Asset.findById(id);

    deleteEditCreateObjectInArrayObject = (arrObject, arrDelete, arrEdit, arrCreate, fileInfor = undefined) => {
        if (arrDelete !== undefined) {
            for (let n in arrDelete) {
                arrObject = arrObject.filter(x => x._id.toString() !== arrDelete[n]._id);
            };
        };
        if (arrEdit !== undefined) {
            if (fileInfor !== undefined) {
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for (let n in arrEdit) {
                arrObject = arrObject.map(x => (x._id.toString() !== arrEdit[n]._id) ? x : arrEdit[n])
            }
        };
        if (arrCreate !== undefined) {
            if (fileInfor !== undefined) {
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach(x => arrObject.push(x));
        };
        return arrObject;
    }

    oldAsset.usageLogs = deleteEditCreateObjectInArrayObject(oldAsset.usageLogs, deleteUsageLogs, editUsageLogs, createUsageLogs);
    oldAsset.maintainanceLogs = deleteEditCreateObjectInArrayObject(oldAsset.maintainanceLogs, deleteMaintainanceLogs, editMaintainanceLogs, createMaintainanceLogs);
    oldAsset.incidentLogs = deleteEditCreateObjectInArrayObject(oldAsset.incidentLogs, deleteIncidentLogs, editIncidentLogs, createIncidentLogs);
    oldAsset.files = deleteEditCreateObjectInArrayObject(oldAsset.files, deleteFiles, editFiles, createFiles, file);

    oldAsset.avatar = avatar;
    oldAsset.assetName = asset.assetName;
    oldAsset.code = asset.code;
    oldAsset.serial = asset.serial;
    oldAsset.assetType = asset.assetType;
    oldAsset.purchaseDate = asset.purchaseDate;
    oldAsset.warrantyExpirationDate = asset.warrantyExpirationDate;
    oldAsset.managedBy = asset.managedBy;
    oldAsset.assignedTo = asset.assignedTo;
    oldAsset.handoverFromDate = asset.handoverFromDate;
    oldAsset.handoverToDate = asset.handoverToDate;
    oldAsset.location = asset.location;
    oldAsset.status = asset.status;
    oldAsset.description = asset.description;
    oldAsset.detailInfo = asset.detailInfo;

    oldAsset.cost = asset.cost;
    oldAsset.usefulLife = asset.usefulLife;
    oldAsset.residualValue = asset.residualValue;
    oldAsset.startDepeciation = asset.startDepeciation;

    oldAsset.archivedRecordNumber = asset.archivedRecordNumber;

    // Edit  thông tin tài sản
    oldAsset.save();

    // Function edit, create, Delete Document of collection
    queryEditCreateDeleteDocumentInCollection = async (assetId, company, collection, arrDelete, arrEdit, arrCreate) => {
        let queryDelete = arrDelete !== undefined ? arrDelete.map(x => { return { deleteOne: { "filter": { "_id": x._id } } } }) : [];
        let queryEdit = arrEdit !== undefined ? arrEdit.map(x => {
            return { updateOne: { "filter": { "_id": x._id }, "update": { $set: x } } }
        }) : [];
        let queryCrete = arrCreate !== undefined ? arrCreate.map(x => { return { insertOne: { "document": { ...x, asset: assetId, company: company } } } }) : [];
        let query = [...queryDelete, ...queryEdit, ...queryCrete];
        if (query.length !== 0) {
            await collection.bulkWrite(query);
        }
    };

    // Lấy thông tin tài sản vừa thêm vào
    let assets = await Asset.find({ _id: oldAsset._id });

    return { assets };
}

/**
 * Xoá thông tin tài sản
 * @id : Id tài sản cần xoá
 */
exports.deleteAsset = async (id) => {
    let asset = await Asset.findOneAndDelete({ _id: id });

    return asset;
}


//******************************** Chức năng quản lý bảo trì ****************************************/


/*
 * Lấy danh sách tất cả các phiếu bảo trì của tất cả tài sản hoặc có thể lấy ra danh sách các phiếu bảo trì gần nhất của tất cả tài sản
 */
exports.searchMaintainances = async (id, data, company) => {

}

/*
 * Thêm mới phiếu bảo trì
 */
exports.createMaintainance = async (id, data, company) => {

}

/**
 * Chỉnh sửa phiếu bảo trì
 */
exports.updateMaintainance = async (id, data, company) => {

}

/**
 * Xóa phiếu bảo trì
 */
exports.deleteMaintainance = async (id, data, company) => {

}


//******************************** Chức năng quản lý sử dụng ****************************************/
/*
 * Lấy danh sách tất cả lịch sử sử dụng của tất cả tài sản hoặc có thể lấy ra danh sách các lịch sử sử dụng gần nhất của tất cả tài sản
 */
exports.searchUsages = async (id, data, company) => {

}

/**
 * Thêm mới thông tin sử dụng
 */
exports.createUsage = async (id, data, company) => {

}

/**
 * Chỉnh sửa thông tin sử dụng
 */
exports.updateUsage = async (id, data, company) => {

}

/**
 * Xóa xóa thông tin sử dụng
 */
exports.deleteUsage = async (id, data, company) => {

}
const { Log } = require('../../../logs');
const arrayToTree = require('array-to-tree');
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
    if (params.code) {
        keySearch = { ...keySearch, code: { $regex: params.code, $options: "i" } }
    }

    // Bắt sựu kiện Tên tài sản tìm kiếm khác ""
    if (params.assetName) {
        keySearch = { ...keySearch, assetName: { $regex: params.assetName, $options: "i" } }
    }

    // Thêm key tìm kiếm tài sản theo trạng thái hoạt động vào keySearch
    if (params.status) {
        keySearch = { ...keySearch, status: { $in: params.status } };
    }

    // Thêm key tìm kiếm tài sản theo trạng thái hoạt động vào keySearch
    if (params.canRegisterForUse) {
        keySearch = { ...keySearch, canRegisterForUse: { $in: params.canRegisterForUse } };
    }

    // Thêm key tìm kiếm tài sản theo nhóm tài sản
    if (params.group) {
        keySearch = {...keySearch, group: {$in: params.group}};
    }

    // Lấy danh sách tài sản
    let totalList = await Asset.count(keySearch);
    let listAssets = await Asset.find(keySearch)
        .sort({ 'createdAt': 'desc' }).skip(params.page).limit(params.limit);

    return { data: listAssets, totalList }
}

/**
 * Danh sách mặt bằng dạng cây
 */
exports.getListBuildingAsTree = async (company) => {
    const list = await Asset.find({ company: company, group: "Building" });
    const dataConverted = list.map(building => {
        return {
            id: building._id.toString(),
            key: building._id.toString(),
            value: building._id.toString(),
            label: building.assetName,
            title: building.assetName,
            location: building.location ? building.location.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { list, tree };
}

/**
 * Function merge urlFile upload với object
 * @arrayFile : mảng chứa các file
 * @arrayObject :mảng chứa các object
 */
exports.mergeUrlFileToObject = (arrayFile, arrayObject) => {
    if (arrayFile) {
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

    let avatar = fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        file = fileInfo.file;
    let { maintainanceLogs, usageLogs, incidentLogs, locationLogs, files } = data;
    files = this.mergeUrlFileToObject(file, files);
    let createAsset = await Asset.create({
        company: company,
        avatar: avatar,
        assetName: data.assetName,
        code: data.code,
        serial: data.serial,
        group: data.group,
        assetType: data.assetType,
        purchaseDate: data.purchaseDate,
        warrantyExpirationDate: data.warrantyExpirationDate,
        managedBy: data.managedBy,
        assignedToUser: data.assignedToUser ? data.assignedToUser : null,
        assignedToOrganizationalUnit: data.assignedToOrganizationalUnit? data.assignedToOrganizationalUnit: null,

        location: data.location,
        status: data.status,
        canRegisterForUse: data.canRegisterForUse,
        description: data.description,
        detailInfo: data.detailInfo,

        // Khấu hao
        cost: data.cost,
        usefulLife: data.usefulLife,
        residualValue: data.residualValue,
        startDepreciation: data.startDepreciation,
        depreciationType: data.depreciationType,

        // Sửa chữa - bảo trì
        maintainanceLogs: maintainanceLogs,

        // Cấp phát - sử dụng
        usageLogs: usageLogs,

        // Sự cố tài sản
        incidentLogs: incidentLogs,

        // Lịch sử vị trí tài sản
        locationLogs: locationLogs,

        // Thông tin thanh lý
        disposalDate: data.disposalDate,
        disposalType: data.disposalType,
        disposalCost: data.disposalCost,
        disposalDesc: data.disposalDesc,

        // Tài liệu đính kèm
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
    let {
        createMaintainanceLogs, deleteMaintainanceLogs, editMaintainanceLogs,
        createUsageLogs, editUsageLogs, deleteUsageLogs,
        createIncidentLogs, editIncidentLogs, deleteIncidentLogs,
        createFiles, editFiles, deleteFiles
    } = data;
    let avatar = fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        file = fileInfo.file;
    let oldAsset = await Asset.findById(id);

    deleteEditCreateObjectInArrayObject = (arrObject, arrDelete, arrEdit, arrCreate, fileInfor = undefined) => {
        if (arrDelete) {
            for (let n in arrDelete) {
                arrObject = arrObject.filter(x => x._id.toString() !== arrDelete[n]._id);
            }
        }

        if (arrEdit) {
            if (fileInfor) {
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for (let n in arrEdit) {
                arrObject = arrObject.map(x => (x._id.toString() !== arrEdit[n]._id) ? x : arrEdit[n])
            }
        }

        if (arrCreate) {
            if (fileInfor) {
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach(x => arrObject.push(x));
        }

        return arrObject;
    }

    oldAsset.usageLogs = deleteEditCreateObjectInArrayObject(oldAsset.usageLogs, deleteUsageLogs, editUsageLogs, createUsageLogs);
    oldAsset.maintainanceLogs = deleteEditCreateObjectInArrayObject(oldAsset.maintainanceLogs, deleteMaintainanceLogs, editMaintainanceLogs, createMaintainanceLogs);
    oldAsset.incidentLogs = deleteEditCreateObjectInArrayObject(oldAsset.incidentLogs, deleteIncidentLogs, editIncidentLogs, createIncidentLogs);
    oldAsset.files = deleteEditCreateObjectInArrayObject(oldAsset.files, deleteFiles, editFiles, createFiles, file);

    oldAsset.avatar = avatar;
    oldAsset.assetName = data.assetName;
    oldAsset.code = data.code;
    oldAsset.serial = data.serial;
    oldAsset.assetType = data.assetType;
    oldAsset.group = data.group;
    oldAsset.purchaseDate = data.purchaseDate;
    oldAsset.warrantyExpirationDate = data.warrantyExpirationDate;
    oldAsset.managedBy = data.managedBy;
    oldAsset.assignedToUser = data.assignedToUser !== '' ? data.assignedToUser : null;
    oldAsset.assignedToOrganizationalUnit = data.assignedToOrganizationalUnit !== '' ? data.assignedToOrganizationalUnit : null;

    oldAsset.location = data.location;
    oldAsset.status = data.status;
    oldAsset.canRegisterForUse = data.canRegisterForUse;
    oldAsset.description = data.description;
    oldAsset.detailInfo = data.detailInfo;
    // Khấu hao
    oldAsset.cost = data.cost;
    oldAsset.usefulLife = data.usefulLife;
    oldAsset.residualValue = data.residualValue;
    oldAsset.startDepreciation = data.startDepreciation;
    oldAsset.depreciationType = data.depreciationType;
    oldAsset.estimatedTotalProduction = data.estimatedTotalProduction;
    oldAsset.unitsProducedDuringTheYears = data.unitsProducedDuringTheYears && data.unitsProducedDuringTheYears.map((x) => {
        let time = x.month.split("-");
        let date = new Date(time[1], time[0], 0)

        return ({
            month: date,
            unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
        })
    });
    // Thanh lý
    oldAsset.disposalDate = data.disposalDate;
    oldAsset.disposalType = data.disposalType;
    oldAsset.disposalCost = data.disposalCost;
    oldAsset.disposalDesc = data.disposalDesc;
    // Tài liệu tham khảo
    oldAsset.archivedRecordNumber = data.archivedRecordNumber;

    // Edit  thông tin tài sản
    oldAsset.save();

    // Function edit, create, Delete Document of collection
    queryEditCreateDeleteDocumentInCollection = async (assetId, company, collection, arrDelete, arrEdit, arrCreate) => {
        let queryDelete = arrDelete ? arrDelete.map(x => {
            return { deleteOne: { "filter": { "_id": x._id } } }
        }) : [];
        let queryEdit = arrEdit ? arrEdit.map(x => {
            return { updateOne: { "filter": { "_id": x._id }, "update": { $set: x } } }
        }) : [];
        let queryCrete = arrCreate ? arrCreate.map(x => {
            return { insertOne: { "document": { ...x, asset: assetId, company: company } } }
        }) : [];
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

/**
 * Chỉnh sửa thông tin khấu hao tài sản
 */
exports.updateDepreciation = async (id, data) => {
    return await Asset.update({ _id: id }, {
        cost: data.cost,
        residualValue: data.residualValue,
        usefulLife: data.usefulLife,
        startDepreciation: data.startDepreciation,
        depreciationType: data.depreciationType,
        estimatedTotalProduction: data.estimatedTotalProduction,
        unitsProducedDuringTheYears: data.unitsProducedDuringTheYears && data.unitsProducedDuringTheYears.map((x) => {
            let time = x.month.split("-");
            let date = new Date(time[1], time[0], 0)
                
            return ({
                month: date,
                unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
            })
        }),
    });
}


/*
 * Thêm mới phiếu bảo trì cho sự cố
 */
exports.createMaintainanceForIncident = async (id, incidentId, data) => {
    console.log(data, 'data-maintainance')
    return await Asset.update({ _id: data.assetId, "incidentLogs._id": incidentId }, {
        $addToSet: { maintainanceLogs: data },
        $set: {
            "incidentLogs.$.statusIncident": data.statusIncident,
        }
    });
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
exports.createMaintainance = async (id, data, incident_id) => {
    if (incident_id) {
        return await Asset.update({ _id: id, "incidentLogs._id": incident_id }, {
            $set: {
                "incidentLogs.$.statusIncident": "Đã xử lý"
            },
            $addToSet: { maintainanceLogs: data }
        });
    } else {
        return await Asset.update({ _id: id }, { $addToSet: { maintainanceLogs: data } });
    }
};

/**
 * Chỉnh sửa phiếu bảo trì
 */
exports.updateMaintainance = async (maintainanceId, data) => {
    return await Asset.update({ _id: data.assetId, "maintainanceLogs._id": maintainanceId }, {
        $set: {
            "maintainanceLogs.$.maintainanceCode": data.maintainanceCode,
            "maintainanceLogs.$.createDate": data.createDate,
            "maintainanceLogs.$.type": data.type,
            "maintainanceLogs.$.description": data.description,
            "maintainanceLogs.$.startDate": data.startDate,
            "maintainanceLogs.$.endDate": data.endDate,
            "maintainanceLogs.$.expense": data.expense,
            "maintainanceLogs.$.status": data.status,
        }
    })
}

/**
 * Xóa thông tin phiếu bảo trì
 */
exports.deleteMaintainance = async (assetId, maintainanceId) => {
    return await Asset.update({ _id: assetId }, { "$pull": { "maintainanceLogs": { "_id": maintainanceId } } });
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
exports.createUsage = async (id, data) => {
    await Asset.update({_id: id}, {
        $addToSet: {usageLogs: data},
        assignedToUser: data.assignedToUser ? data.assignedToUser : null,
        assignedToOrganizationalUnit: data.assignedToOrganizationalUnit? data.assignedToOrganizationalUnit: null,
        status: data.status
    });

    let asset = await Asset.findById(id);

    return asset;
}

/**
 * Chỉnh sửa thông tin sử dụng
 */
exports.updateUsage = async (usageId, data) => {
    return await Asset.update({ _id: data.assetId, "usageLogs._id": usageId }, {
        $set: {
            "usageLogs.$.usedByUser": data.usedByUser,
            "usageLogs.$.description": data.description,
            "usageLogs.$.endDate": data.endDate,
            "usageLogs.$.startDate": data.startDate
        }
    })
}

exports.recallAsset = async ( assetId , data) => {
    let nowDate= new Date();
    let asset = await Asset.findById(assetId);
    let usageLogs = asset.usageLogs[asset.usageLogs.length - 1];
    let updateUsageLogs = await Asset.update({_id: assetId, "usageLogs.usedByUser": usageLogs._id}, {
        $set: {
            "usageLogs.$.endDate": nowDate,
        }
    })
    let updateAsset = await Asset.update({_id: assetId},{
        $set: {
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "Sẵn sàng sử dụng",
        }
    })
    return updateAsset;
}
/**
 * Xóa thông tin sử dụng
 */
exports.deleteUsage = async (assetId, usageId) => {
    return await Asset.update({ _id: assetId }, { "$pull": { "usageLogs": { "_id": usageId } } });
}


/**
 * Thêm mới thông tin sự cố tài sản
 */
exports.createIncident = async (id, data) => {
    return await Asset.update({ _id: id }, {
        status: data.status,
        $addToSet: { incidentLogs: data }
    });
}

/**
 * Chỉnh sửa thông tin sự cố tài sản
 */
exports.updateIncident = async (incidentId, data) => {
    console.log(data, 'data-incident')
    return await Asset.update({ _id: data.assetId, "incidentLogs._id": incidentId }, {
        $set: {
            "incidentLogs.$.incidentCode": data.incidentCode,
            "incidentLogs.$.type": data.type,
            "incidentLogs.$.reportedBy": data.reportedBy,
            "incidentLogs.$.dateOfIncident": data.dateOfIncident,
            "incidentLogs.$.description": data.description,
            status: data.status
        }
    })
}

/**
 * Xóa thông tin sự cố tài sản
 */
exports.deleteIncident = async (assetId, incidentId) => {
    return await Asset.update({ _id: assetId }, { "$pull": { "incidentLogs": { "_id": incidentId } } });
}



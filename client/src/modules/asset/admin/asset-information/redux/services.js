import {sendRequest} from "../../../../../helpers/requestHelper";

export const AssetService = {
    getAll,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
    getAllAssetGroup,
    getAllAssetStatistic,
    getAllAssetPurchase,
    getAllAssetDisposal,
    getAllAssetIncident,
    getAllAssetMaintenance
};

/**
 * Lấy danh sách tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets`,
            method: "GET",
            params: {
                code: data ? data.code : data,
                assetName: data ? data.assetName : data,
                status: data ? data.status : data,
                group: data ? data.group : data,
                assetType: data ? data.assetType : data,
                purchaseDate: data ? data.purchaseDate : data,
                disposalDate: data ? data.disposalDate : data,
                handoverUnit: data ? data.handoverUnit : data,
                handoverUser: data ? data.handoverUser : data,
                typeRegisterForUse: data ? data.typeRegisterForUse : data,
                page: data ? data.page : data,
                limit: data ? data.limit : data,
                managedBy: data ? data.managedBy : data,
                location: data ? data.location : data,
                currentRole: data ? data.currentRole : data,

                startDepreciation: data ? data.startDepreciation : data,
                depreciationType: data ? data.depreciationType : data,

                maintainanceCode: data ? data.maintainanceCode : data,
                maintainCreateDate: data ? data.maintainCreateDate : data,
                maintainStatus: data ? data.maintainStatus : data,
                maintainType: data ? data.maintainType : data,

                incidentCode: data ? data.incidentCode : data,
                incidentStatus: data ? data.incidentStatus : data,
                incidentType: data ? data.incidentType : data,
                incidentDate: data ? data.incidentDate : data,

                // hình thức lấy danh sách tài sản (bình thường, tài sản có thông tin khấu hao, v.v.)
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}

/**
 * Lấy danh sách mặt bằng dạng cây
 */
function getListBuildingAsTree() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets`,
            method: "GET",
            params: {
                type: "get-building-as-tree",
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}

/**
 * Thêm mới thông tin tài sản
 * @param {*} data : dữ liệu thông tin tài sản cần tạo
 */
function addNewAsset(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets`,
            method: "POST",
            data: data,
        },
        true,
        true,
        "asset.asset_info"
    );
}

/**
 * Cập nhật thông tin tài sản theo id
 * @param {*} id : id thông tin tài sản cần chỉnh sửa
 * @param {*} data :dữ liệu chỉnh sửa thông tin tài sản
 */
function updateInformationAsset(id, data, isImport) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
            method: "PATCH",
            data,
            params: { 'isImport': isImport }
        },
        true,
        true,
        "asset.asset_info"
    );
}

/**
 * Xoá thông tin tài sản
 * @id : id thông tin tài sản cần xoá
 */

function deleteAsset(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets`,
            method: "DELETE",
            data: {
                assetIds: data?.assetIds
            }
        },
        true,
        true,
        "asset.asset_info"
    );
}

function getAllAssetGroup(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-group`,
            method: "GET",
            params: {

                assetName: data ? data.assetName : data,
                status: data ? data.status : data,
                group: data ? data.group : data,
                startDepreciation: data ? data.startDepreciation : data,
                depreciationType: data ? data.depreciationType : data,

                // hình thức lấy danh sách tài sản (bình thường, tài sản có thông tin khấu hao, v.v.)
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}
function getAllAssetStatistic(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-statistic`,
            method: "GET",
            params: {

                assetName: data ? data.assetName : data,
                status: data ? data.status : data,
                group: data ? data.group : data,
                startDepreciation: data ? data.startDepreciation : data,
                depreciationType: data ? data.depreciationType : data,
                // hình thức lấy danh sách tài sản (bình thường, tài sản có thông tin khấu hao, v.v.)
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}
function getAllAssetPurchase(data) {
    console.log(data)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-purchase`,
            method: "GET",
            params: {
                time : data,
                assetName: data ? data.assetName : data,
                purchaseDate: data ? data.purchaseDate : data,
                disposalDate: data ? data.disposalDate : data,
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}

function getAllAssetDisposal(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-disposal`,
            method: "GET",
            params: {
                time : data,
                assetName: data ? data.assetName : data,
                disposalDate: data ? data.disposalDate : data,
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}

function getAllAssetIncident(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-incident`,
            method: "GET",
            params: {
                time : data,
                assetName: data ? data.assetName : data,
                incidentCode: data ? data.incidentCode : data,
                incidentStatus: data ? data.incidentStatus : data,
                incidentType: data ? data.incidentType : data,
                incidentDate: data ? data.incidentDate : data,
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}

function getAllAssetMaintenance(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets-maintenance`,
            method: "GET",
            params: {
                time : data,
                assetName: data ? data.assetName : data,
                maintainanceCode: data ? data.maintainanceCode : data,
                maintainCreateDate: data ? data.maintainCreateDate : data,
                maintainStatus: data ? data.maintainStatus : data,
                maintainType: data ? data.maintainType : data,
                getType: data ? data.getType : undefined,
            },
        },
        false,
        true,
        "asset.asset_info"
    );
}
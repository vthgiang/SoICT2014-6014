import {sendRequest} from "../../../../../helpers/requestHelper";

export const AssetService = {
    getAll,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
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
function deleteAsset(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "asset.asset_info"
    );
}

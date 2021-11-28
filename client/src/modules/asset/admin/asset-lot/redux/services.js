import {sendRequest} from "../../../../../helpers/requestHelper";

export const AssetLotService = {
    getAllAssetLots,
};

/**
 * Lấy danh sách lô tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
 function getAllAssetLots(data) {
    console.log("res",data)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots`,
            method: "GET",
            params: {
                code: data ? data.code : data,
                assetLotName: data ? data.assetLotName : data,
                group: data ? data.group : data,
                assetType: data ? data.assetType : data,
                supplier: data ? data.supplier : data,
                page: data ? data.page : data,
                limit: data ? data.limit : data,
            },
        },
        false,
        true,
        'asset.asset_lot'
    );
}

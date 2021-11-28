import {AssetLotConstants} from "./constants";
import {AssetLotService} from "./services";

export const AssetLotManagerActions = {
    getAllAssetLot,
};

/**
 * Lấy danh sách lô tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
 function getAllAssetLot(data) {
    return (dispatch) => {
        dispatch({
            type: AssetLotConstants.GETALL_REQUEST,
        });
        AssetLotService.getAllAssetLots(data)
            .then((res) => {
                dispatch({
                    type: AssetLotConstants.GETALL_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetLotConstants.GETALL_FAILURE,
                    error: err,
                });
            });
    };
}

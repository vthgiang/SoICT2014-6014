import {AssetCrashConstants} from "./constants";
import {AssetCrashService} from "./services";
// import {AssetManagerActions} from "../../asset-manager/redux/actions";

export const AssetCrashActions = {
    searchAssetCrashs,
    // createNewDistributeTransfer,
    // deleteDistributeTransfer,
    // updateDistributeTransfer,
};

// Lấy danh sách nghỉ phép
function searchAssetCrashs(data) {

    return async (dispatch) => {
        try {
            const result = await AssetCrashService.searchAssetCrashs(data);

            dispatch({
                type: AssetCrashConstants.GET_ASSET_CRASH_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: AssetCrashConstants.GET_ASSET_CRASH_FAILURE,
                error: error.response.data
            });
        }
    };
}

// // Tạo mới thông tin nghỉ phép
// function createNewDistributeTransfer(data) {
//     return async dispatch => {
//         try {
//             dispatch({
//                 type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_REQUEST
//             });
//             const response = await DistributeTransferService.createNewDistributeTransfer(data).then(res => res);
//             dispatch(AssetManagerActions.getAllAsset({
//                 code: "",
//                 assetName: "",
//                 assetType: null,
//                 month: "",
//                 status: null,
//                 page: 0,
//                 limit: 5,
//             }));
//             dispatch(searchAssetCrashs({
//                 distributeNumber: "",
//                 code: "",
//                 month: "",
//                 type: null,
//                 page: 0,
//                 limit: 5
//             }));
//             dispatch({
//                 type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_SUCCESS,
//                 payload: response.data.content
//             });
//             return {
//                 response
//             }
//         } catch (err) {
//             dispatch({
//                 type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_FAILURE,
//                 error: err.response.data
//             });
//         }

//     }
// }

// // Xoá thông tin nghỉ phép của nhân viên
// function deleteDistributeTransfer(id) {
//     return dispatch => {
//         dispatch({
//             type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_REQUEST,
//         });
//         DistributeTransferService.deleteDistributeTransfer(id)
//             .then(res => {
//                 dispatch({
//                     type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_SUCCESS,
//                     payload: res.data.content
//                 })
//             })
//             .catch(err => {
//                 dispatch({
//                     type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_SUCCESS,
//                     error: err.response.data
//                 });
//             })
//     }
// }

// // cập nhật thông tin nghỉ phép của nhân viên
// function updateDistributeTransfer(id, infoDistributeTransfer) {
//     return async dispatch => {
//         try {
//             dispatch({
//                 type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_REQUEST
//             });
//             const response = await DistributeTransferService.updateDistributeTransfer(id, infoDistributeTransfer)
//             dispatch(searchAssetCrashs({
//                 distributeNumber: "",
//                 code: "",
//                 month: "",
//                 type: null,
//                 page: 0,
//                 limit: 5
//             }));
//             dispatch(AssetManagerActions.getAllAsset({
//                 code: "",
//                 assetName: "",
//                 assetType: null,
//                 month: "",
//                 status: null,
//                 page: 0,
//                 limit: 5
//             }));
//             dispatch({
//                 type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_SUCCESS,
//                 payload: response.data.content
//             });
//             return {
//                 response
//             }
//         } catch (err) {
//             dispatch({
//                 type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_FAILURE,
//                 error: err.response.data
//             });
//         }
//     }
// }

import {RecommendProcureConstants} from "./constants";
import {RecommendProcureService} from "./services";

export const RecommendProcureActions = {
    searchRecommendProcures,
    createRecommendProcure,
    deleteRecommendProcure,
    updateRecommendProcure,
};

// lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendProcures(data) {

    return dispatch => {
        dispatch({
            type: RecommendProcureConstants.GET_RECOMMEND_PROCURE_REQUEST
        });
        RecommendProcureService.searchRecommendProcures(data)
            .then(res => {
                dispatch({
                    type: RecommendProcureConstants.GET_RECOMMEND_PROCURE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendProcureConstants.GET_RECOMMEND_PROCURE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    return dispatch => {
        dispatch({
            type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_REQUEST
        });
        RecommendProcureService.createRecommendProcure(data)
            .then(res => {
                dispatch({
                    type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    return dispatch => {
        dispatch({
            type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_REQUEST,
        });
        RecommendProcureService.deleteRecommendProcure(id)
            .then(res => {
                dispatch({
                    type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, infoRecommendProcure) {
    return dispatch => {
        dispatch({
            type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_REQUEST
        });
        RecommendProcureService.updateRecommendProcure(id, infoRecommendProcure)
            .then(res => {
                dispatch({
                    type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

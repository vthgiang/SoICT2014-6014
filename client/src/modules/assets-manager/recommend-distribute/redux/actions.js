import {RecommendDistributeConstants} from "./constants";
import {RecommendDistributeService} from "./services";

export const RecommendDistributeActions = {
    searchRecommendDistributes,
    createRecommendDistribute,
    deleteRecommendDistribute,
    updateRecommendDistribute,
};

// lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {

    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_REQUEST
        });
        RecommendDistributeService.searchRecommendDistributes(data)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendDistribute(data) {
    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_REQUEST
        });
        RecommendDistributeService.createRecommendDistribute(data)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendDistribute(id) {
    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_REQUEST,
        });
        RecommendDistributeService.deleteRecommendDistribute(id)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, infoRecommendDistribute) {
    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST
        });
        RecommendDistributeService.updateRecommendDistribute(id, infoRecommendDistribute)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

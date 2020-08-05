import { RecommendDistributeConstants } from "./constants";
import { RecommendDistributeService } from "./services";
import { AssetManagerActions } from "../../asset-management/redux/actions";

export const RecommendDistributeActions = {
    searchRecommendDistributes,
    // createRecommendDistribute,
    deleteRecommendDistribute,
    updateRecommendDistribute,
};

// lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {

    return async (dispatch) => {
        try {
            const result = await RecommendDistributeService.searchRecommendDistributes(data);
            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_FAILURE,
                error: error.response.data
            });
        }
    };
}

// Xoá thông tin thông tin phiếu đăng ký sử dụng tài sản
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

// cập nhật thông tin phiếu đăng ký sử dụng
function updateRecommendDistribute(id, infoRecommendDistribute) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST
            });
            const response = await RecommendDistributeService.updateRecommendDistribute(id, infoRecommendDistribute)
            dispatch(searchRecommendDistributes({
                recommendNumber: "",
                month: "",
                status: "",
                page: 0,
                limit: 5,
            }));
            dispatch(AssetManagerActions.getAllAsset({
                code: "",
                assetName: "",
                month: "",
                type: null,
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_FAILURE,
                error: err.response.data
            });
        }
    }
}
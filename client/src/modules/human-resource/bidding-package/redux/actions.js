import {
    BiddingPackageConstant
} from "./constants";

import {
    BiddingPackageService
} from "./services";

export const BiddingPackageReduxAction = {
    getListBiddingPackage,
    createBiddingPackage,
    editBiddingPackage,
    deleteBiddingPackage,
};


// ===============GET===================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListBiddingPackage(data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstant.GET_BIDDING_PACKAGE_REQUEST
        });
        BiddingPackageService.getListBiddingPackage(data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstant.GET_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstant.GET_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    }
}

// ==================CREATE====================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function createBiddingPackage(data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstant.CREATE_BIDDING_PACKAGE_REQUEST
        });
        BiddingPackageService.createBiddingPackage(data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstant.CREATE_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstant.CREATE_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    }
}


// ==============EDIT===================

/**
 * Chỉnh sửa vị trí công việc
 * @data : Dữ liệu key tìm kiếm 
 */
function editBiddingPackage(data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_REQUEST
        });
        BiddingPackageService.editBiddingPackage(data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xóa vị trí
 * @data : Dữ liệu key tìm kiếm 
 */
function deleteBiddingPackage(data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstant.DELETE_BIDDING_PACKAGE_REQUEST,
        });
        BiddingPackageService.deleteBiddingPackage(data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstant.DELETE_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstant.DELETE_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    }
}
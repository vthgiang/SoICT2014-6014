import {
    BiddingPackageConstants
} from "./constants";
import {
    BiddingPackageService
} from "./services";

const FileDownload = require("js-file-download");

export const BiddingPackageManagerActions = {
    getAllBiddingPackage,
    addNewBiddingPackage,
    updateBiddingPackage,
    deleteBiddingPackage,
    getDetailBiddingPackage,
    getDetailEditBiddingPackage,
    downloadPackageDocument,
    proposeEmployeeForTask,
    // importBiddingPackages
};

/**
 * Lấy danh sách gói thầu
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllBiddingPackage(data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.GETALL_REQUEST,
            callId: data.callId,
        });
        BiddingPackageService.getAll(data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.GETALL_SUCCESS,
                    payload: res.data.content,
                    callId: data.callId,
                    // exportData: data ? data.exportData : data
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.GETALL_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy danh sách gói thầu
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getDetailBiddingPackage(id, data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.GET_DETAIL_REQUEST
        });
        BiddingPackageService.getDetailBiddingPackage(id, data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.GET_DETAIL_SUCCESS,
                    payload: res.data.content,
                    exportData: data ? data.exportData : data
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.GET_DETAIL_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy danh sách gói thầu
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getDetailEditBiddingPackage(id, data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.GET_DETAIL_REQUEST
        });
        BiddingPackageService.getDetailEditBiddingPackage(id, data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.GET_DETAIL_SUCCESS,
                    payload: res.data.content,
                    exportData: data ? data.exportData : data
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.GET_DETAIL_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Thêm mới thông tin gói thầu
 * @param {*} data : dữ liệu thông tin gói thầu cần tạo
 */
function addNewBiddingPackage(biddingPackage) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.ADD_BIDDING_PACKAGE_REQUEST
        });

        BiddingPackageService.addNewBiddingPackage(biddingPackage)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.ADD_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.ADD_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Cập nhật thông tin gói thầu theo id
 * @param {*} id 
 * @param {*} data 
 */
function updateBiddingPackage(id, data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_REQUEST
        });

        BiddingPackageService.updateBiddingPackage(id, data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.UPDATE_INFOR_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Xoá thông tin gói thầu
 * @id : id thông tin gói thầu cần xoá
 */
function deleteBiddingPackage(id, email) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.DELETE_BIDDING_PACKAGE_REQUEST
        });

        BiddingPackageService.deleteBiddingPackage(id)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.DELETE_BIDDING_PACKAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.DELETE_BIDDING_PACKAGE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tải file minh chứng nhân sự chủ chốt
 * @id : id gói thầu
 */

function downloadPackageDocument(id) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.DELETE_BIDDING_PACKAGE_REQUEST
        });

        BiddingPackageService.getBiddingPackageDocument(id)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.GET_DOCUMENT_SUCCESS,
                })
                const content = res.headers["content-type"];
                FileDownload(res.data, 'data', content);
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.GET_DOCUMENT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Import thông tin gói thầu
 * @data : dữ liệu thông tin gói thầu cần import
 */
// function importBiddingPackages(data) {
//     return dispatch => {
//         dispatch({
//             type: BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_REQUEST
//         });


//         BiddingPackageService.importBiddingPackages(data)
//             .then(res => {
//                 dispatch({
//                     type: BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_SUCCESS,
//                     payload: res.data.content
//                 })
//             })
//             .catch(err => {
//                 dispatch({
//                     type: BiddingPackageConstants.IMPORT_BIDDING_PACKAGE_FAILURE,
//                     error: err?.response?.data?.content
//                 });
//             })
//     }
// }

/**
 * Tải file minh chứng nhân sự chủ chốt
 * @id : id gói thầu
 */

function proposeEmployeeForTask(id, data) {
    return dispatch => {
        dispatch({
            type: BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_REQUEST
        });

        BiddingPackageService.proposeEmployeeForTask(id, data)
            .then(res => {
                dispatch({
                    type: BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingPackageConstants.PROPOSE_EMPLOYEE_FOR_TASK_FAILURE,
                    error: err
                });
            })
    }
}
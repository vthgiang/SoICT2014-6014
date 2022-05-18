import { dispatch } from "d3-dispatch";
import {
    BiddingContractConstant
} from "./constants";

import {
    BiddingContractService
} from "./services";

export const BiddingContractActions = {
    getListBiddingContract,
    createBiddingContract,
    editBiddingContract,
    deleteBiddingContract
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListBiddingContract(data) {
    return dispatch => {
        dispatch({
            type: BiddingContractConstant.GET_BIDDING_CONTRACT_REQUEST
        });
        BiddingContractService.getListBiddingContract(data)
            .then(res => {
                dispatch({
                    type: BiddingContractConstant.GET_BIDDING_CONTRACT_SUCCESS,
                    payload: res.data.content.listBiddingContract
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingContractConstant.GET_BIDDING_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo chuyên ngành tương đương mới
 * @data : Dữ liệu key tìm kiếm 
 */
function createBiddingContract(data) {
    return dispatch => {
        dispatch({
            type: BiddingContractConstant.CREATE_BIDDING_CONTRACT_REQUEST
        });
        BiddingContractService.createBiddingContract(data)
            .then(res => {
                dispatch({
                    type: BiddingContractConstant.CREATE_BIDDING_CONTRACT_SUCCESS,
                    payload: res.data.content.listBiddingContract
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingContractConstant.CREATE_BIDDING_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa chuyên ngành tương đương
 * @data : Dữ liệu key tìm kiếm 
 */
function editBiddingContract(data) {
    return dispatch => {
        dispatch({
            type: BiddingContractConstant.UPDATE_BIDDING_CONTRACT_REQUEST
        });
        BiddingContractService.editBiddingContract(data)
            .then(res => {
                dispatch({
                    type: BiddingContractConstant.UPDATE_BIDDING_CONTRACT_SUCCESS,
                    payload: res.data.content.listBiddingContract
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingContractConstant.UPDATE_BIDDING_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu key tìm kiếm 
 */
 function deleteBiddingContract(data) {
    return dispatch => {
        dispatch({
            type: BiddingContractConstant.DELETE_BIDDING_CONTRACT_REQUEST,
        });
        BiddingContractService.deleteBiddingContract(data)
            .then(res => {
                dispatch({
                    type: BiddingContractConstant.DELETE_BIDDING_CONTRACT_SUCCESS,
                    payload: res.data.content.listBiddingContract
                })
            })
            .catch(err => {
                dispatch({
                    type: BiddingContractConstant.DELETE_BIDDING_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}


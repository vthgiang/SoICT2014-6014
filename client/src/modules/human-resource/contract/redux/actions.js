import { dispatch } from "d3-dispatch";
import {
    ContractConstant
} from "./constants";

import {
    ContractService
} from "./services";

export const ContractActions = {
    getListContract,
    createContract,
    editContract,
    deleteContract
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListContract(data) {
    return dispatch => {
        dispatch({
            type: ContractConstant.GET_CONTRACT_REQUEST
        });
        ContractService.getListContract(data)
            .then(res => {
                dispatch({
                    type: ContractConstant.GET_CONTRACT_SUCCESS,
                    payload: res.data.content.listContract
                })
            })
            .catch(err => {
                dispatch({
                    type: ContractConstant.GET_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo chuyên ngành tương đương mới
 * @data : Dữ liệu key tìm kiếm 
 */
function createContract(data) {
    return dispatch => {
        dispatch({
            type: ContractConstant.CREATE_CONTRACT_REQUEST
        });
        ContractService.createContract(data)
            .then(res => {
                dispatch({
                    type: ContractConstant.CREATE_CONTRACT_SUCCESS,
                    payload: res.data.content.listContract
                })
            })
            .catch(err => {
                dispatch({
                    type: ContractConstant.CREATE_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa chuyên ngành tương đương
 * @data : Dữ liệu key tìm kiếm 
 */
function editContract(data) {
    return dispatch => {
        dispatch({
            type: ContractConstant.UPDATE_CONTRACT_REQUEST
        });
        ContractService.editContract(data)
            .then(res => {
                dispatch({
                    type: ContractConstant.UPDATE_CONTRACT_SUCCESS,
                    payload: res.data.content.listContract
                })
            })
            .catch(err => {
                dispatch({
                    type: ContractConstant.UPDATE_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu key tìm kiếm 
 */
 function deleteContract(data) {
    return dispatch => {
        dispatch({
            type: ContractConstant.DELETE_CONTRACT_REQUEST,
        });
        ContractService.deleteContract(data)
            .then(res => {
                dispatch({
                    type: ContractConstant.DELETE_CONTRACT_SUCCESS,
                    payload: res.data.content.listContract
                })
            })
            .catch(err => {
                dispatch({
                    type: ContractConstant.DELETE_CONTRACT_FAILURE,
                    error: err
                });
            })
    }
}


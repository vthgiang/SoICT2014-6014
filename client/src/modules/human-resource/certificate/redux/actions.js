import { dispatch } from "d3-dispatch";
import {
    CertificateConstant
} from "./constants";

import {
    CertificateService
} from "./services";

export const CertificateActions = {
    getListCertificate,
    createCertificate,
    editCertificate,
    deleteCertificate
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCertificate(data) {
    return dispatch => {
        dispatch({
            type: CertificateConstant.GET_CERTIFICATE_REQUEST
        });
        CertificateService.getListCertificate(data)
            .then(res => {
                dispatch({
                    type: CertificateConstant.GET_CERTIFICATE_SUCCESS,
                    payload: res.data.content.listCertificate
                })
            })
            .catch(err => {
                dispatch({
                    type: CertificateConstant.GET_CERTIFICATE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo chuyên ngành tương đương mới
 * @data : Dữ liệu key tìm kiếm 
 */
function createCertificate(data) {
    return dispatch => {
        dispatch({
            type: CertificateConstant.CREATE_CERTIFICATE_REQUEST
        });
        CertificateService.createCertificate(data)
            .then(res => {
                dispatch({
                    type: CertificateConstant.CREATE_CERTIFICATE_SUCCESS,
                    payload: res.data.content.listCertificate
                })
            })
            .catch(err => {
                dispatch({
                    type: CertificateConstant.CREATE_CERTIFICATE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa chuyên ngành tương đương
 * @data : Dữ liệu key tìm kiếm 
 */
function editCertificate(data) {
    return dispatch => {
        dispatch({
            type: CertificateConstant.UPDATE_CERTIFICATE_REQUEST
        });
        CertificateService.editCertificate(data)
            .then(res => {
                dispatch({
                    type: CertificateConstant.UPDATE_CERTIFICATE_SUCCESS,
                    payload: res.data.content.listCertificate
                })
            })
            .catch(err => {
                dispatch({
                    type: CertificateConstant.UPDATE_CERTIFICATE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu key tìm kiếm 
 */
 function deleteCertificate(data) {
    return dispatch => {
        dispatch({
            type: CertificateConstant.DELETE_CERTIFICATE_REQUEST,
        });
        CertificateService.deleteCertificate(data)
            .then(res => {
                dispatch({
                    type: CertificateConstant.DELETE_CERTIFICATE_SUCCESS,
                    payload: res.data.content.listCertificate
                })
            })
            .catch(err => {
                dispatch({
                    type: CertificateConstant.DELETE_CERTIFICATE_FAILURE,
                    error: err
                });
            })
    }
}


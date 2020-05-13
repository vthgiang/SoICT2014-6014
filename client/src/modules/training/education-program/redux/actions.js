import {
    EducationConstants
} from "./constants";
import {
    EducationService
} from "./services";
export const EducationActions = {
    getAll,
    getListEducation,
    createNewEducation,
    deleteEducation,
    updateEducation,
};

/**
 * Lấy danh sách tất cả các chương trình đào tạo bắt buộc
 */
function getAll() {
    return dispatch => {
        dispatch({
            type: EducationConstants.GET_LIST_ALL_EDUCATION_REQUEST
        });
        EducationService.getAll()
            .then(res => {
                dispatch({
                    type: EducationConstants.GET_LIST_ALL_EDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EducationConstants.GET_LIST_ALL_EDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Lấy danh sách các chương trình đào tạo theo key
 * @data : dữ liệu của Key
 */
function getListEducation(data) {
    return dispatch => {
        dispatch({
            type: EducationConstants.GET_LISTEDUCATION_REQUEST
        });

        EducationService.getListEducation(data)
            .then(res => {
                dispatch({
                    type: EducationConstants.GET_LISTEDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EducationConstants.GET_LISTEDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Tạo mới một chương trình đào tạo
 * @data : Dữ liệu chương trình đào tạo cần tạo
 */
function createNewEducation(data) {
    return dispatch => {
        dispatch({
            type: EducationConstants.CREATE_EDUCATION_REQUEST
        });
        EducationService.createNewEducation(data)
            .then(res => {
                dispatch({
                    type: EducationConstants.CREATE_EDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EducationConstants.CREATE_EDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}
/**
 * Xoá một chương trình đào tạo
 * @id : Id chương trình đào tạo cần xoá
 */
function deleteEducation(id) {
    return dispatch => {
        dispatch({
            type: EducationConstants.DELETE_EDUCATION_REQUEST
        });
        EducationService.deleteEducation(id)
            .then(res => {
                dispatch({
                    type: EducationConstants.DELETE_EDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EducationConstants.DELETE_EDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Cập nhật thông tin chương trình đào tạo
 * @id : Id chương trình đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa chương trình đào tạo
 */
function updateEducation(id, data) {
    return dispatch => {
        dispatch({
            type: EducationConstants.UPDATE_EDUCATION_REQUEST
        });

        EducationService.updateEducation(id, data)
            .then(res => {
                dispatch({
                    type: EducationConstants.UPDATE_EDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EducationConstants.UPDATE_EDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}
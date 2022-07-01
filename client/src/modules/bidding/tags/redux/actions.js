import { dispatch } from "d3-dispatch";
import {
    TagConstant
} from "./constants";

import {
    TagService
} from "./services";

export const TagActions = {
    getListTag,
    createTag,
    editTag,
    deleteTag
};

/**
 * Lấy danh sách tag
 * @data : Dữ liệu key tìm kiếm 
 */
function getListTag(data) {
    return dispatch => {
        dispatch({
            type: TagConstant.GET_TAG_REQUEST
        });
        TagService.getListTag(data)
            .then(res => {
                dispatch({
                    type: TagConstant.GET_TAG_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TagConstant.GET_TAG_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo tag  mới
 * @data : Dữ liệu key tìm kiếm 
 */
function createTag(data) {
    return dispatch => {
        dispatch({
            type: TagConstant.CREATE_TAG_REQUEST
        });
        TagService.createTag(data)
            .then(res => {
                dispatch({
                    type: TagConstant.CREATE_TAG_SUCCESS,
                    payload: res.data.content.listTag
                })
            })
            .catch(err => {
                dispatch({
                    type: TagConstant.CREATE_TAG_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa tag 
 * @data : Dữ liệu key tìm kiếm 
 */
function editTag(data) {
    return dispatch => {
        dispatch({
            type: TagConstant.UPDATE_TAG_REQUEST
        });
        TagService.editTag(data)
            .then(res => {
                dispatch({
                    type: TagConstant.UPDATE_TAG_SUCCESS,
                    payload: res.data.content.listTag
                })
            })
            .catch(err => {
                dispatch({
                    type: TagConstant.UPDATE_TAG_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xóa tag
 * @id : id tag
 */
function deleteTag(id) {
    return dispatch => {
        dispatch({
            type: TagConstant.DELETE_TAG_REQUEST,
        });
        TagService.deleteTag(id)
            .then(res => {
                dispatch({
                    type: TagConstant.DELETE_TAG_SUCCESS,
                    payload: res.data.content.listTag
                })
            })
            .catch(err => {
                dispatch({
                    type: TagConstant.DELETE_TAG_FAILURE,
                    error: err
                });
            })
    }
}


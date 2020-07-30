import {
    LinkServices
} from "./services";
import {
    LinkConstants
} from "./constants";

export const LinkActions = {
    get,
    show,
    create,
    edit,
    destroy,
};

/**
 * Lấy danh sách tất cả các link của 1 công ty
 */
function get(data) {
    if (data) {
        return dispatch => {
            dispatch({
                type: LinkConstants.GET_LINKS_PAGINATE_REQUEST
            });
            LinkServices.get(data)
                .then(res => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
        }
    }
    return dispatch => {
        dispatch({
            type: LinkConstants.GET_LINKS_REQUEST
        });
        LinkServices.get()
            .then(res => {
                dispatch({
                    type: LinkConstants.GET_LINKS_SUCCESS,
                    payload: res.data.content
                })
            })
    }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
function show(id) {
    return dispatch => {
        dispatch({
            type: LinkConstants.SHOW_LINK_REQUEST
        });
        LinkServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_SUCCESS,
                    payload: res.data.content
                })
            })
    }
}

/**
 * Tạo link mới
 * @link dữ liệu về link
 */
function create(link) {
    return dispatch => {
        dispatch({
            type: LinkConstants.CREATE_LINK_REQUEST
        });
        LinkServices
            .create(link)
            .then(res => {
                dispatch({
                    type: LinkConstants.CREATE_LINK_SUCCESS,
                    payload: res.data.content
                });
            })
    }
}

/**
 * Chỉnh sửa link
 * @id id link
 * @link dữ liệu về link
 */
function edit(id, link) {
    return dispatch => {
        dispatch({
            type: LinkConstants.EDIT_LINK_REQUEST
        });
        LinkServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.EDIT_LINK_SUCCESS,
                    payload: res.data.content
                })
            })
    }
}

/**
 * Xóa link
 * @id id link
 */
function destroy(id, link) {
    return dispatch => {
        dispatch({
            type: LinkConstants.DELETE_LINK_REQUEST
        });
        LinkServices.destroy(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.DELETE_LINK_SUCCESS,
                    payload: id
                })
            })
    }
}
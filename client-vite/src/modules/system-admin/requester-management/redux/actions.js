import { RequesterServices } from './services'
import { RequesterConstants } from './constants'

/**
 * Lấy danh sách tất cả các link của 1 công ty
 */
function get(params) {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.GET_REQUESTERS_PAGINATE_REQUEST
    })
    RequesterServices.get(params)
      .then((res) => {
        dispatch({
          type: RequesterConstants.GET_REQUESTERS_PAGINATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RequesterConstants.GET_REQUESTERS_PAGINATE_FAILE,
          payload: err
        })
      })
  }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
function show(id) {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.SHOW_REQUESTER_REQUEST
    })
    RequesterServices.show(id)
      .then((res) => {
        dispatch({
          type: RequesterConstants.SHOW_REQUESTER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RequesterConstants.SHOW_REQUESTER_FAILE,
          payload: err
        })
      })
  }
}

/**
 * Chỉnh sửa link
 * @id id link
 * @link dữ liệu về link
 */
function edit(id, link) {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.EDIT_REQUESTER_REQUEST
    })
    RequesterServices.edit(id, link)
      .then((res) => {
        dispatch({
          type: RequesterConstants.EDIT_REQUESTER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RequesterConstants.EDIT_REQUESTER_FAILE,
          payload: err
        })
      })
  }
}

export const RequesterActions = {
  get,
  show,
  edit
}

import { RequesterServices } from './services'
import { RequesterConstants } from './constants'

/**
 * Lấy danh sách các requester của 1 công ty, có paging, có search
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
 * Lấy danh sách tất cả các requesters của 1 công ty
 */
function getAll() {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.GET_REQUESTERS_REQUEST
    })
    RequesterServices.getAll()
      .then((res) => {
        dispatch({
          type: RequesterConstants.GET_REQUESTERS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RequesterConstants.GET_REQUESTERS_FAILE,
          payload: err
        })
      })
  }
}

/**
 * Lấy thông tin chi tiết của requester theo id
 * @id id requester
 */
function getById(id) {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.SHOW_REQUESTER_REQUEST
    })
    RequesterServices.getById(id)
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
 * Chỉnh sửa requester
 * @id id requester
 * @requester dữ liệu về requester
 */
function edit(id, requester) {
  return (dispatch) => {
    dispatch({
      type: RequesterConstants.EDIT_REQUESTER_REQUEST
    })
    RequesterServices.edit(id, requester)
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
  getAll,
  getById,
  edit
}

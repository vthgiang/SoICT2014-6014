import { ResourceServices } from './services'
import { ResourceConstants } from './constants'

/**
 * Lấy danh sách tất cả các link của 1 công ty
 */
function get(params) {
  return (dispatch) => {
    dispatch({
      type: ResourceConstants.GET_RESOURCES_PAGINATE_REQUEST
    })
    ResourceServices.get(params)
      .then((res) => {
        dispatch({
          type: ResourceConstants.GET_RESOURCES_PAGINATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ResourceConstants.GET_RESOURCES_PAGINATE_FAILE,
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
      type: ResourceConstants.GET_RESOURCE_BY_ID_REQUEST
    })
    ResourceServices.getById(id)
      .then((res) => {
        dispatch({
          type: ResourceConstants.GET_RESOURCE_BY_ID_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ResourceConstants.GET_RESOURCE_BY_ID_FAILE,
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
      type: ResourceConstants.EDIT_RESOURCE_REQUEST
    })
    ResourceServices.edit(id, link)
      .then((res) => {
        dispatch({
          type: ResourceConstants.EDIT_RESOURCE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ResourceConstants.EDIT_RESOURCE_FAILE,
          payload: err
        })
      })
  }
}

export const ResourceActions = {
  get,
  getById,
  edit
}

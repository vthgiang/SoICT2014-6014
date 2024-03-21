import { FieldsConstants } from './constants'

import { FieldsService } from './services'

export const FieldsActions = {
  getListFields,
  createFields,
  deleteFields,
  updateFields
}

/**
 * Lấy danh sách lĩnh vực/ngành nghề
 */
function getListFields(data) {
  return (dispatch) => {
    dispatch({
      type: FieldsConstants.GET_FIELDS_REQUEST
    })
    FieldsService.getListFields(data)
      .then((res) => {
        dispatch({
          type: FieldsConstants.GET_FIELDS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: FieldsConstants.GET_FIELDS_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Thêm mới thông tin lĩnh vực/ngành nghề
 * @param {*} data : Dữ liệu thông tin lĩnh vực/ngành nghề
 */
function createFields(data) {
  return (dispatch) => {
    dispatch({
      type: FieldsConstants.CREATE_FIELDS_REQUEST
    })
    FieldsService.createFields(data)
      .then((res) => {
        dispatch({
          type: FieldsConstants.CREATE_FIELDS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: FieldsConstants.CREATE_FIELDS_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Xoá thông tin lĩnh vực/ngành nghề
 * @param {*} id : Id thông tin lĩnh vực/ngành nghề cần xoá
 */
function deleteFields(id) {
  return (dispatch) => {
    dispatch({
      type: FieldsConstants.DELETE_FIELDS_REQUEST
    })

    FieldsService.deleteFields(id)
      .then((res) => {
        dispatch({
          type: FieldsConstants.DELETE_FIELDS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: FieldsConstants.DELETE_FIELDS_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Chỉnh sửa thông tin lĩnh vực/ngành nghề
 * @param {*} id : id thông tin lĩnh vực/ngành nghề cần chỉnh sửa
 * @param {*} data : dữ liệu chỉnh sửa thông tin lĩnh vực/ngành nghề
 */
function updateFields(id, infoWorkPlan) {
  return (dispatch) => {
    dispatch({
      type: FieldsConstants.UPDATE_FIELDS_REQUEST
    })

    FieldsService.updateFields(id, infoWorkPlan)
      .then((res) => {
        dispatch({
          type: FieldsConstants.UPDATE_FIELDS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: FieldsConstants.UPDATE_FIELDS_FAILURE,
          error: err
        })
      })
  }
}

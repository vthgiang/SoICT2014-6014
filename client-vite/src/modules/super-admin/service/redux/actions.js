import { ServiceServices } from './services'
import { ServiceConstants } from './constants'

/**
 * Lấy danh sách tất cả service trong 1 công ty
 */
function get(data) {
  if (data) {
    return (dispatch) => {
      dispatch({
        type: ServiceConstants.GET_SERVICES_PAGINATE_REQUEST
      })
      ServiceServices.get(data)
        .then((res) => {
          dispatch({
            type: ServiceConstants.GET_SERVICES_PAGINATE_SUCCESS,
            payload: res.data.content
          })
        })
        .catch(() => {
          dispatch({
            type: ServiceConstants.GET_SERVICES_PAGINATE_FAILE
          })
        })
    }
  }

  return (dispatch) => {
    dispatch({
      type: ServiceConstants.GET_SERVICES_REQUEST
    })
    ServiceServices.get()
      .then((res) => {
        dispatch({
          type: ServiceConstants.GET_SERVICES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ServiceConstants.GET_SERVICES_FAILE
        })
      })
  }
}

/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
function edit(id, data) {
  return (dispatch) => {
    dispatch({
      type: ServiceConstants.EDIT_SERVICE_REQUEST
    })
    ServiceServices.edit(id, data)
      .then((res) => {
        dispatch({
          type: ServiceConstants.EDIT_SERVICE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ServiceConstants.EDIT_SERVICE_FAILE
        })
      })
  }
}

/**
 * Tạo tài khoản cho service
 * @data dữ liệu về service
 */
function create(data) {
  return (dispatch) => {
    dispatch({
      type: ServiceConstants.CREATE_SERVICE_REQUEST
    })
    ServiceServices.create(data)
      .then((res) => {
        dispatch({
          type: ServiceConstants.CREATE_SERVICE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ServiceConstants.CREATE_SERVICE_FAILE
        })
      })
  }
}

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
function destroy(id) {
  return (dispatch) => {
    dispatch({
      type: ServiceConstants.DELETE_SERVICE_REQUEST
    })
    ServiceServices.destroy(id)
      .then(() => {
        dispatch({
          type: ServiceConstants.DELETE_SERVICE_SUCCESS,
          payload: id
        })
      })
      .catch(() => {
        dispatch({
          type: ServiceConstants.DELETE_SERVICE_FAILE
        })
      })
  }
}

function importServices(data, params) {
  return (dispatch) => {
    dispatch({
      type: ServiceConstants.IMPORT_SERVICES_REQUEST
    })
    ServiceServices.importServices(data, params)
      .then((res) => {
        dispatch({ type: ServiceConstants.IMPORT_SERVICES_SUCCESS, payload: res.data.content })
      })
      .catch(() => {
        dispatch({ type: ServiceConstants.IMPORT_SERVICES_FAILE })
      })
  }
}

function sendEmailResetPasswordService(email) {
  return (dispatch) => {
    dispatch({
      type: ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_REQUEST
    })
    ServiceServices.sendEmailResetPasswordService(email)
      .then((res) => {
        dispatch({ type: ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_SUCCESS, payload: res.data.content })
      })
      .catch(() => {
        dispatch({ type: ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_FAILE })
      })
  }
}

export const ServiceActions = {
  get,
  edit,
  create,
  destroy,
  importServices,
  sendEmailResetPasswordService
}

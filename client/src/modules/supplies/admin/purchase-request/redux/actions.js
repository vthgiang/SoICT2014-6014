import { PurchaseRequestConstants } from './constants'
import { PurchaseRequestService } from './services'

export const PurchaseRequestActions = {
  searchPurchaseRequests,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest,
  getUserApprover
}

// Lấy danh sách phiếu đề nghị mua sắm vật tư
function searchPurchaseRequests(data) {
  return async (dispatch) => {
    try {
      const result = await PurchaseRequestService.searchPurchaseRequests(data)

      dispatch({
        type: PurchaseRequestConstants.GET_PURCHASE_REQUEST_SUCCESS,
        payload: result.data.content
      })
    } catch (error) {
      dispatch({
        type: PurchaseRequestConstants.GET_PURCHASE_REQUEST_FAILURE,
        error: error.response.data
      })
    }
  }
}

function getUserApprover() {
  return async (dispatch) => {
    try {
      const result = await PurchaseRequestService.getUserApprover()

      dispatch({
        type: PurchaseRequestConstants.GET_USER_APPROVER_SUCCESS,
        payload: result.data.content
      })
    } catch (error) {
      dispatch({
        type: PurchaseRequestConstants.GET_USER_APPROVER_FAILURE,
        error: error.response.data
      })
    }
  }
}
// Tạo mới thông tin phiếu đề nghị mua sắm vật tư
function createPurchaseRequest(data) {
  return async (dispatch) => {
    try {
      dispatch({
        type: PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_REQUEST
      })
      const response = await PurchaseRequestService.createPurchaseRequest(data).then((res) => res)
      dispatch(
        searchPurchaseRequests({
          recommendNumber: '',
          month: '',
          status: '',
          page: 0,
          limit: 5
        })
      )
      dispatch({
        type: PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_SUCCESS,
        payload: response.data.content
      })
      return {
        response
      }
    } catch (err) {
      dispatch({
        type: PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_FAILURE,
        error: err.response.data
      })
    }
  }
}

// Cập nhật thông tin phiếu đề nghị mua sắm vật tư
function updatePurchaseRequest(id, infoPurchaseRequest) {
  return async (dispatch) => {
    try {
      dispatch({
        type: PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_REQUEST
      })
      const response = await PurchaseRequestService.updatePurchaseRequest(id, infoPurchaseRequest)
      dispatch(
        searchPurchaseRequests({
          recommendNumber: '',
          month: '',
          status: '',
          page: 0,
          limit: 5
        })
      )
      dispatch({
        type: PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_SUCCESS,
        payload: response.data.content
      })
      return {
        response
      }
    } catch (err) {
      dispatch({
        type: PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_FAILURE,
        error: err.response.data
      })
    }
  }
}

// Xoá thông tin thông tin phiếu đề nghị mua sắm vật tư
function deletePurchaseRequest(id) {
  return (dispatch) => {
    dispatch({
      type: PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_REQUEST
    })
    PurchaseRequestService.deletePurchaseRequest(id)
      .then((res) => {
        dispatch({
          type: PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_SUCCESS,
          error: err.response.data
        })
      })
  }
}

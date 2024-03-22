import { DiscountConstants } from './constants'
import { DiscountServices } from './services'

export const DiscountActions = {
  createNewDiscount,
  getAllDiscounts,
  editDiscount,
  changeDiscountStatus,
  deleteDiscountByCode,
  getDiscountForOrderValue
}

function createNewDiscount(data) {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.CREATE_DISCOUNT_REQUEST
    })

    DiscountServices.createNewDiscount(data)
      .then((res) => {
        dispatch({
          type: DiscountConstants.CREATE_DISCOUNT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.CREATE_DISCOUNT_FAILURE,
          error
        })
      })
  }
}

function getAllDiscounts(queryData) {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.GET_ALL_DISCOUNTS_REQUEST
    })

    DiscountServices.getAllDiscounts(queryData)
      .then((res) => {
        dispatch({
          type: DiscountConstants.GET_ALL_DISCOUNTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.GET_DETAIL_DISCOUNT_FAILURE,
          error
        })
      })
  }
}

function editDiscount(id, data) {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.EDIT_DISCOUNT_REQUEST
    })

    DiscountServices.editDiscount(id, data)
      .then((res) => {
        dispatch({
          type: DiscountConstants.EDIT_DISCOUNT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.EDIT_DISCOUNT_FAILURE,
          error
        })
      })
  }
}

function changeDiscountStatus(id) {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.CHANGE_DISCOUNT_STATUS_REQUEST
    })

    DiscountServices.changeDiscountStatus(id)
      .then((res) => {
        dispatch({
          type: DiscountConstants.CHANGE_DISCOUNT_STATUS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.CHANGE_DISCOUNT_STATUS_FAILURE,
          error
        })
      })
  }
}

function deleteDiscountByCode(code) {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.DELETE_DISCOUNT_REQUEST
    })

    DiscountServices.deleteDiscountByCode(code)
      .then((res) => {
        dispatch({
          type: DiscountConstants.DELETE_DISCOUNT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.DELETE_DISCOUNT_FAILURE,
          error
        })
      })
  }
}

function getDiscountForOrderValue() {
  return (dispatch) => {
    dispatch({
      type: DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_REQUEST
    })

    DiscountServices.getDiscountForOrderValue()
      .then((res) => {
        dispatch({
          type: DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_FAILURE,
          error
        })
      })
  }
}

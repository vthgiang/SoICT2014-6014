import { OrderConstants } from './constants'
import * as OrderServices from './services'

const getAdressFromLatLng = (lat, lng) => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.GET_ADDRESS_FROM_LAT_LNG_REQUEST })
    OrderServices.getAddressFromLatLng(lat, lng)
      .then((res) => {
        dispatch({
          type: OrderConstants.GET_ADDRESS_FROM_LAT_LNG_SUCCESS,
          payload: res.data.display_name
        })
      })
      .catch((err) => {
        dispatch({ type: OrderConstants.GET_ADDRESS_FROM_LAT_LNG_FAILURE })
      })
  }
}

const createNewOrder = (data) => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.CREATE_ORDER_REQUEST })
    OrderServices.createNewOrder(data)
      .then((res) => {
        dispatch({
          type: OrderConstants.CREATE_ORDER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: OrderConstants.CREATE_ORDER_FAILURE })
      })
  }
}

const getAllOrder = (query) => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.GET_ALL_ORDER_REQUEST })
    OrderServices.getAllOrder(query)
      .then((res) => {
        dispatch({
          type: OrderConstants.GET_ALL_ORDER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: OrderConstants.GET_ALL_ORDER_FAILURE })
      })
  }
}

const retrainingModel = () => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.RETRAINING_MODEL_REQUEST })
    OrderServices.retrainingModel()
      .then((response) => {
        dispatch({
          type: OrderConstants.RETRAINING_MODEL_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: OrderConstants.RETRAINING_MODEL_FAILURE
        })
      })
  }
}

const approveOrder = (id) => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.APPROVE_ORDER_REQUEST })
    OrderServices.approveOrder(id)
      .then((res) => {
        dispatch({
          type: OrderConstants.APPROVE_ORDER_SUCCESS
        })
      })
      .catch((err) => {
        dispatch({ type: OrderConstants.APPROVE_ORDER_FAILURE })
      })
  }
}

const deleteOrder = (id) => {
  return (dispatch) => {
    dispatch({ type: OrderConstants.DELETE_ORDER_REQUEST })
    OrderServices.deleteOrder(id)
      .then((res) => {
        dispatch({
          type: OrderConstants.DELETE_ORDER_SUCCESS
        })
      })
      .catch((err) => {
        dispatch({ type: OrderConstants.DELETE_ORDER_FAILURE })
      })
  }
}
export const OrderActions = {
  getAdressFromLatLng,
  createNewOrder,
  getAllOrder,
  retrainingModel,
  approveOrder,
  deleteOrder
}

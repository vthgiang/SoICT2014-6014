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
export const OrderActions = {
  getAdressFromLatLng,
  createNewOrder,
  getAllOrder
}

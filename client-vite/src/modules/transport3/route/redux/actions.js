import { routeConstants } from './constants'
import * as routeServices from './services'

const getAllVehicleTransporting = (queryData) => {
  return (dispatch) => {
    dispatch({
      type: routeConstants.GET_ALL_VEHICLE_TRANSPORTING_REQUEST
    })

    routeServices
      .getAllVehicleTransporting(queryData)
      .then((res) => {
        dispatch({
          type: routeConstants.GET_ALL_VEHICLE_TRANSPORTING_SUCCESS,
          payload: res.data
        })
      })
      .catch((error) => {
        dispatch({
          type: routeConstants.GET_ALL_VEHICLE_TRANSPORTING_FAILURE,
          error
        })
      })
  }
}

const getAllOrderTransporting = (queryData) => {
  return (dispatch) => {
    dispatch({
      type: routeConstants.GET_ALL_ORDER_TRANSPORTING_REQUEST
    })

    routeServices
      .getAllOrderTransporting(queryData)
      .then((res) => {
        dispatch({
          type: routeConstants.GET_ALL_ORDER_TRANSPORTING_SUCCESS,
          payload: res.data
        })
      })
      .catch((error) => {
        dispatch({
          type: routeConstants.GET_ALL_ORDER_TRANSPORTING_FAILURE,
          error
        })
      })
  }
}
export const RouteActions = {
  getAllVehicleTransporting,
  getAllOrderTransporting
}

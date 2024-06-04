import { vehicleConstants } from './constants'
import * as vehicleServices from './services'

function getAllVehicle(queryData) {
  return (dispatch) => {
    dispatch({
      type: vehicleConstants.GET_ALL_VEHICLE_REQUEST
    })

    vehicleServices
      .getAllVehicle(queryData)
      .then((res) => {
        dispatch({
          type: vehicleConstants.GET_ALL_VEHICLE_SUCCESS,
          payload: res.data
        })
      })
      .catch((error) => {
        dispatch({
          type: vehicleConstants.GET_ALL_VEHICLE_FAILURE,
          error
        })
      })
  }
}

export const vehicleActions = {
  getAllVehicle
}

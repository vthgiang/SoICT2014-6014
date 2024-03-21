import { transportVehicleConstants } from './constants'
import { transportVehicleServices } from './services'

export const transportVehicleActions = {
  createTransportVehicle,
  getAllTransportVehicles,
  createTransportPlanVehicleNotDuplicate,
  editTransportVehicle
}

function getAllTransportVehicles(queryData) {
  return (dispatch) => {
    dispatch({
      type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_REQUEST
    })

    transportVehicleServices
      .getAllTransportVehicles(queryData)
      .then((res) => {
        dispatch({
          type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_FAILURE,
          error
        })
      })
  }
}

function createTransportVehicle(data) {
  return (dispatch) => {
    dispatch({
      type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST
    })
    transportVehicleServices
      .createTransportVehicle(data)
      .then((res) => {
        dispatch({
          type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_FAILURE,
          error
        })
      })
  }
}

/**
 * Cập nhật trường transportPlan, nếu chưa có xe -> tạo xe
 * @param {*} id id của xe, tương đương asset
 * @param {*} data
 * @returns
 */
function createTransportPlanVehicleNotDuplicate(id, data) {
  return (dispatch) => {
    dispatch({
      type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST
    })
    transportVehicleServices
      .createTransportPlanVehicleNotDuplicate(id, data)
      .then((res) => {
        dispatch({
          type: transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_FAILURE,
          error
        })
      })
  }
}

function editTransportVehicle(id, data) {
  return (dispatch) => {
    dispatch({
      type: transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_REQUEST
    })
    transportVehicleServices
      .editTransportVehicle(id, data)
      .then((res) => {
        dispatch({
          type: transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_FAILURE,
          error
        })
      })
  }
}

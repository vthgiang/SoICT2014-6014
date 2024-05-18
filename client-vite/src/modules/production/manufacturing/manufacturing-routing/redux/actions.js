import { manufacturingRoutingConstants } from "./constants";
import { manufacturingRoutingServices } from "./services"

export const manufacturingRoutingActions = {
  getAllManufacturingRoutings,
  getDetailManufacturingRouting,
  createManufacturingRouting,
  getAllManufacturingRoutingsByGood
}

function getAllManufacturingRoutings(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_REQUEST
    })
    manufacturingRoutingServices
      .getAllManufacturingRoutings(query)
      .then((res) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_FAILURE,
          error
        })
      })
  }
}

function getDetailManufacturingRouting(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingRoutingConstants.GET_DETAIL_MANUFACTURING_ROUTING_REQUEST
    })
    manufacturingRoutingServices
      .getDetailManufacturingRouting(query)
      .then((res) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_DETAIL_MANUFACTURING_ROUTING_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_DETAIL_MANUFACTURING_ROUTING_FAILURE,
          error
        })
      })
  }
}

function createManufacturingRouting(data) {
  return (dispatch) => {
    dispatch({
      type: manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_REQUEST
  })
  manufacturingRoutingServices
    .createManufacturingRouting(data)
    .then((res) => {
      dispatch({
        type: manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_SUCCESS,
        payload: res.data.content
      })
    })
    .catch((error) => {
      dispatch({
        type: manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_FAILURE,
        error
      })
    })
  }
}

function getAllManufacturingRoutingsByGood(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_REQUEST
    })
    manufacturingRoutingServices
      .getAllManufacturingRoutingsByGood(query)
      .then((res) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_FAILURE,
          error
        })
      })
  }
}


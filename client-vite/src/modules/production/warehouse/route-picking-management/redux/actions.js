import { RoutePickingConstants } from './constants'
import { RoutePickingServices } from './services'

export const RoutePickingActions = {
  getAllChemins,
  getChemin,
  createRoutePicking
  // deleteExamples,
  // createExample,
  // editExample
}

function getAllChemins(queryData) {
  return (dispatch) => {
    dispatch({
      type: RoutePickingConstants.GET_ALL_ROUTES_REQUEST
    })
    RoutePickingServices.getAllChemins(queryData)
      .then((res) => {
        dispatch({
          type: RoutePickingConstants.GET_ALL_ROUTES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: RoutePickingConstants.GET_ALL_ROUTES_FAILURE,
          error
        })
      })
  }
}

function getChemin(id) {
  return (dispatch) => {
    dispatch({
      type: RoutePickingConstants.GET_DETAIL_ROUTE_REQUEST
    })
    RoutePickingServices.getChemin(id)
      .then((res) => {
        dispatch({
          type: RoutePickingConstants.GET_DETAIL_ROUTE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RoutePickingConstants.GET_DETAIL_ROUTE_FAILURE,
          error: err
        })
      })
  }
}

function createRoutePicking(data) {
  // console.log(data)
  return (dispatch) => {
    dispatch({
      type: RoutePickingConstants.CREATE_ROUTE_REQUEST
    })
    RoutePickingServices.createRoutePicking(data)
      .then((res) => {
        dispatch({
          type: RoutePickingConstants.CREATE_ROUTE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        // console.log("error:", error)
        dispatch({
          type: RoutePickingConstants.CREATE_ROUTE_FAILURE,
          error
        })
      })
  }
}
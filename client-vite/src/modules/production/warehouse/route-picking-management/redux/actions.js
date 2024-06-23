import { RoutePickingConstants } from './constants'
import { RoutePickingServices } from './services'

export const RoutePickingActions = {
  getAllChemins,
  getChemin
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

// function deleteExamples(data) {
//   return (dispatch) => {
//     dispatch({
//       type: exampleConstants.DELETE_EXAMPLE_REQUEST
//     })

//     exampleServices
//       .deleteExamples(data)
//       .then((res) => {
//         dispatch({
//           type: exampleConstants.DELETE_EXAMPLE_SUCCESS,
//           payload: res.data.content,
//           exampleIds: data.exampleIds
//         })
//       })
//       .catch((error) => {
//         dispatch({
//           type: exampleConstants.DELETE_EXAMPLE_FAILURE,
//           error
//         })
//       })
//   }
// }

// function createExample(data) {
//   return (dispatch) => {
//     dispatch({
//       type: exampleConstants.CREATE_EXAMPLE_REQUEST
//     })
//     exampleServices
//       .createExample(data)
//       .then((res) => {
//         dispatch({
//           type: exampleConstants.CREATE_EXAMPLE_SUCCESS,
//           payload: res.data.content
//         })
//       })
//       .catch((error) => {
//         dispatch({
//           type: exampleConstants.CREATE_EXAMPLE_FAILURE,
//           error
//         })
//       })
//   }
// }

// function editExample(id, data) {
//   return (dispatch) => {
//     dispatch({
//       type: exampleConstants.EDIT_EXAMPLE_REQUEST
//     })
//     exampleServices
//       .editExample(id, data)
//       .then((res) => {
//         dispatch({
//           type: exampleConstants.EDIT_EXAMPLE_SUCCESS,
//           payload: res.data.content
//         })
//       })
//       .catch((error) => {
//         dispatch({
//           type: exampleConstants.EDIT_EXAMPLE_FAILURE,
//           error
//         })
//       })
//   }
// }

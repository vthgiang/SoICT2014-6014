import { SuppliesConstants } from './constants'
import { SuppliesService } from './services'

export const SuppliesActions = {
  searchSupplies,
  createSupplies,
  updateSupplies,
  deleteSupplies,
  getSuppliesById
}

function searchSupplies(data) {
  return (dispatch) => {
    dispatch({
      type: SuppliesConstants.SEARCH_SUPPLIES_REQUEST
    })
    SuppliesService.searchSupplies(data)
      .then((res) => {
        dispatch({
          type: SuppliesConstants.SEARCH_SUPPLIES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: SuppliesConstants.SEARCH_SUPPLIES_FAILURE,
          error: err
        })
      })
  }
}

function createSupplies(data) {
  return (dispatch) => {
    // tao moi
    dispatch({
      type: SuppliesConstants.CREATE_SUPPLIES_REQUEST
    })
    //
    SuppliesService.createSupplies(data)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: SuppliesConstants.CREATE_SUPPLIES_SUCCESS,
            payload: res.data.content
          })
        }
      })
      .catch((err) => {
        dispatch({
          type: SuppliesConstants.CREATE_SUPPLIES_FAILURE,
          error: err,
          payload: err.response.data.content
        })
      })
  }
}

function updateSupplies(id, data) {
  return (dispatch) => {
    dispatch({
      type: SuppliesConstants.UPDATE_SUPPLIES_REQUEST
    })
    SuppliesService.updateSupplies(id, data)
      .then((res) => {
        dispatch({
          type: SuppliesConstants.UPDATE_SUPPLIES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: SuppliesConstants.UPDATE_SUPPLIES_FAILURE,
          error: err
        })
      })
  }
}

function deleteSupplies(data) {
  return (dispatch) => {
    dispatch({
      type: SuppliesConstants.DELETE_SUPPLIES_REQUEST
    })
    SuppliesService.deleteSupplies(data)
      .then((res) => {
        dispatch({
          type: SuppliesConstants.DELETE_SUPPLIES_SUCCESS,
          payload: res.data.content,
          ids: data.ids
        })
      })
      .catch((err) => {
        dispatch({
          type: SuppliesConstants.DELETE_SUPPLIES_FAILURE,
          error: err
        })
      })
  }
}

function getSuppliesById(id) {
  return (dispatch) => {
    dispatch({
      type: SuppliesConstants.GET_SUPPLIES_BY_ID_REQUEST
    })
    SuppliesService.getSuppliesById(id)
      .then((res) => {
        dispatch({
          type: SuppliesConstants.GET_SUPPLIES_BY_ID_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: SuppliesConstants.GET_SUPPLIES_BY_ID_FAILURE,
          error: err
        })
      })
  }
}

import { dispatch } from 'd3-dispatch'
import { CapacityConstant } from './constants'
import { CapacityService } from './services'

/**
 * Lấy danh sách tag
 * @data : Dữ liệu key tìm kiếm
 */

function getListCapacity(data) {
  return (dispatch) => {
    dispatch({
      type: CapacityConstant.GET_CAPACITY_LIST_REQUEST
    })
    CapacityService.getListCapacity(data)
      .then((res) => {
        dispatch({
          type: CapacityConstant.GET_CAPACITY_LIST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CapacityConstant.GET_CAPACITY_LIST_FAILURE,
          error: err
        })
      })
  }
}

function addNewCapacity(data = undefined) {
  return (dispatch) => {
    dispatch({
      type: CapacityConstant.ADD_CAPACITY_REQUEST
    })
    CapacityService.addNewCapacity(data)
      .then((res) => {
        dispatch({
          type: CapacityConstant.ADD_CAPACITY_SUCCESS,
          payload: res?.data?.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CapacityConstant.ADD_CAPACITY_FAILURE,
          error: err
        })
      })
  }
}

function editCapacity(id, data) {
  return (dispatch) => {
    dispatch({
      type: CapacityConstant.EDIT_CAPACITY_REQUEST
    })
    CapacityService.editCapacity(id, data) 
      .then((res) => {
        dispatch({
          type: CapacityConstant.EDIT_CAPACITY_SUCCESS,
          payload: res?.data?.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CapacityConstant.EDIT_CAPACITY_FAILURE,
          error: err
        })
      })
  }
}

function deleteCapacity(id) {
  return (dispatch) => {
    dispatch({
      type: CapacityConstant.DELETE_CAPACITY_REQUEST
    })
    CapacityService.deleteCapacity(id)
      .then((res) => {
        dispatch({
          type: CapacityConstant.DELETE_CAPACITY_SUCCESS,
          payload: res?.data?.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CapacityConstant.DELETE_CAPACITY_FAILURE,
          error: err
        })
      })
  }
}

export const CapacityActions = {
  getListCapacity,
  addNewCapacity,
  editCapacity,
  deleteCapacity
}

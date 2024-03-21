import { dispatch } from 'd3-dispatch'
import { MajorConstant } from './constants'

import { MajorService } from './services'

export const MajorActions = {
  getListMajor,
  createMajor,
  editMajor,
  deleteMajor
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm
 */
function getListMajor(data) {
  return (dispatch) => {
    dispatch({
      type: MajorConstant.GET_MAJOR_REQUEST
    })
    MajorService.getListMajor(data)
      .then((res) => {
        dispatch({
          type: MajorConstant.GET_MAJOR_SUCCESS,
          payload: res.data.content.listMajor
        })
      })
      .catch((err) => {
        dispatch({
          type: MajorConstant.GET_MAJOR_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Tạo chuyên ngành tương đương mới
 * @data : Dữ liệu key tìm kiếm
 */
function createMajor(data) {
  return (dispatch) => {
    dispatch({
      type: MajorConstant.CREATE_MAJOR_REQUEST
    })
    MajorService.createMajor(data)
      .then((res) => {
        dispatch({
          type: MajorConstant.CREATE_MAJOR_SUCCESS,
          payload: res.data.content.listMajor
        })
      })
      .catch((err) => {
        dispatch({
          type: MajorConstant.CREATE_MAJOR_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Chỉnh sửa chuyên ngành tương đương
 * @data : Dữ liệu key tìm kiếm
 */
function editMajor(data) {
  return (dispatch) => {
    dispatch({
      type: MajorConstant.UPDATE_MAJOR_REQUEST
    })
    MajorService.editMajor(data)
      .then((res) => {
        dispatch({
          type: MajorConstant.UPDATE_MAJOR_SUCCESS,
          payload: res.data.content.listMajor
        })
      })
      .catch((err) => {
        dispatch({
          type: MajorConstant.UPDATE_MAJOR_FAILURE,
          error: err
        })
      })
  }
}

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu key tìm kiếm
 */
function deleteMajor(data) {
  return (dispatch) => {
    dispatch({
      type: MajorConstant.DELETE_MAJOR_REQUEST
    })
    MajorService.deleteMajor(data)
      .then((res) => {
        dispatch({
          type: MajorConstant.DELETE_MAJOR_SUCCESS,
          payload: res.data.content.listMajor
        })
      })
      .catch((err) => {
        dispatch({
          type: MajorConstant.DELETE_MAJOR_FAILURE,
          error: err
        })
      })
  }
}

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

export const CapacityActions = {
  getListCapacity
}

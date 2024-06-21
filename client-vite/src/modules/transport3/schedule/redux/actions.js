import { ScheduleConstants } from './constants'
import * as ScheduleServices from './services'

const getAllSchedule = () => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_SCHEDULE_REQUEST })
    try {
      const res = await ScheduleServices.getAllSchedule()
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_SUCCESS, payload: res.data })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_FAILURE })
    }
  }
}

const getAllStocksWithLatlng = () => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_REQUEST })
    try {
      const res = await ScheduleServices.getAllStocksWithLatlng()
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_SUCCESS, payload: res.data })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_FAILURE })
    }
  }
}

export const ScheduleActions = {
  getAllSchedule,
  getAllStocksWithLatlng
}

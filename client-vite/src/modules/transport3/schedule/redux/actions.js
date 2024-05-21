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

const getNearestDepot = (lat, lng) => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_NEAREST_DEPOT_REQUEST })
    try {
      const res = await ScheduleServices.getNearestDepot(lat, lng)
      dispatch({ type: ScheduleConstants.GET_NEAREST_DEPOT_SUCCESS, payload: res.data })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_NEAREST_DEPOT_FAILURE })
    }
  }
}

export const ScheduleActions = {
  getAllSchedule,
  getNearestDepot
}

import { ScheduleConstants } from './constants'
import { schedule } from './reducers'
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
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_SUCCESS, payload: res.data.content })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_FAILURE })
    }
  }
}

const createSchedule = (data) => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.CREATE_SCHEDULE_REQUEST })
    try {
      const res = await ScheduleServices.createSchedule(data)
      dispatch({ type: ScheduleConstants.CREATE_SCHEDULE_SUCCESS })
      return res
    } catch (error) {
      dispatch({ type: ScheduleConstants.CREATE_SCHEDULE_FAILURE })
    }
  }
}

const autoSchedule = (data) => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.AUTO_SCHEDULE_REQUEST })
    try {
      // const res = await ScheduleServices.autoSchedule(data)
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
      dispatch({ type: ScheduleConstants.AUTO_SCHEDULE_SUCCESS, payload: null })
    } catch (error) {
      dispatch({ type: ScheduleConstants.AUTO_SCHEDULE_FAILURE })
    }
  }
}

const predictOntimeDelivery = (scheduleId) => {
  return (dispatch) => {
    dispatch({ type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_REQUEST })
  ScheduleServices.predictOntimeDelivery(scheduleId)
    .then((response) => {
      dispatch({
        type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_SUCCESS,
        payload: response.data.content
      })
    })
    .catch(() => {
      dispatch({
        type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_FAILURE
      })
    })
}
}
export const ScheduleActions = {
  getAllSchedule,
  getAllStocksWithLatlng,
  createSchedule,
  autoSchedule,
  predictOntimeDelivery
}

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

const getScheduleById = (scheduleId) => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_SCHEDULE_BY_ID_REQUEST })
    try {
      const res = await ScheduleServices.getScheduleById(scheduleId)
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_BY_ID_SUCCESS, payload: res.data })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_SCHEDULE_BY_ID_FAILURE })
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
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_REQUEST })
    try {
      const response = await ScheduleServices.predictOntimeDelivery(scheduleId)
      dispatch({
        type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_SUCCESS,
        payload: response.data.content
      })
    } catch (error) {
      dispatch({
        type: ScheduleConstants.PREDICT_ONTIME_DELIVERY_FAILURE,
        payload: error
      })
    }
  }
}

const postHyperparameter = () => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.POST_HYPERPARAMETER })
    try {
      const response = await ScheduleServices.hyperparamaterTuning()
      dispatch({
        type: ScheduleConstants.POST_HYPERPARAMETER_SUCCESS,
        payload: response.data.content
      })
    } catch (error) {
      dispatch({
        type: ScheduleConstants.POST_HYPERPARAMETER_FAILURE
      })
    }
  }
}

const getHyperparamter = () => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_HYPERPARAMETER })
    try {
      const response = await ScheduleServices.getHyperparamter()
      dispatch({
        type: ScheduleConstants.GET_HYPERPARAMETER_SUCCESS,
        payload: response.data.content
      })
    } catch (error) {
      dispatch({
        type: ScheduleConstants.GET_HYPERPARAMETER_FAILURE
      })
    }
  }
}

const getDraftSchedule = () => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.GET_DRAFT_SCHEDULE_REQUEST })
    try {
      const res = await ScheduleServices.getDraftSchedule()
      dispatch({ type: ScheduleConstants.GET_DRAFT_SCHEDULE_SUCCESS, payload: res.data.schedules })
    } catch (error) {
      dispatch({ type: ScheduleConstants.GET_DRAFT_SCHEDULE_FAILURE })
    }
  }
}

const setScheduleFromDraft = (data) => {
  return async (dispatch) => {
    dispatch({ type: ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_REQUEST })
    try {
      const res = await ScheduleServices.setScheduleFromDraft(data)
      dispatch({ type: ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_SUCCESS })
    } catch (error) {
      dispatch({ type: ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_FAILURE })
    }
  }
}

export const ScheduleActions = {
  getAllSchedule,
  getScheduleById,
  getAllStocksWithLatlng,
  createSchedule,
  autoSchedule,
  predictOntimeDelivery,
  postHyperparameter,
  getHyperparamter,
  getDraftSchedule,
  setScheduleFromDraft
}

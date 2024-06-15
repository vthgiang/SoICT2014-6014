import { dispatch } from "d3";
import { transportationConstants } from "./constants";
import { DashboardService } from "./services";

const getOntimeDeliveryRate = () => {
    return (dispatch) => {
        dispatch({ type: transportationConstants.GET_ON_TIME_DELIVERY_RATE })
      DashboardService.getOntimeDeliveryRate()
        .then((response) => {
          dispatch({
            type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_SUCCESS,
            payload: response.data.content
          })
        })
        .catch(() => {
          dispatch({
            type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_FAILED
          })
        })
    }
}

const getOnTimeDeliveryRatesPerMonth = () => {
  return (dispatch) => {
      dispatch({ type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH })
    DashboardService.getOnTimeDeliveryRatesPerMonth()
      .then((response) => {
        dispatch({
          type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH_FAILED
        })
      })
  }
}

const getEstimatedOnTimeDeliveryRatesPerMonth = () => {
  return (dispatch) => {
      dispatch({ type: transportationConstants.GET_ESTIMATED_ON_TIME_DELIVERY_RATE_PER_MONTH })
    DashboardService.getEstimatedOnTimeDeliveryRatesPerMonth()
      .then((response) => {
        dispatch({
          type: transportationConstants.GET_ESTIMATED_ON_TIME_DELIVERY_RATE_PER_MONTH_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: transportationConstants.GET_ESTIMATED_ON_TIME_DELIVERY_RATE_PER_MONTH_FAILED
        })
      })
  }
}

const getDeliveryLateDayAveragePerMonth = () => {
  return (dispatch) => {
      dispatch({ type: transportationConstants.GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH })
    DashboardService.getDeliveryLateDayAveragePerMonth()
      .then((response) => {
        dispatch({
          type: transportationConstants.GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: transportationConstants.GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH_FAILED
        })
      })
  }
}

export const DashboardActions = {
  getOntimeDeliveryRate,
  getOnTimeDeliveryRatesPerMonth,
  getEstimatedOnTimeDeliveryRatesPerMonth,
  getDeliveryLateDayAveragePerMonth
}

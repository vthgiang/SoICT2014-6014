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

const getTopLateDeliveryDay = (month, year) => {
  return (dispatch) => {
    dispatch({ type: transportationConstants.GET_TOP_LATE_DELIVERY_DAY })
    const query = { month, year };
  DashboardService.getTopLateDeliveryDay(query)
    .then((response) => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_DELIVERY_DAY_SUCCESS,
        payload: response.data.content
      })
    })
    .catch(() => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_DELIVERY_DAY_FAILED
      })
    })
  }
}

const getTopLateProducts = (month, year) => {
  return (dispatch) => {
    dispatch({ type: transportationConstants.GET_TOP_LATE_PRODUCTS })
    const query = { month, year };
  DashboardService.getTopLateProducts(query)
    .then((response) => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_PRODUCTS_SUCCESS,
        payload: response.data.content
      })
    })
    .catch(() => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_PRODUCTS_FAILED
      })
    })
  }
}

const getTopLateStocks = (month, year) => {
  return (dispatch) => {
    dispatch({ type: transportationConstants.GET_TOP_LATE_STOCKS })
    const query = { month, year };
  DashboardService.getTopLateStocks(query)
    .then((response) => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_STOCKS_SUCCESS,
        payload: response.data.content
      })
    })
    .catch(() => {
      dispatch({
        type: transportationConstants.GET_TOP_LATE_STOCKS_FAILED
      })
    })
  }
}

export const DashboardActions = {
  getOntimeDeliveryRate,
  getOnTimeDeliveryRatesPerMonth,
  getEstimatedOnTimeDeliveryRatesPerMonth,
  getDeliveryLateDayAveragePerMonth,
  getTopLateDeliveryDay,
  getTopLateProducts,
  getTopLateStocks
}

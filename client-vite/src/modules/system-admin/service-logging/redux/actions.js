import { ServiceLoggingServices } from './services'
import { ServiceLoggingConstants } from './constants'

function getServiceLogging(data) {
  return (dispatch) => {
    dispatch({ type: ServiceLoggingConstants.GET_SERVICE_LOGGING_REQUEST })

    ServiceLoggingServices.getServiceLogging(data)
      .then((res) => {
        dispatch({
          type: ServiceLoggingConstants.GET_SERVICE_LOGGING_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: ServiceLoggingConstants.GET_SERVICE_LOGGING_FAILURE,
          payload: error
        })
      })
  }
}

export const ServiceLoggingActions = {
  getServiceLogging
}

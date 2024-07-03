import { AuthorizationLoggingServices } from './services'
import { AuthorizationLoggingConstants } from './constants'

function getAuthorizationLogging(data) {
  return (dispatch) => {
    dispatch({ type: AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_REQUEST })

    AuthorizationLoggingServices.getAuthorizationLogging(data)
      .then((res) => {
        dispatch({
          type: AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_FAILURE,
          payload: error
        })
      })
  }
}

export const AuthorizationLoggingActions = {
  getAuthorizationLogging
}

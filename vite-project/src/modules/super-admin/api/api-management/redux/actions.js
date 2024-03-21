import { ApiServices } from './services'
import { ApiConstants } from './constants'

export const ApiActions = {
  getApis
}

function getApis(data) {
  return (dispatch) => {
    dispatch({ type: ApiConstants.GET_API_REQUEST })

    ApiServices.getApis(data)
      .then((res) => {
        dispatch({
          type: ApiConstants.GET_API_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: ApiConstants.GET_API_FAILURE,
          payload: error
        })
      })
  }
}

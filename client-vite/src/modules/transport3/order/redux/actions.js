import { orderConstants } from './constants'
import { orderServices } from './services'

export const orderActions = {
  getAllOrder: (query) => {
    return (dispatch) => {
      dispatch({
        type: orderConstants.GET_ALL_ORDER_REQUEST
      })

      orderServices
        .getAllOrder(query)
        .then((res) => {
          dispatch({
            type: orderConstants.GET_ALL_ORDER_SUCCESS,
            payload: res.data
          })
        })
        .catch((error) => {
          dispatch({
            type: orderConstants.GET_ALL_ORDER_FAILURE,
            error
          })
        })
    }
  }
}

import { orderConstants } from './constants'

export const order = (state = {}, action) => {
  switch (action.type) {
    case orderConstants.GET_ALL_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case orderConstants.GET_ALL_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case orderConstants.GET_ALL_ORDER_SUCCESS:
      return {
        ...state,
        total: action.payload.total,
        data: action.payload.data,
        isLoading: false
      }
    default:
      return state
  }
}

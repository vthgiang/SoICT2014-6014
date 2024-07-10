import { OrderConstants } from './constants'

const initState = {
  isLoading: false,
  address: null,
  listOrders: []
}

export function orders(state = initState, action) {
  switch (action.type) {
    case OrderConstants.GET_ADDRESS_FROM_LAT_LNG_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.GET_ADDRESS_FROM_LAT_LNG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        address: action.payload
      }
    case OrderConstants.GET_ADDRESS_FROM_LAT_LNG_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.CREATE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.CREATE_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.GET_ALL_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.GET_ALL_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listOrders: action.payload
      }
    case OrderConstants.GET_ALL_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.RETRAINING_MODEL_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.RETRAINING_MODEL_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.RETRAINING_MODEL_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.APPROVE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.APPROVE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.APPROVE_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.DELETE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.DELETE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.DELETE_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.UPDATE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case OrderConstants.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case OrderConstants.UPDATE_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

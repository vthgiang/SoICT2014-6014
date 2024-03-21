import { PurchaseRequestConstants } from './constants'

const initState = {
  isLoading: false,
  listPurchaseRequests: [],
  totalList: '',
  error: ''
}

export function purchaseRequest(state = initState, action) {
  switch (action.type) {
    case PurchaseRequestConstants.GET_PURCHASE_REQUEST_REQUEST:
    case PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_REQUEST:
    case PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_REQUEST:
    case PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_REQUEST:
    case PurchaseRequestConstants.GET_USER_APPROVER_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case PurchaseRequestConstants.GET_PURCHASE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPurchaseRequests: action.payload.listPurchaseRequests,
        totalList: action.payload.totalList
      }
    case PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPurchaseRequests: [...state.listPurchaseRequests, action.payload]
      }

    case PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPurchaseRequests: state.listPurchaseRequests.map((PurchaseRequest) =>
          PurchaseRequest._id === action.payload._id ? action.payload : PurchaseRequest
        )
      }

    case PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPurchaseRequests: state.listPurchaseRequests.filter((PurchaseRequest) => PurchaseRequest._id !== action.payload._id)
      }

    case PurchaseRequestConstants.GET_USER_APPROVER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listuser: action.payload
      }
    case PurchaseRequestConstants.GET_PURCHASE_REQUEST_FAILURE:
    case PurchaseRequestConstants.CREATE_PURCHASE_REQUEST_FAILURE:
    case PurchaseRequestConstants.UPDATE_PURCHASE_REQUEST_FAILURE:
    case PurchaseRequestConstants.DELETE_PURCHASE_REQUEST_FAILURE:
    case PurchaseRequestConstants.GET_USER_APPROVER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error.message
      }

    default:
      return state
  }
}

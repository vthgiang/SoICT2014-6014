import { CrmEvaluationConstants } from '../../evaluation/redux/constants'
import { CrmCustomerConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  list: [],
  totalDocs: 0,
  isLoading: true
}

export function customers(state = initState, action) {
  switch (action.type) {
    case CrmCustomerConstants.GET_CRM_CUSTOMERS_REQUEST:
    case CrmCustomerConstants.CREATE_CRM_CUSTOMER_REQUEST:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_REQUEST:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_REQUEST:
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_REQUEST:
    case CrmCustomerConstants.IMPORT_CRM_CUSTOMER_REQUEST:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_REQUEST:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_REQUEST:
    case CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_REQUEST:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_REQUEST:
    case CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_REQUEST:
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_REQUEST:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case CrmCustomerConstants.GET_CRM_CUSTOMERS_FAILE:
    case CrmCustomerConstants.CREATE_CRM_CUSTOMER_FAILE:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_FAILE:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_FAILE:
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_FAILE:
    case CrmCustomerConstants.IMPORT_CRM_CUSTOMER_FAILE:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_FAILE:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_FAILE:
    case CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_FAILE:
    case CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_FAILE:
    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_FAILE:
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_FAILE:
    case CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_FAILE:
      return {
        ...state,
        isLoading: false
      }

    case CrmCustomerConstants.GET_CRM_CUSTOMERS_SUCCESS:
      return {
        ...state,
        list: action.payload.customers,
        totalDocs: action.payload.listDocsTotal,
        isLoading: false
      }

    case CrmCustomerConstants.GET_CRM_CUSTOMER_SUCCESS:
      return {
        ...state,
        customerById: action.payload,
        isLoading: false
      }
    case CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_SUCCESS:
      return {
        ...state,
        customerPoint: action.payload,
        isLoading: false
      }

    case CrmCustomerConstants.CREATE_CRM_CUSTOMER_SUCCESS:
      return {
        ...state,
        list: [action.payload, ...state.list],
        isLoading: false
      }

    case CrmCustomerConstants.IMPORT_CRM_CUSTOMER_SUCCESS:
      return {
        ...state,
        list: [...action.payload, ...state.list],
        isLoading: false
      }

    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_SUCCESS:
      return {
        ...state,
        list: state.list.map((cus) => (cus._id === action.payload._id ? action.payload : cus)),
        isLoading: false
      }

    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }

    case CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_SUCCESS:
      return {
        ...state,
        customerById: action.payload,
        isLoading: false
      }
    case CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_SUCCESS:
      return {
        ...state,
        customerPromotions: action.payload,
        isLoading: false
      }

    case CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_SUCCESS:
      return {
        ...state,
        customerById: action.payload,
        isLoading: false
      }
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_SUCCESS:
      return {
        ...state,
        customerById: action.payload,
        isLoading: false
      }
    case CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_SUCCESS:
      return {
        ...state,
        customerById: action.payload,
        isLoading: false
      }
    case CrmCustomerConstants.DELETE_CRM_CUSTOMER_SUCCESS:
      return {
        ...state,
        list: state.list.filter((cus) => cus._id !== action.payload._id),
        isLoading: false
      }

    default:
      return state
  }
}

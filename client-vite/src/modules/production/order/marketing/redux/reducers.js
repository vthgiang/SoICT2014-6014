import { PaymentConstants } from './constants'

const findIndex = (array, id) => {
  let result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  isLoading: false,
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: 0,
  nextPage: 0,
  listPayments: [],
  paymentsForOrder: [],
  paymentDetail: {}
}

export function payments(state = initState, action) {
  switch (action.type) {
    case PaymentConstants.CREATE_PAYMENT_REQUEST:
    case PaymentConstants.GET_ALL_PAYMENTS_REQUEST:
    case PaymentConstants.GET_PAYMENT_DETAIL_REQUEST:
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case PaymentConstants.CREATE_PAYMENT_FAILURE:
    case PaymentConstants.GET_ALL_PAYMENTS_FAILURE:
    case PaymentConstants.GET_PAYMENT_DETAIL_FAILURE:
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case PaymentConstants.GET_ALL_PAYMENTS_SUCCESS:
      console.log('action.payload.allPayments', action.payload.allPayments)
      return {
        ...state,
        isLoading: false,
        listPayments: action.payload.allPayments.docs,
        totalDocs: action.payload.allPayments.totalDocs,
        limit: action.payload.allPayments.limit,
        totalPages: action.payload.allPayments.totalPages,
        page: action.payload.allPayments.page,
        pagingCounter: action.payload.allPayments.pagingCounter,
        hasPrevPage: action.payload.allPayments.hasPrevPage,
        hasNextPage: action.payload.allPayments.hasNextPage,
        prevPage: action.payload.allPayments.prevPage,
        nextPage: action.payload.allPayments.nextPage
      }
    case PaymentConstants.CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        listPayments: [...state.listPayments, action.payload.payment],
        isLoading: false
      }
    case PaymentConstants.GET_PAYMENT_DETAIL_SUCCESS:
      return {
        ...state,
        paymentDetail: action.payload.payment,
        isLoading: false
      }
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_SUCCESS:
      return {
        ...state,
        paymentsForOrder: action.payload.payments,
        isLoading: false
      }
    default:
      return state
  }
}

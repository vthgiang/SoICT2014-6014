import { PaymentConstants, TaxConstants } from './constants';

// Common helper function
var findIndex = (array, key, value) => {
  var result = -1;
  array.forEach((item, index) => {
    if (item[key] === value) {
      result = index;
    }
  });
  return result;
};

// Initial state for tax reducer
const initTaxState = {
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
  listTaxs: [],
  availabledTaxCode: false,
  listTaxsByCode: []
};

// Tax reducer
const taxs = (state = initTaxState, action) => {
  let index = -1;
  switch (action.type) {
    case TaxConstants.GET_ALL_TAXS_REQUEST:
    case TaxConstants.CREATE_TAX_REQUEST:
    case TaxConstants.GET_DETAIL_TAX_REQUEST:
    case TaxConstants.UPDATE_TAX_REQUEST:
    case TaxConstants.DISABLE_TAX_REQUEST:
    case TaxConstants.CHECK_TAX_CODE_REQUEST:
    case TaxConstants.GET_TAX_BY_CODE_REQUEST:
    case TaxConstants.DELETE_TAX_BY_CODE_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case TaxConstants.GET_ALL_TAXS_FAILURE:
    case TaxConstants.CREATE_TAX_FAILURE:
    case TaxConstants.GET_DETAIL_TAX_FAILURE:
    case TaxConstants.UPDATE_TAX_FAILURE:
    case TaxConstants.DISABLE_TAX_FAILURE:
    case TaxConstants.CHECK_TAX_CODE_FAILURE:
    case TaxConstants.GET_TAX_BY_CODE_FAILURE:
    case TaxConstants.DELETE_TAX_BY_CODE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case TaxConstants.GET_ALL_TAXS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listTaxs: action.payload.allTaxs.docs,
        totalDocs: action.payload.allTaxs.totalDocs,
        limit: action.payload.allTaxs.limit,
        totalPages: action.payload.allTaxs.totalPages,
        page: action.payload.allTaxs.page,
        pagingCounter: action.payload.allTaxs.pagingCounter,
        hasPrevPage: action.payload.allTaxs.hasPrevPage,
        hasNextPage: action.payload.allTaxs.hasNextPage,
        prevPage: action.payload.allTaxs.prevPage,
        nextPage: action.payload.allTaxs.nextPage
      };
    case TaxConstants.CREATE_TAX_SUCCESS:
      return {
        ...state,
        listTaxs: [...state.listTaxs, action.payload.tax],
        isLoading: false
      };
    case TaxConstants.UPDATE_TAX_SUCCESS:
    case TaxConstants.DISABLE_TAX_SUCCESS:
      index = findIndex(state.listTaxs, 'code', action.payload.tax.code);
      if (index !== -1) {
        state.listTaxs[index] = action.payload.tax;
      }
      return {
        ...state,
        isLoading: false
      };
    case TaxConstants.DELETE_TAX_BY_CODE_SUCCESS:
      index = findIndex(state.listTaxs, 'code', action.payload[0].code);
      if (index !== -1) {
        state.listTaxs.splice(index, 1);
      }
      return {
        ...state,
        isLoading: false
      };
    case TaxConstants.CHECK_TAX_CODE_SUCCESS:
      return {
        ...state,
        availabledTaxCode: action.payload.checked,
        isLoading: false
      };
    case TaxConstants.GET_TAX_BY_CODE_SUCCESS:
      return {
        ...state,
        listTaxsByCode: action.payload.taxs,
        isLoading: false
      };
    default:
      return state;
  }
};

// Initial state for payment reducer
const initPaymentState = {
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
};

// Payment reducer
const payments = (state = initPaymentState, action) => {
  switch (action.type) {
    case PaymentConstants.CREATE_PAYMENT_REQUEST:
    case PaymentConstants.GET_ALL_PAYMENTS_REQUEST:
    case PaymentConstants.GET_PAYMENT_DETAIL_REQUEST:
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case PaymentConstants.CREATE_PAYMENT_FAILURE:
    case PaymentConstants.GET_ALL_PAYMENTS_FAILURE:
    case PaymentConstants.GET_PAYMENT_DETAIL_FAILURE:
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case PaymentConstants.GET_ALL_PAYMENTS_SUCCESS:
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
      };
    case PaymentConstants.CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        listPayments: [...state.listPayments, action.payload.payment],
        isLoading: false
      };
    case PaymentConstants.GET_PAYMENT_DETAIL_SUCCESS:
      return {
        ...state,
        paymentDetail: action.payload.payment,
        isLoading: false
      };
    case PaymentConstants.GET_PAYMENT_FOR_ORDER_SUCCESS:
      return {
        ...state,
        paymentsForOrder: action.payload.payments,
        isLoading: false
      };
    default:
      return state;
  }
};

// Exporting both reducers
export { taxs, payments };

import { PurchaseInvoiceConstants } from "./constants";

const initState = {
    isLoading: false,
    totalList: 0,
    error: '',
    listPurchaseInvoice: [],
    purchaseInvoice: {},
}

export function purchaseInvoiceReducer(state = initState, action) {
    switch (action.type) {
        case PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_REQUEST:
        case PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_SUCCESS:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    listPurchaseInvoice: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };

            } else {
                return { ...state }
            }
        case PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_FAILURE:

        case PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_REQUEST:

        case PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    listPurchaseInvoice: [...action.payload.purchaseInvoices, ...state.listPurchaseInvoice],
                }
            } else {
                return { ...state, isLoading: false }
            }

        case PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,
                invoiceCodeError: action.payload,
            }

        case PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_REQUEST:
        case PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    listPurchaseInvoice: [...action.payload,
                    state.listPurchaseInvoice.filter(item => item._id !== action.payload._id)]
                }
            } else {
                return { ...state, isLoading: false }
            }

        case PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_FAILURE:
            return {
                ...state,
                isLoading: false,
            }

        case PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_REQUEST:
            return {
                ...state,
                isLoading: true,
                invoiceCodeError: []
            }
        case PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_SUCCESS:
            return {
                ...state,
                listPurchaseInvoice: state.listPurchaseInvoice.filter(invoice => !action.ids.includes(invoice?._id)),
                isLoading: false
            }
        case PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_FAILURE:

        case PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_REQUEST:
        case PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    purchaseInvoice: action.payload.purchaseInvoice,
                }
            } else {
                return { ...state, isLoading: false }
            }
        case PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_FAILURE:

        default:
            return state
    }
}
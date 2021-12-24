import { SuppliesConstants } from "./constants";

const initState = {
    isLoading: false,
    totalList: 0,
    error: '',
    listSupplies: [],
    listPurchaseInvoice: [],
    listAllocation: [],
}

export function suppliesReducer(state = initState, action) {
    switch (action.type) {
        case SuppliesConstants.SEARCH_SUPPLIES_REQUEST:
        case SuppliesConstants.SEARCH_SUPPLIES_SUCCESS:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    listSupplies: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };

            } else {
                return { ...state }
            }
        case SuppliesConstants.SEARCH_SUPPLIES_FAILURE:

        case SuppliesConstants.CREATE_SUPPLIES_REQUEST:

        case SuppliesConstants.CREATE_SUPPLIES_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    listSupplies: [action.payload.suppliesCreate, ...state.listSupplies],
                }
            } else {
                return { ...state, isLoading: false }
            }

        case SuppliesConstants.CREATE_SUPPLIES_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,
                suppliesCodeError: action.payload,
            }

        case SuppliesConstants.UPDATE_SUPPLIES_REQUEST:
        case SuppliesConstants.UPDATE_SUPPLIES_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    listSupplies: [...action.payload,
                    state.listSupplies.filter(item => item._id !== action.payload._id)]
                }
            } else {
                return { ...state, isLoading: false }
            }

        case SuppliesConstants.UPDATE_SUPPLIES_FAILURE:
            return {
                ...state,
                isLoading: false,
            }

        case SuppliesConstants.DELETE_SUPPLIES_REQUEST:
            return {
                ...state,
                isLoading: true,
                suppliesCodeError: []
            }
        case SuppliesConstants.DELETE_SUPPLIES_SUCCESS:
            return {
                ...state,
                listSupplies: state.listSupplies.filter(supplies => !action.ids.includes(supplies?._id)),
                isLoading: false
            }
        case SuppliesConstants.DELETE_SUPPLIES_FAILURE:

        case SuppliesConstants.GET_SUPPLIES_BY_ID_REQUEST:
        case SuppliesConstants.GET_SUPPLIES_BY_ID_SUCCESS:
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    supplies: action.payload.supplies,
                    listAllocation: action.payload.listAllocation,
                    listPurchaseInvoice: action.payload.listPurchaseInvoice,
                }
            } else {
                return { ...state, isLoading: false }
            }
        case SuppliesConstants.GET_SUPPLIES_BY_ID_FAILURE:

        default:
            return state
    }
}
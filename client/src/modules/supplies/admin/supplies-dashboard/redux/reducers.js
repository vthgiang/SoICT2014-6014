import { SuppliesDashboardConstants } from "./constants";


const initState = {
    isLoading: false,
    error: '',
    suppliesData: [],
    countInvoice: [],
    countAllocation: [],
    valueInvoice: [],
}

export function suppliesDashboardReducer(state = initState, action) {
    switch (action.type) {
        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_REQUEST:
        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_SUCCESS:

            if (action.payload !== undefined) {
                return {
                    ...state,
                    suppliesData: action.payload.suppliesData,
                    countInvoice: action.payload.countInvoice,
                    countAllocation: action.payload.countAllocation,
                    valueInvoice: action.payload.valueInvoice,
                    isLoading: false
                };

            } else {
                return { ...state }
            }

        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_FAILURE:

        default:
            return state
    }
}
import { SuppliesDashboardConstants } from "./constants";


const initState = {
    isLoading: false,
    error: '',
    numberData: {
        supplies: {
            totalSupplies: 0,
            suppliesPrice: 0,
        },
        purchaseInvoice: {
            totalPurchaseInvoice: 0,
            purchaseInvoicesPrice: 0,
        },
        purchaseRequest: {
            approvedTotal: 0,
            disapprovedTotal: 0,
            waitingForApprovalTotal: 0
        },
        allocationHistory: {
            allocationHistoryTotal: 0,
            allocationHistoryPrice: 0
        }
    },
    pieChart: {
        boughtSupplies: [],
        existSupplies: []
    },
    barChart: {
        organizationUnitsPriceSupply: []
    },
    suppliesPriceForOrganization: []
}

export function suppliesDashboardReducer(state = initState, action) {
    switch (action.type) {
        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_REQUEST:
        case SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_REQUEST:
        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_SUCCESS:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    numberData: action.payload.numberData,
                    pieChart: action.payload.pieChart,
                    barChart: action.payload.barChart,
                    isLoading: false
                };
            } else {
                return { ...state }
            }
        case SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_SUCCESS:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    suppliesPriceForOrganization: action.payload
                };
            } else {
                return { ...state }
            }
        case SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_FAILURE:
        case SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_FAILURE:

        default:
            return state
    }
}
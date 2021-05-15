import { CrmCustomerRankPointConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    list: [],
    totalDocs: 0,
    isLoading: true,
}

export function customerRankPoints(state = initState, action) {

    switch (action.type) {
        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_REQUEST:
        case CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_REQUEST:
        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_REQUEST:
        case CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_REQUEST:
        case CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_FAILE:
        case CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_FAILE:
        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_FAILE:
        case CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_FAILE:
        case CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINTS_SUCCESS:
            return {
                ...state,
                list: action.payload.customerRankPoints,
                totalDocs: action.payload.listDocsTotal,
                isLoading: false
            };

        case CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_SUCCESS:
            return {
                ...state,
                customerRankPointById: action.payload,
                isLoading: false,
            };

        case CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_SUCCESS:
            return {
                ...state,
                list: state.list.map(o => ((o._id === action.payload._id) ? action.payload : o)),
                isLoading: false
            };

        case CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_SUCCESS:
            return {
                ...state,
                list: state.list.filter(o => (o._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
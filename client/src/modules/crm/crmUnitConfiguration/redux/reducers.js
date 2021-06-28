import { CrmUnitConstants } from "./constants";

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

export function crmUnits(state = initState, action) {

    switch (action.type) {
        case CrmUnitConstants.GET_CRM_UNIT_REQUEST:
        case CrmUnitConstants.DELETE_CRM_UNIT_REQUEST:
        case CrmUnitConstants.CREATE_CRM_UNIT_REQUEST:
  

            return {
                ...state,
                isLoading: true
            }

        case CrmUnitConstants.GET_CRM_UNIT_FAILE:
        case CrmUnitConstants.CREATE_CRM_UNIT_FAILE:
        case CrmUnitConstants.DELETE_CRM_UNIT_FAILE:

            return {
                ...state,
                isLoading: false
            }

        case CrmUnitConstants.GET_CRM_UNIT_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };
        case CrmUnitConstants.CREATE_CRM_UNIT_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmUnitConstants.DELETE_CRM_UNIT_SUCCESS:
            return {
                ...state,
                list: state.list.filter(o => (o._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
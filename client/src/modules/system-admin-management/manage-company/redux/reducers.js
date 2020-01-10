import { companyConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    error: null
}

export function company(state = initState, action) {

    switch (action.type) {
        case companyConstants.GET_COMPANIES_REQUEST:
        case companyConstants.CREATE_COMPANY_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case companyConstants.GET_COMPANIES_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };
        
        case companyConstants.CREATE_COMPANY_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                isLoading: false
            };

        case 'LOGOUT':
            return initState;

        default:
            return state;
    }
}
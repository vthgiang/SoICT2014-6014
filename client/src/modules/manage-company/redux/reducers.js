import { companyConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    error: null
}

export function company(state = initState, action) {

    switch (action.type) {
        case companyConstants.GET_COMPANIES_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        default:
            return state;
    }
}
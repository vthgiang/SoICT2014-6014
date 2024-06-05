import { transportationConstants } from "./constants"

const initialState = {
    lists: [],
    isLoading: false,
    error: null,
    totalList: 0,
}

export function transportationDashboard(state = initialState, action) {
    switch (action.type) {
        case transportationConstants.GET_ALL_DATA_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_ALL_DATA_SUCCESS:
            return {
                ...state,
                isLoading: false
            }
        case transportationConstants.GET_SESSION_ID_SUCCESS:
            return {
                ...state,
                externalSessionId: action.payload,
                isLoading: false,
            }
        default:
            return state
    }
}
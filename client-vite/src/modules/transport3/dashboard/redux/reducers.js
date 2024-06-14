import { transportationConstants } from "./constants"

const initialState = {
    lists: [],
    isLoading: false,
    error: null,
    totalList: 0,
    onTimeDeliveryData: [],
    estimatedOnTimeDeliveryData: [],
    deliveryLateDayAverage: []
}

export function dashboard(state = initialState, action) {
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
        // case transportationConstants.GET_ON_TIME_DELIVERY_RATE:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        // case transportationConstants.GET_ON_TIME_DELIVERY_RATE_SUCCESS:
        //     return {
        //         onTimeDeliveryData: action.payload,
        //         isLoading: false
        //     }
        case transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                onTimeDeliveryData: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_ESTIMATED_ON_TIME_DELIVERY_RATE_PER_MONTH:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_ESTIMATED_ON_TIME_DELIVERY_RATE_PER_MONTH_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                estimatedOnTimeDeliveryData: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                deliveryLateDayAverage: action.payload,
                isLoading: false
            }
        default:
            return state
    }
}
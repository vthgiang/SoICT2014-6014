import { transportationConstants } from "./constants"

const initialState = {
    lists: [],
    isLoading: false,
    error: null,
    totalList: 0,
    onTimeDeliveryData: [],
    estimatedOnTimeDeliveryData: [],
    deliveryLateDayAverage: [],
    topLateDeliveryDay: [],
    topLateProducts: [],
    topLateStocks: [],
    orderStatus: {}
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
        case transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_ON_TIME_DELIVERY_RATE_PER_MONTH_SUCCESS:
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
            return {
                ...state,
                deliveryLateDayAverage: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_TOP_LATE_DELIVERY_DAY:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_TOP_LATE_DELIVERY_DAY_SUCCESS:
<<<<<<< HEAD
=======
            console.log(action.payload)
>>>>>>> 5f5138d7e (dashboard cho nhan vien giam sat va truong phong van chuyen)
            return {
                ...state,
                topLateDeliveryDay: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_TOP_LATE_PRODUCTS:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_TOP_LATE_PRODUCTS_SUCCESS:
<<<<<<< HEAD
=======
            console.log(action.payload)
>>>>>>> 5f5138d7e (dashboard cho nhan vien giam sat va truong phong van chuyen)
            return {
                ...state,
                topLateProducts: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_TOP_LATE_STOCKS:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_TOP_LATE_STOCKS_SUCCESS:
            return {
                ...state,
                topLateStocks: action.payload,
                isLoading: false
            }
        case transportationConstants.GET_ORDER_STATUS:
            return {
                ...state,
                isLoading: true
            }
        case transportationConstants.GET_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                orderStatus: action.payload,
                isLoading: false
            }
        default:
            return state
    }
}

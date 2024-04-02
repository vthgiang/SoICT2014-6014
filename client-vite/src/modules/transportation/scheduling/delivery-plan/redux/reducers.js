import { DeliveryConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    journeys: [],
    isLoading: false,
    error: null,
    totalList: 0,
}

export function delivery(state = initialState, action) {
    switch (action.type) {
        case DeliveryConstants.GET_ALL_DELIVERY_REQUEST:
        case DeliveryConstants.SAVE_SOLUTION_REQUEST:
        case DeliveryConstants.CHANGE_ORDER_POSITION_REQUEST:
        case DeliveryConstants.CREATE_DELIVERY_PLAN_REQUEST:
        case DeliveryConstants.GET_ALL_JOURNEY_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case DeliveryConstants.SAVE_SOLUTION_SUCCESS:
            return {
            ...state,
            isLoading: false,
        }
        case DeliveryConstants.CHANGE_ORDER_POSITION_SUCCESS:
            return {
            ...state,
            isLoading: false,
        }
        case DeliveryConstants.GET_ALL_DELIVERY_SUCCESS:
        return {
            ...state,
            lists: action.payload,
            isLoading: false
        }
        case DeliveryConstants.CREATE_DELIVERY_PLAN_SUCCESS:
            return {
            ...state,
                lists: action.payload,
                isLoading: false
            }
        case DeliveryConstants.GET_ALL_JOURNEY_SUCCESS:
            return {
                ...state,
                journeys: action.payload,
                isLoading: false
            }
        case DeliveryConstants.GET_ALL_DELIVERY_FAILURE:
        case DeliveryConstants.CHANGE_ORDER_POSITION_FAILURE:
        case DeliveryConstants.SAVE_SOLUTION_FAILURE:
        case DeliveryConstants.CREATE_DELIVERY_PLAN_FAILURE:
        case DeliveryConstants.GET_ALL_JOURNEY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        default:
            return state
    }
}
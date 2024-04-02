import { JourneyConstants } from './constants';

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
    isLoading: false,
    error: null,
    totalList: 0,
    journeyWithCost: [],
}

export function journey(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case JourneyConstants.GET_ALL_JOURNEYS_REQUEST:
        case JourneyConstants.DELETE_JOURNEY_REQUEST:
        case JourneyConstants.CREATE_JOURNEY_REQUEST:
        case JourneyConstants.EDIT_JOURNEY_REQUEST:
        case JourneyConstants.GET_COST_OF_ALL_JOURNEYS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case JourneyConstants.GET_ALL_JOURNEYS_FAILURE:
        case JourneyConstants.DELETE_JOURNEY_FAILURE:
        case JourneyConstants.CREATE_JOURNEY_FAILURE:
        case JourneyConstants.EDIT_JOURNEY_FAILURE:
        case JourneyConstants.GET_COST_OF_ALL_JOURNEYS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case JourneyConstants.GET_ALL_JOURNEYS_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case JourneyConstants.DELETE_JOURNEY_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(journey => journey._id != action.journeyId),
                isLoading: false
            }
        case JourneyConstants.CREATE_JOURNEY_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case JourneyConstants.EDIT_JOURNEY_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case JourneyConstants.REFRESH_JOURNEY_DATA:
            state.lists.forEach((journey, journeyIndex) => {
                if (JSON.stringify(journey._id) == JSON.stringify(action.payload._id)) {
                    index = journeyIndex;
                }
            })
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case JourneyConstants.GET_COST_OF_ALL_JOURNEYS_SUCCESS: {
            return {
                ...state,
                journeyWithCost: action.payload,
                isLoading: false
            }
        }
        default:
            return state
    }
}
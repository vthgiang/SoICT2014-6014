import { requestConstants } from "./constants"

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
    isLoading: false,
    listRequests: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    currentRequest: {}
}

export const requestManagements = (state = initialState, action) => {
    let index = - 1;
    switch (action.type) {
        case requestConstants.GET_ALL_REQUEST_REQUEST:
        case requestConstants.CREATE_REQUEST_REQUEST:
        case requestConstants.GET_DETAIL_REQUEST_REQUEST:
        case requestConstants.UPDATE_REQUEST_REQUEST:
        case requestConstants.GET_NUMBER_REQUEST_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case requestConstants.GET_ALL_REQUEST_FAILURE:
        case requestConstants.CREATE_REQUEST_FAILURE:
        case requestConstants.GET_DETAIL_REQUEST_FAILURE:
        case requestConstants.UPDATE_REQUEST_FAILURE:
        case requestConstants.GET_NUMBER_REQUEST_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case requestConstants.GET_ALL_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRequests: action.payload.requests.docs,
                totalDocs: action.payload.requests.totalDocs,
                limit: action.payload.requests.limit,
                totalPages: action.payload.requests.totalPages,
                page: action.payload.requests.page,
                pagingCounter: action.payload.requests.pagingCounter,
                hasPrevPage: action.payload.requests.hasPrevPage,
                hasNextPage: action.payload.requests.hasNextPage,
                prevPage: action.payload.requests.prevPage,
                nextPage: action.payload.requests.nextPage

            }
        case requestConstants.CREATE_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRequests: [...state.listRequests, action.payload.request]
            }
        case requestConstants.GET_DETAIL_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentRequest: action.payload.request
            }
        case requestConstants.UPDATE_REQUEST_SUCCESS:
            index = findIndex(state.listRequests, action.payload.request._id);
            if (index !== -1) {
                state.listRequests[index] = action.payload.request
            }
            return {
                ...state,
                isLoading: false
            }
        case requestConstants.GET_NUMBER_REQUEST_SUCCESS: {
            return {
                ...state,
                purchasingNumber: action.payload,
                isLoading: false
            }
        }
        default:
            return state
    }
}

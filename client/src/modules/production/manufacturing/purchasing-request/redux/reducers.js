import { purchasingRequestConstants } from "./constants"

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
    listPurchasingRequests: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    currentPurchasingRequest: {}
}

export const purchasingRequest = (state = initialState, action) => {
    let index = - 1;
    switch (action.type) {
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_REQUEST:
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_REQUEST:
        case purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_REQUEST:
        case purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_FAILURE:
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_FAILURE:
        case purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_FAILURE:
        case purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPurchasingRequests: action.payload.purchasingRequests.docs,
                totalDocs: action.payload.purchasingRequests.totalDocs,
                limit: action.payload.purchasingRequests.limit,
                totalPages: action.payload.purchasingRequests.totalPages,
                page: action.payload.purchasingRequests.page,
                pagingCounter: action.payload.purchasingRequests.pagingCounter,
                hasPrevPage: action.payload.purchasingRequests.hasPrevPage,
                hasNextPage: action.payload.purchasingRequests.hasNextPage,
                prevPage: action.payload.purchasingRequests.prevPage,
                nextPage: action.payload.purchasingRequests.nextPage

            }
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPurchasingRequests: [...state.listPurchasingRequests, action.payload.purchasingRequest]
            }
        case purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentPurchasingRequest: action.payload.purchasingRequest
            }
        case purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_SUCCESS:
            index = findIndex(state.listPurchasingRequests, action.payload.purchasingRequest._id);
            console.log(action.payload.purchasingRequest);
            if (index !== -1) {
                state.listPurchasingRequests[index] = action.payload.purchasingRequest
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}
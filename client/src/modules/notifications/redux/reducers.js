import { NotificationConstants } from "./constants";

const initState = {
    list: [],
    listPaginate: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    error: null,
    isLoading: true,
    item: null
}

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if(value._id === id){
            result = index;
        }
    });
    return result;
}

export function notification(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case NotificationConstants.GET_NOTIFICATIONS_REQUEST:
        case NotificationConstants.CREATE_NOTIFICATION_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case NotificationConstants.GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case NotificationConstants.CREATE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                list: [
                    action.payload,
                    ...state.list
                ],
                isLoading: false
            };

        case 'LOGOUT':
            return initState;

        default:
            return state;
    }
}
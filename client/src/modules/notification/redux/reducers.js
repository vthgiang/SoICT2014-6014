import { NotificationConstants } from "./constants";

const initState = {
    list: [],
    listReceivered: [],
    listSent: [],
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

export function notifications(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case NotificationConstants.GET_NOTIFICATIONS_REQUEST:
        case NotificationConstants.CREATE_NOTIFICATION_REQUEST:
        case NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_REQUEST:
        case NotificationConstants.DELETE_NOTIFICATION_SENT_REQUEST:
        case NotificationConstants.DELETE_NOTIFICATION_RECEIVERED_REQUEST:
        case NotificationConstants.GET_NOTIFICATIONS_SENT_REQUEST:
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

        case NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_SUCCESS:
            return {
                ...state,
                listReceivered: action.payload,
                isLoading: false
            };

        case NotificationConstants.GET_NOTIFICATIONS_SENT_SUCCESS:
            return {
                ...state,
                listSent: action.payload,
                isLoading: false
            };

        case NotificationConstants.CREATE_NOTIFICATION_SUCCESS:
            
            return {
                ...state,
                listSent: [
                    action.payload,
                    ...state.listSent
                ],
                isLoading: false
            };

        case NotificationConstants.DELETE_NOTIFICATION_RECEIVERED_SUCCESS:
            index = findIndex(state.listReceivered, action.payload);
            if(index !== -1) state.listReceivered.splice(index, 1);
            return {
                ...state,
                isLoading: false
            };

        case NotificationConstants.DELETE_NOTIFICATION_SENT_SUCCESS:
            index = findIndex(state.listSent, action.payload);
            if(index !== -1) state.listSent.splice(index, 1);
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
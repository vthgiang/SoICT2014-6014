import { NotificationConstants } from "./constants";

const initState = {
    sent: {
        list: [],
        paginate: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: 0,
        nextPage: 0,
    },
    receivered: {
        list: [],
        paginate: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: 0,
        nextPage: 0,
    },
    
    isLoading: true
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
        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_REQUEST:
        case NotificationConstants.GET_NOTIFICATIONS_REQUEST:
        case NotificationConstants.CREATE_NOTIFICATION_REQUEST:
        case NotificationConstants.READED_NOTIFICATION_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_FAILE:
        case NotificationConstants.GET_NOTIFICATIONS_FAILE:
        case NotificationConstants.CREATE_NOTIFICATION_FAILE:
        case NotificationConstants.READED_NOTIFICATION_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    list: action.payload
                },
                isLoading: false
            };

        case NotificationConstants.GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                receivered: {
                    ...state.receivered,
                    list: action.payload
                },
                isLoading: false
            };

        case NotificationConstants.CREATE_NOTIFICATION_SUCCESS:
            
            return {
                ...state,
                sent: {
                    ...state.sent,
                    list: [action.payload, ...state.sent.list]
                },
                isLoading: false
            };

        case NotificationConstants.READED_NOTIFICATION_SUCCESS:
            index = findIndex(state.receivered.list, action.payload._id);
            if(index !== -1) state.receivered.list[index] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
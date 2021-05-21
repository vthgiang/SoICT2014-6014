import { ChangeRequestConstants } from './constants';

const initState = {
    isLoading: false,
    changeRequests: [],
}

export function changeRequest(state = initState, action) {
    switch (action.type) {
        case ChangeRequestConstants.GET_CHANGE_REQUESTS_LIST:
        case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST:
        case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS:
        case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case ChangeRequestConstants.GET_CHANGE_REQUESTS_LIST_FAILE:
        case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_FAILE:
        case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_FAILE:
        case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_FAILE:
            return {
                ...state,
                isLoading: false,
            }
     case ChangeRequestConstants.GET_CHANGE_REQUESTS_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            };

        case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            }

        case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            }

        case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            }

        default:
            return state;
    }

}
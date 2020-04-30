import { AuthConstants } from "./constants";

var initState = {
    calledAPI: false, //chưa chạy lần nào 
    user: {},
    links: [],
    components: [],
    error: null,
    forgotPassword: false,
    isLoading: false
}

export function auth(state = initState, action) {

    switch (action.type) {
        case AuthConstants.GET_LINKS_OF_ROLE_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                calledAPI: true,
            };
        case AuthConstants.LOGIN_REQUEST:
        case AuthConstants.FORGOT_PASSWORD_REQUEST:
        case AuthConstants.RESET_PASSWORD_REQUEST:
        case AuthConstants.EDIT_PROFILE_REQUEST:
        case AuthConstants.CHANGE_USER_INFORMATION_REQUEST:
        case AuthConstants.CHANGE_USER_PASSWORD_REQUEST:
        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AuthConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                error: null
            };

        case AuthConstants.LOGIN_FAILE:
            return {
                ...state,
                isLoading: false,
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    roles: null,
                    company: null
                },
                error: action.payload.message
            };

        case AuthConstants.EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload
            };

        case AuthConstants.CHANGE_USER_INFORMATION_SUCCESS:
        case AuthConstants.CHANGE_USER_PASSWORD_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                error: null
            };

        case AuthConstants.REFRESH_DATA_USER_SUCCESS:
            if(localStorage.getItem('currentRole') === null){
                localStorage.setItem('currentRole', action.payload.roles[0].roleId._id);
            }
            return {
                ...state,
                isLoading: false,
                user: action.payload
            };

        case AuthConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                calledAPI: false,
                isLoading: false,
                links: action.payload
            };

        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                components: action.payload
            };

        case AuthConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                forgotPassword: action.payload
            };

        case AuthConstants.RESET_PASSWORD_SUCCESS:
            return initState;
        
        case AuthConstants.GET_LINKS_OF_ROLE_FAILE:
            return {
                ...state,
                isLoading: false,
                calledAPI: false,
            }

        case AuthConstants.REFRESH_DATA_USER_FAILE:
        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE:
        case AuthConstants.CHANGE_USER_INFORMATION_FAILE:
        case AuthConstants.CHANGE_USER_PASSWORD_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        default:
            return {...state};
    }
}
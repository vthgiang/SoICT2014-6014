import { AuthConstants } from "./constants";
import { getStorage } from '../../../config';

const token = getStorage();

const initState = {
    logged: token ? true : false,
    user: {},
    links: [],
    error: null,
    forgotPassword: false
}

export function auth(state = initState, action) {

    switch (action.type) {
        case AuthConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                logged: true,
                error: null
            };

        case AuthConstants.LOGIN_FAILE:
            return {
                ...state,
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    roles: null,
                    company: null
                },
                logged: false,
                error: action.payload.msg
            };

        case AuthConstants.EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.payload
            };

        case AuthConstants.REFRESH_DATA_USER_SUCCESS:
            return {
                ...state,
                user: action.payload
            };

        case AuthConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                links: action.payload
            };

        case 'RESET_APP':
            return {
                logged: false,
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    roles: null,
                    company: null
                },
                links: [],
                error: null,
                forgotPassword: false
            };

        case AuthConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPassword: action.payload
            };

        case AuthConstants.RESET_PASSWORD_SUCCESS:
            alert("Thay đổi mật khẩu thành công!\nChange password successfully!")
            return initState;

        default:
            return state;
    }
}
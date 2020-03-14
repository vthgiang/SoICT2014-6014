import { AuthConstants } from "./constants";
import { getStorage } from '../../../config';

const token = getStorage();

var initState = {
    user: {},
    links: [],
    components: [],
    error: null,
    forgotPassword: false
}

export function auth(state = initState, action) {

    switch (action.type) {
        case AuthConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
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
                error: action.payload.msg
            };

        case AuthConstants.EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.payload
            };

        case AuthConstants.REFRESH_DATA_USER_SUCCESS:
            if(localStorage.getItem('currentRole') === null){
                localStorage.setItem('currentRole', action.payload.roles[0].roleId._id);
            }
            return {
                ...state,
                user: action.payload
            };

        case AuthConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                links: action.payload
            };

        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS:
            return {
                ...state,
                components: action.payload
            };

        case 'RESET_APP':
            return {
                ...state,
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
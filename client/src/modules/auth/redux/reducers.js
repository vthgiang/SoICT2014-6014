import { AuthConstants } from "./constants";

var initState = {
    calledAPI: false, //chưa chạy lần nào 
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
                calledAPI: true,
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
                calledAPI: true,
                user: action.payload
            };

        case AuthConstants.REFRESH_DATA_USER_SUCCESS:
            if(localStorage.getItem('currentRole') === null){
                localStorage.setItem('currentRole', action.payload.roles[0].roleId._id);
            }
            return {
                ...state,
                calledAPI: true,
                user: action.payload
            };

        case AuthConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                calledAPI: true,
                links: action.payload
            };

        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS:
            return {
                ...state,
                calledAPI: true,
                components: action.payload
            };

        case AuthConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPassword: action.payload
            };

        case AuthConstants.RESET_PASSWORD_SUCCESS:
            alert("Thay đổi mật khẩu thành công!\nChange password successfully!")
            return initState;

        case AuthConstants.REFRESH_DATA_USER_FAILE:
        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE:
        case AuthConstants.GET_LINKS_OF_ROLE_FAILE:
            return {
                ...state,
                calledAPI: true
            }

        default:
            return state;
    }
}
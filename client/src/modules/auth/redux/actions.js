import { AuthService } from "./services";
import { AuthConstants } from "./constants";

export const login = (user) => {
    return dispatch => {
        AuthService.login(user)
            .then(res => {
                localStorage.setItem('token', res.data.token);
                if(res.data.user.roles.length > 0) localStorage.setItem('currentRole', res.data.user.roles[0].roleId._id);

                dispatch({
                    type: AuthConstants.LOGIN_SUCCESS,
                    payload: res.data.user
                })
            })
            .catch(err => {
                dispatch({
                    type: AuthConstants.LOGIN_FAILE,
                    payload: typeof(err.response) !== 'undefined' ? err.response.data : err
                })
            })
    }
}

export const logout = () => {
    return dispatch => {
        AuthService.logout()
            .then(res => {
                localStorage.clear();
                dispatch({
                    type: 'RESET_APP'
                })
            })
            .catch(err => {
                console.log("logout error");
            })
    }
}

export const logoutAllAccount = () => {
    return dispatch => {
        AuthService.logoutAllAccount()
            .then(res => {
                localStorage.clear();
                dispatch({
                    type: 'RESET_APP'
                })
            })
            .catch(err => {
                console.log("logout error");
            })
    }
}

export const editProfile = (data) => {
    return dispatch => {
        AuthService.editProfile(data)
            .then(res => {
                localStorage.setItem('name', res.data.name);
                dispatch({
                    type: AuthConstants.EDIT_PROFILE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const getLinksOfRole = (idRole) => {
    return dispatch => {
        AuthService.getLinksOfRole(idRole)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_LINKS_OF_ROLE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const refresh = () => {
    return dispatch => {
        dispatch({ type: AuthConstants.REFRESH_DATA_USER_REQUEST});
        AuthService.refresh()
            .then(res => {
                dispatch({
                    type: AuthConstants.REFRESH_DATA_USER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                var { msg } = err.response.data;
                if(msg === 'ACC_LOGGED_OUT' || msg === 'TOKEN_INVALID' || msg === 'ACCESS_DENIED'){
                    localStorage.clear();
                    dispatch({
                        type: 'RESET_APP'
                    })
                }else{
                    console.log("Error: ", err.response.data);
                }
            })
    }
}
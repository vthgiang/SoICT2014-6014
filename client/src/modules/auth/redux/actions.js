import { AuthService } from "./services";
import { AuthConstants } from "./constants";
import { setStorage, clearStorage } from '../../../config';

export const login = (user) => {
    return dispatch => {
        AuthService.login(user)
            .then(res => {
                setStorage('auth-token', res.data.token);
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
                clearStorage('auth-token');
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
                clearStorage('auth-token');
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
                if(err.response !== undefined){
                    var { msg } = err.response.data;
                    if(msg === 'ACC_LOGGED_OUT' || msg === 'TOKEN_INVALID' || msg === 'ACCESS_DENIED'){
                        // localStorage.clear();
                        // clearStorage('auth-token');
                        dispatch({
                            type: 'RESET_APP'
                        })
                    }
                }else{
                    console.log(err)
                    alert("ERROR")
                    // localStorage.clear();
                    // clearStorage('auth-token');
                    dispatch({
                        type: 'RESET_APP'
                    })
                }
            })
    }
}

export const forgotPassword = (email) => {
    return dispatch => {
        AuthService.forgotPassword(email)
            .then(res => {
                dispatch({
                    type: AuthConstants.FORGOT_PASSWORD_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const resetPassword = (otp, email, password) => {
    return dispatch => {
        AuthService.resetPassword(otp, email, password)
            .then(res => {
                dispatch({
                    type: AuthConstants.RESET_PASSWORD_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const reset = () => {
    return dispatch => {
        dispatch({
            type: 'RESET_APP'
        });
    }
}
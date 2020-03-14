import { AuthService } from "./services";
import { AuthConstants } from "./constants";
import { setStorage, clearStorage } from '../../../config';

export const AuthActions = {
    login,
    logout,
    logoutAllAccount,
    editProfile,
    getLinksOfRole,
    refresh,
    resetPassword,
    forgotPassword,
    getComponentOfUserInLink
}

function login(user){
    return dispatch => {
        AuthService.login(user)
            .then(res => {
                setStorage('jwt', res.data.token);
                if(res.data.user.roles.length > 0) 
                    setStorage('currentRole', res.data.user.roles[0].roleId._id);

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

function logout(){
    return dispatch => {
        AuthService.logout()
            .then(res => {
                clearStorage();
                dispatch({
                    type: 'RESET_APP'
                })
            })
            .catch(err => {
                console.log("logout error");
            })
    }
}

function logoutAllAccount(){
    return dispatch => {
        AuthService.logoutAllAccount()
            .then(res => {
                clearStorage();
                dispatch({
                    type: 'RESET_APP'
                })
            })
            .catch(err => {
                console.log("logout error");
            })
    }
}

function editProfile(data){
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

function getLinksOfRole(idRole){
    return dispatch => {
        return new Promise((resolve, reject) => {
            AuthService.getLinksOfRole(idRole)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_LINKS_OF_ROLE_SUCCESS,
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
                console.log("Có lỗi xảy ra rồi ông ơi! :(", err.response);
                if(err.response !== undefined){
                    var { msg } = err.response.data;
                    if(msg === 'ACC_LOGGED_OUT' || msg === 'TOKEN_INVALID' || msg === 'ACCESS_DENIED'){
                        clearStorage();
                        dispatch({
                            type: 'RESET_APP'
                        })
                    }
                }
                reject(err);
            })
        });
    }
}

function refresh(){
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
                        clearStorage();
                        dispatch({
                            type: 'RESET_APP'
                        })
                    }
                }
            })
    }
}

function forgotPassword(email){
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

function resetPassword(otp, email, password){
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

function reset(){
    return dispatch => {
        dispatch({
            type: 'RESET_APP'
        });
    }
}

function getComponentOfUserInLink(curentRole, linkId){
    return dispatch => {
        dispatch({ type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_REQUEST});
        AuthService.getComponentOfUserInLink(curentRole, linkId)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}
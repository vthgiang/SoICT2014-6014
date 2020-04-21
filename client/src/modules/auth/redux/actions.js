import { AuthService } from "./services";
import { AuthConstants } from "./constants";
import { setStorage } from '../../../config';
import { AlertActions } from "../../alert/redux/actions";

export const AuthActions = {
    login,
    logout,
    logoutAllAccount,
    editProfile,
    getLinksOfRole,
    refresh,
    resetPassword,
    forgotPassword,
    getComponentOfUserInLink,
    changeInformation,
    changePassword
}

function login(user){
    return dispatch => {
        dispatch({type: AuthConstants.LOGIN_REQUEST});
        AuthService.login(user)
            .then(res => {
                setStorage('jwt', res.data.content.token);
                if(res.data.content.user.roles.length > 0) 
                    setStorage('currentRole', res.data.content.user.roles[0].roleId._id);

                dispatch({
                    type: AuthConstants.LOGIN_SUCCESS,
                    payload: res.data.content.user
                })
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGIN_FAILE, payload: err.response.data});
            })
    }
}

function logout(){
    return dispatch => {
        dispatch({type: AuthConstants.LOGOUT_REQUEST});
        AuthService.logout()
            .then(res => {
                dispatch({type: AuthConstants.LOGOUT_SUCCESS});
                dispatch({type: 'RESET'})
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGOUT_FAILE});
            })
    }
}

function logoutAllAccount(){
    return dispatch => {
        dispatch({type: AuthConstants.LOGOUT_ALL_REQUEST});
        AuthService.logoutAllAccount()
            .then(res => {
                dispatch({type: AuthConstants.LOGOUT_ALL_SUCCESS});
                dispatch({type: 'RESET'});
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGOUT_ALL_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function editProfile(data){
    return dispatch => {
        dispatch({type: AuthConstants.EDIT_PROFILE_REQUEST});
        return new Promise((resolve, reject) => {
            AuthService.editProfile(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.EDIT_PROFILE_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({type: AuthConstants.EDIT_PROFILE_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
    }
}

function changeInformation(data){
    return dispatch => {
        dispatch({ type: AuthConstants.CHANGE_USER_INFORMATION_REQUEST});
        return new Promise((resolve, reject) => {
            AuthService.changeInformation(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.CHANGE_USER_INFORMATION_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: AuthConstants.CHANGE_USER_INFORMATION_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
    }
}

function changePassword(data){
    return dispatch => {
        dispatch({ type: AuthConstants.CHANGE_USER_PASSWORD_REQUEST });
        return new Promise((resolve, reject) => {
            AuthService.changePassword(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.CHANGE_USER_PASSWORD_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: AuthConstants.CHANGE_USER_PASSWORD_FAILE });
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
    }
}

function getLinksOfRole(idRole){
    return dispatch => {
        return new Promise((resolve, reject) => {
            AuthService.getLinksOfRole(idRole)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_LINKS_OF_ROLE_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({type: AuthConstants.GET_LINKS_OF_ROLE_FAILE});
                AlertActions.handleAlert(dispatch, err);
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
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({type: AuthConstants.REFRESH_DATA_USER_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function forgotPassword(email){
    return dispatch => {
        dispatch({type: AuthConstants.FORGOT_PASSWORD_REQUEST});
        return new Promise((resolve, reject) => {
            AuthService.forgotPassword(email)
            .then(res => {
                dispatch({
                    type: AuthConstants.FORGOT_PASSWORD_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({type: AuthConstants.FORGOT_PASSWORD_FAILE});
                reject(err);
            })
        });
    }
}

function resetPassword(otp, email, password){
    return dispatch => {
        dispatch({type: AuthConstants.RESET_PASSWORD_REQUEST});
        return new Promise((resolve, reject) => {
            AuthService.resetPassword(otp, email, password)
                .then(res => {
                    dispatch({
                        type: AuthConstants.RESET_PASSWORD_SUCCESS,
                        payload: res.data.content
                    });
                    resolve(res);
                })
                .catch(err => {
                    dispatch({type: AuthConstants.RESET_PASSWORD_FAILE});
                    reject(err);
                })
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
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}
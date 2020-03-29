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
                console.log(err.response)
                dispatch({
                    type: AuthConstants.LOGIN_FAILE,
                    payload: typeof(err.response) !== 'undefined' ? err.response.data : err
                });
            })
    }
}

function logout(){
    return dispatch => {
        AuthService.logout()
            .then(res => {
                dispatch({
                    type: 'RESET'
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}

function logoutAllAccount(){
    return dispatch => {
        AuthService.logoutAllAccount()
            .then(res => {
                dispatch({
                    type: 'RESET'
                })
            })
            .catch(err => {
                console.log(err);
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function editProfile(data){
    return dispatch => {
        return new Promise((resolve, reject) => {
            AuthService.editProfile(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.EDIT_PROFILE_SUCCESS,
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
                console.log("Error: ", err);
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
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
                console.log(err.response);
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
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err.response);
                dispatch({type: AuthConstants.REFRESH_DATA_USER_FAILE});
                AlertActions.handleAlert(dispatch, err);
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
        return new Promise((resolve, reject) => {
            AuthService.resetPassword(otp, email, password)
                .then(res => {
                    dispatch({
                        type: AuthConstants.RESET_PASSWORD_SUCCESS,
                        payload: res.data
                    });
                    resolve(res);
                })
                .catch(err => {
                    console.log("Error: ", err);
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
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err.response);
                dispatch({type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}
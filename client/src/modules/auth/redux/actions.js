import { AuthService } from "./services";
import { AuthConstants } from "./constants";
import {reactLocalStorage} from 'reactjs-localstorage';

export const login = (user) => {
    return dispatch => {
        AuthService.login(user)
            .then(res => {
                localStorage.setItem('id', res.data.user._id);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('name', res.data.user.name);
                localStorage.setItem('email', res.data.user.email);
                reactLocalStorage.setObject('roles', res.data.user.roles);
                reactLocalStorage.setObject('company', res.data.user.company);
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
    localStorage.clear();

    return dispatch => {
        dispatch({
            type: 'RESET_APP'
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
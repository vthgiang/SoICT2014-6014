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
                if(res.data.user.roles.length > 0) localStorage.setItem('currentRole', res.data.user.roles[0]._id);

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
            type: AuthConstants.LOGOUT
        })
    }
}
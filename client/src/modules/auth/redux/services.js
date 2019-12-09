import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const AuthService = {
    login
};

function login(user) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/auth/login`,
        method: 'POST',
        data: user
    };

    return axios(requestOptions);
}
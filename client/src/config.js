import cookies from 'js-cookie';

export const LOCAL_SERVER_API = 'http://localhost:8000';
export const TOKEN_SECRET = 'qlcv';

export const clearStorage = (name) => {
    cookies.remove(name);
};

export const setStorage = (name, value) => {

    cookies.set(name, value, {
        expires: 2
    });
};

export const getStorage = (name) => {
    return cookies.get(name);
}

export const AuthenticateHeader = () => {
    // const token = localStorage.getItem('token');
    const token = cookies.get('auth-token');
    return {
        'auth-token': token
    }
}

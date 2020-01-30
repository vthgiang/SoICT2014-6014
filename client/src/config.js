export const LOCAL_SERVER_API = 'http://127.0.0.1:8000';
export const TOKEN_SECRET = 'qlcv';

export const AuthenticateHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'auth-token': token
    }
}
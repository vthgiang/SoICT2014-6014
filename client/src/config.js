const macaddress = require('macaddress');

export const LOCAL_SERVER_API = 'http://192.168.1.109:8000';
export const TOKEN_SECRET = 'qlcv';

export const AuthenticateHeader = () => {
    const token = localStorage.getItem('token');
    macaddress.one(function (err, mac) {
        console.log("Mac address for this host: %s", mac);  
      });
    return {
        'auth-token': token
    }
}
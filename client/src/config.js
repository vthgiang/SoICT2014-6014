import getBrowserFingerprint from 'get-browser-fingerprint';

export const LOCAL_SERVER_API = 'http://localhost:8000';
export const TOKEN_SECRET = 'qlcv';

export const clearStorage = () => {
    localStorage.clear();
    localStorage.clear();

    return true;
};

export const setStorage = (name='jwt', value) => {
    return localStorage.setItem(name, value);
};

export const getStorage = (name='jwt') => {
    return localStorage.getItem(name);
}

export const AuthenticateHeader = (name='jwt') => {
    const token = getStorage(name);
    const browserFinger = getBrowserFingerprint();
    console.log(browserFinger);
    return {
        'auth-token': token,
        'browser-finger': browserFinger
    }
}

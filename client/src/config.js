import getBrowserFingerprint from 'get-browser-fingerprint';
import Fingerprint2 from 'fingerprintjs2';

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
    const currentRole = getStorage('currentRole');
    const browserFinger = getBrowserFingerprint();
    return {
        'auth-token': token,
        'current-role': currentRole,
        'browser-finger': browserFinger,
        'Content-Type': 'application/json'
    }
}

export const FingerPrint = () => {
    const browserFinger = getBrowserFingerprint();
    return {
        'browser-finger': browserFinger
    }
}

export const AuthenticateHeaderPATCH = (name='jwt') => {
    const token = getStorage(name);
    const curentRole = getStorage('curentRole');
    const browserFinger = getBrowserFingerprint();
    return {
        'auth-token': token,
        'current_role': curentRole,
        'browser-finger': browserFinger,
    }
}

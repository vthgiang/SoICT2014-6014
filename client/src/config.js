import getBrowserFingerprint from 'get-browser-fingerprint';

export const clearStorage = () => {
    localStorage.removeItem("currentRole");
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
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
    const currentRole = getStorage("currentRole");
    const fingerprint = getBrowserFingerprint();
    console.log(fingerprint);
    return {
        'current-page': window.location.pathname,
        'auth-token': token,
        'current-role': currentRole,
        'fingerprint': fingerprint,
        'Content-Type': 'application/json'
    }
}

export const FingerPrint = () => {
    const fingerprint = getBrowserFingerprint();
    return {
        'fingerprint': fingerprint
    }
}

export const AuthenticateHeaderPATCH = (name='jwt') => {
    const token = getStorage(name);
    const currentRole = getStorage("currentRole");
    const fingerprint = getBrowserFingerprint();
    return {
        'current-page': window.location.pathname,
        'auth-token': token,
        'current-role': currentRole,
        'fingerprint': fingerprint,
    }
}

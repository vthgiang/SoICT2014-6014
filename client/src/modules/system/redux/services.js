import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../env';

export const SystemServices = {
    getLogState,
    toggleLogState
};

function getLogState() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/system/get-log-state`,
        method: 'GET'
    };

    return axios(requestOptions);
}

function toggleLogState() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/system/toggle-log-state`,
        method: 'PATCH'
    };

    return axios(requestOptions);
}
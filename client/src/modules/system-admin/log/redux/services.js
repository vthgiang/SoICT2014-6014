import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const LogServices = {
    getLogState,
    toggleLogState
};

function getLogState() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/system-admin/log/logs`,
        method: 'GET',
        headers: AuthenticateHeader()
    }, false, false)
}

function toggleLogState() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/system-admin/log/logs`,
        method: 'PATCH',
        headers: AuthenticateHeader()
    }, false, false)
}
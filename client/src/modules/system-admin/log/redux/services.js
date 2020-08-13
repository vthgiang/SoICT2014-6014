import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const LogServices = {
    backupDatabase,
    restoreDatabase
};

function backupDatabase(params, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/database/backup`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}

function restoreDatabase(params, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/database/restore`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}
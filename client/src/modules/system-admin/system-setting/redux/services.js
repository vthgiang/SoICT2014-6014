import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemSettingServices = {
    backup,
    getRestoreData,
    restore
};

function backup(params=undefined, data=undefined) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/database/backup`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}

function getRestoreData() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/database/restore-data`,
        method: 'GET'
    }, false, true, 'system_admin.company');
}

function restore(params, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/database/restore`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}
import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemSettingServices = {
    backup,
    deleteBackup,
    getRestoreData,
    restore
};

function backup(params=undefined, data=undefined) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/system-setting/backup`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}

function deleteBackup(version) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/system-setting/backup/${version}`,
        method: 'DELETE'
    }, true, true, 'system_admin.company');
}

function getRestoreData() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/system-setting/restore-data`,
        method: 'GET'
    }, false, true, 'system_admin.company');
}

function restore(backupVersion) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/system-setting/restore`,
        method: 'PATCH',
        params: {
            backupVersion
        }
    }, true, true, 'system_admin.company');
}
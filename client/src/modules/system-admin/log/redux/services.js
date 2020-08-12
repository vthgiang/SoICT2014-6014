import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const LogServices = {
    backupDatabase
};

function backupDatabase(params, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/system-admin/system-setting/backup-database/backup`,
        method: 'PATCH',
        params,
        data,
    }, true, true, 'system_admin.company');
}
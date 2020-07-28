import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const RootRoleServices = {
    getAllRootRoles
};

function getAllRootRoles() {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/system-admin/root-role/root-roles`,
        method: 'GET',
    }, false, true, 'system_admin.root_role');
}

import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const RoleDefaultServices = {
    get
};

function get() {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/roles-default-management`,
        method: 'GET',
    }, false, true, 'system_admin.root_role');
}

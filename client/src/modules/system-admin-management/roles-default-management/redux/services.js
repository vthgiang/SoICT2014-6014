import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const RoleDefaultServices = {
    get
};

function get() {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/roles-default-management`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

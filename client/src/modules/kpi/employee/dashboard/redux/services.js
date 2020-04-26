import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {handleResponse} from '../../../../../helpers/handleResponse';
export const dashboardEmployeeKpiSetService = {
    getEmployeeKpiSetByMember,
    getEmployeeKpiSetOfTask,
    getEmployeeKpiSetByUserID
};

/** Lấy tập kpi cá nhân by member */ 
async function getEmployeeKpiSetByMember() {//member
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/user/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Lấy tập kpi cá nhân by user */
function getEmployeeKpiSetByUserID(member) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/user/${member}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

/** Lấy tập kpi cá nhân of task */ 
function getEmployeeKpiSetOfTask(member) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/kpipersonals/task/${member}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

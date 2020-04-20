import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../config';
import jwt from 'jsonwebtoken';
import {handleResponse} from '../../../../helpers/handleResponse';
export const managerKPIPerService = {
    getAllKPIPersonalByMember,
    getAllKPIPersonalOfTask,
    getAllKPIPersonalByUserID
};

// Lấy tất cả kpi cá nhân
async function getAllKPIPersonalByMember() {//member
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/user/${id}`, requestOptions).then(handleResponse);
}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalByUserID(member) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/user/${member}`, requestOptions).then(handleResponse);
}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalOfTask(member) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/kpipersonals/task/${member}`, requestOptions).then(handleResponse);
}

import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
import {handleResponse} from '../../../../helpers/HandleResponse';
export const overviewKpiServices = {
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
    };

    return fetch(`/kpipersonals/user/${id}`, requestOptions).then(handleResponse);
}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalByUserID(member) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`/kpipersonals/user/${member}`, requestOptions).then(handleResponse);
}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalOfTask(member) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`/kpipersonals/task/${member}`, requestOptions).then(handleResponse);
}

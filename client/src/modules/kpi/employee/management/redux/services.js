import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {handleResponse} from '../../../../../helpers/handleResponse';
import { sendRequest } from '../../../../../helpers/requestHelper';
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
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/user/${id}`,
        method: 'GET',
    }, false, true, 'kpi.employee.manager')

}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalByUserID(member) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpipersonals/user/${member}`,
        method: 'GET',
    }, false, true, 'kpi.employee.manager' )
}

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalOfTask(member) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpipersonals/task/${member}`,
        method: 'GET',
    }, false, true, 'kpi.employee.manager')
}

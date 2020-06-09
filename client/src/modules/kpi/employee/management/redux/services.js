import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage
} from '../../../../../config';

import { sendRequest } from '../../../../../helpers/requestHelper';
export const managerKPIPerService = {
    getAllKPIPersonalByMember,
    getAllKPIPersonalOfTask,
    getAllKPIPersonalByUserID,
    getAllKpiSetsOrganizationalUnitByMonth
};

// Lấy tất cả kpi cá nhân
function getAllKPIPersonalByMember() {//member
    var id = getStorage("userId");
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

/**
 * get all kpi sets in organizational unit by month
 * @user : id người dùng
 * @department : id phòng ban
 * @date : ngày trong tháng muốn lấy kpi 
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpipersonals/${user}/${department}/${date}`,
        method: 'GET',
    }, false, true, 'kpi.employee.manager')
}
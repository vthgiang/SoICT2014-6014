import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage
} from '../../../../../config';

import { sendRequest } from '../../../../../helpers/requestHelper';
export const managerKPIPerService = {
    // getAllKPIPersonalByMember,
    // getAllKPIPersonalOfTask,
    // getAllKPIPersonalByUserID,
    getAllKpiSetsOrganizationalUnitByMonth,
    copyEmployeeKPI
};

// Lấy tất cả kpi cá nhân
// function getAllKPIPersonalByMember() {//member
//     var id = getStorage("userId");
//     return sendRequest({
//         url: `${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets/user/${id}`,
//         method: 'GET',
//     }, false, true, 'kpi.employee.manager')

// }

// Lấy tất cả kpi cá nhân
// function getAllKPIPersonalByUserID(member) {
//     return sendRequest({
//         url: `${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets/user/${member}`,
//         method: 'GET',
//     }, false, true, 'kpi.employee.manager' )
// }

// Lấy tất cả kpi cá nhân
// function getAllKPIPersonalOfTask(member) {
//     return sendRequest({
//         url:`${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets/task/${member}`,
//         method: 'GET',
//     }, false, true, 'kpi.employee.manager')
// }

/**
 * get all kpi sets in organizational unit by month
 * @user : id người dùng
 * @department : id phòng ban
 * @date : ngày trong tháng muốn lấy kpi 
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets`,
        method: 'GET',
        params: {
            user: user,
            department: department,
            date: date
        }
    }, false, true, 'kpi.employee.manager')
}

function copyEmployeeKPI(id, unitId, dateOld, dateNew){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets/copy`,
        method: 'POST',
        params: {
            user: id,
            unitId: unitId,
            dateOld: dateOld,
            dateNew: dateNew
        }
    }, true, true, 'kpi.employee.manager');
}
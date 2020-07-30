import { LOCAL_SERVER_API } from '../../../../../env';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const managerKPIPerService = {
    getAllKpiSetsOrganizationalUnitByMonth,
    copyEmployeeKPI
};

/**
 * get all kpi sets in organizational unit by month
 * @user : id người dùng
 * @department : id phòng ban
 * @date : ngày trong tháng muốn lấy kpi 
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            user: user,
            department: department,
            date: date,
            unitKpiSetByEmployeeKpiSetDate: true
        }
    }, false, true, 'kpi.employee.manager')
}
/**
 * Tạo kpi tháng mới từ kpi tháng hiện tại
 * @param {*} id 
 * @param {*} unitId 
 * @param {*} dateOld 
 * @param {*} dateNew 
 */
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
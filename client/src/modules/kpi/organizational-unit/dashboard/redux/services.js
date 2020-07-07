import {
    LOCAL_SERVER_API
} from '../../../../../env';
import { sendRequest} from '../../../../../helpers/requestHelper';

export const dashboardOrganizationalUnitKpiServices = {
    getAllEmployeeKpiInOrganizationalUnit,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetByTime,
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit,
    getAllEmployeeKpiSetInOrganizationalUnit
}

/** Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại */
function getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/employee-kpi-in-organizational-unit/${roleId}`,
        method: 'GET',
        params: { organizationalUnitId: organizationalUnitId, month: month }
    }, false, false)
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
function getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/tasks-of-organizational-unit/${roleId}`,
        method: 'GET',
        params: { organizationalUnitId: organizationalUnitId, month: month }
    }, false, false)
}
 
/** Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị */
function getAllOrganizationalUnitKpiSetByTime(organizationalUnitId, startDate, endDate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set/${organizationalUnitId}/${startDate}/${endDate}`,
        method: 'GET'
    }, false, false)
}

/** Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
function getAllOrganizationalUnitKpiSetByTimeOfChildUnit(roleId, startDate, endDate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set-of-child-organizational-unit/${roleId}/${startDate}/${endDate}`,
        method: 'GET'
    }, false, false)
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
function getAllEmployeeKpiSetInOrganizationalUnit(organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/employee-kpi-set-in-organizational-unit/${organizationalUnitId}/${month}`,
        method: 'GET'
    }, false, false)
}
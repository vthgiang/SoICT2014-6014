import { LOCAL_SERVER_API } from '../../../../../env';
import { sendRequest } from '../../../../../helpers/requestHelper';

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
        url: `${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis`,
        method: 'GET',
        params: {
            roleId: roleId,
            organizationalUnitId: organizationalUnitId,
            month: month,
            employeeKpiCurrent: true
        }
    }, false, false)
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
function getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'get_all_task_of_organizational_unit',
            roleId: roleId,
            organizationalUnitId: organizationalUnitId,
            month: month
        }
    }, false, false)
}

/** Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị */
function getAllOrganizationalUnitKpiSetByTime(organizationalUnitId, startDate, endDate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            organizationalUnitId: organizationalUnitId,
            startDate: startDate,
            endDate: endDate,
        }
    }, false, false)
}

/** Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
function getAllOrganizationalUnitKpiSetByTimeOfChildUnit(roleId, startDate, endDate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            child: 1,
            roleId: roleId,
            startDate: startDate,
            endDate: endDate,
        }
    }, false, false)
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
function getAllEmployeeKpiSetInOrganizationalUnit(organizationalUnitId, month) {
    return sendRequest({
        // url: `${LOCAL_SERVER_API}/kpi/employee/management/employee-kpi-sets`,
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            month: month,
            organizationalUnitId: organizationalUnitId,
            unitKpiSetByMonth: true,
        }
    }, false, false)
}
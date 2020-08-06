import { LOCAL_SERVER_API } from '../../../../../env';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const dashboardOrganizationalUnitKpiServices = {
    getAllEmployeeKpiInOrganizationalUnit,
    getAllEmployeeKpiInChildrenOrganizationalUnit,
    
    getAllEmployeeKpiSetInOrganizationalUnit,

    getAllTaskOfOrganizationalUnit,
    getAllTaskOfChildrenOrganizationalUnit
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

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
function getAllEmployeeKpiSetInOrganizationalUnit(organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            month: month,
            organizationalUnitId: organizationalUnitId,
            unitKpiSetByMonth: true,
        }
    }, false, false)
}

/** Lấy tất cả EmployeeKpis thuộc các đơn vị con của đơn vị hiện tại */
function getAllEmployeeKpiInChildrenOrganizationalUnit(roleId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            roleId: roleId,
            month: month,
            employeeKpiInChildUnit: true
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

/** Lấy tất cả task của các đơn vị con của đơn vị hiện tại */
function getAllTaskOfChildrenOrganizationalUnit(roleId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'get_all_task_of_children_organizational_unit',
            roleId: roleId,
            month: month
        }
    })
}

import {
    LOCAL_SERVER_API
} from '../../../../../env';
import { sendRequest} from '../../../../../helpers/requestHelper';

export const dashboardOrganizationalUnitKpiServices = {
    getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear,
    getAllOrganizationalUnitKpiSetEachYearOfChildUnit,
    getAllEmployeeKpiSetInOrganizationalUnit
}

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
function getAllChildTargetOfOrganizationalUnitKpis(userRoleId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/child-targets/${userRoleId}`,
        method: 'GET'
    }, false, false)
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
function getAllTaskOfOrganizationalUnit(userRoleId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/tasks/${userRoleId}`,
        method: 'GET'
    }, false, false)
}
 
/** Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị */
function getAllOrganizationalUnitKpiSetEachYear(organizationalUnitId, year) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set-each-year/${organizationalUnitId}/${year}`,
        method: 'GET'
    }, false, false)
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
function getAllOrganizationalUnitKpiSetEachYearOfChildUnit(userRoleId, year) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set-each-year-of-child/${userRoleId}/${year}`,
        method: 'GET'
    }, false, false)
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
function getAllEmployeeKpiSetInOrganizationalUnit(userRoleId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/employee-kpi-set-in-organizational-unit/${userRoleId}/${month}`,
        method: 'GET'
    }, false, false)
}
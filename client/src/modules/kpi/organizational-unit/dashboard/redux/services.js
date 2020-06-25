import {
    LOCAL_SERVER_API
} from '../../../../../env';
import { sendRequest} from '../../../../../helpers/requestHelper';

export const dashboardOrganizationalUnitKpiServices = {
    getAllEmployeeKpiInOrganizationalUnit,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear,
    getAllOrganizationalUnitKpiSetEachYearOfChildUnit,
    getAllEmployeeKpiSetInOrganizationalUnit
}

/** Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại */
function getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/employee-kpi-in-organizational-unit/${roleId}`,
        method: 'GET',
        params: { organizationalUnitId: organizationalUnitId }
    }, false, false)
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
function getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/tasks/${roleId}`,
        method: 'GET',
        params: { organizationalUnitId: organizationalUnitId }
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
function getAllOrganizationalUnitKpiSetEachYearOfChildUnit(roleId, year) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set-each-year-of-child/${roleId}/${year}`,
        method: 'GET'
    }, false, false)
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
function getAllEmployeeKpiSetInOrganizationalUnit(roleId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/employee-kpi-set-in-organizational-unit/${roleId}/${month}`,
        method: 'GET'
    }, false, false)
}
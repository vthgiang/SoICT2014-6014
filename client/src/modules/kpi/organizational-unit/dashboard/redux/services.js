import {
    LOCAL_SERVER_API
} from '../../../../../env';
import { sendRequest} from '../../../../../helpers/requestHelper';

export const dashboardOrganizationalUnitKpiServices = {
    getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear
}

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
function getAllChildTargetOfOrganizationalUnitKpis(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/child-targets/${id}`,
        method: 'GET'
    }, false, false)
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
function getAllTaskOfOrganizationalUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/tasks/${id}`,
        method: 'GET'
    }, false, false)
}
 
/** Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị */
function getAllOrganizationalUnitKpiSetEachYear(id, year) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/organizational-unit-kpi-set-each-year/${id}/${year}`,
        method: 'GET'
    }, false, false)
}

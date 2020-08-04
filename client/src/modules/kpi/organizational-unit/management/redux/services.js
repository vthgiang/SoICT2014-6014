import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage
} from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper'
export const managerServices = {
    getAllKPIUnit,
    getChildTargetOfCurrentTarget,
    copyKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(infosearch) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            allOrganizationalUnitKpiSet: 1,
            roleId: infosearch.role,
            status: infosearch.status,
            startDate: infosearch.startDate,
            endDate: infosearch.endDate
        }
    }, false, true, 'kpi.organizational_unit');
}

// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(kpiId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            organizationalUnitKpiSetId: kpiId,
            unitKpiSetByEmployeeKpiSetDate: true,
            type: "getChildTargetOfCurrentTarget"
        }
    }, false, true, 'kpi.organizational_unit');
}

function copyKPIUnit(kpiId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/management/organizational-unit-kpi-sets/${kpiId}/copy`,
        method: 'POST',
        params: {
            idunit: data.idunit,
            datenew: data.datenew,
            creator: data.creator,
        }
    }, true, true, 'kpi.organizational_unit');
}
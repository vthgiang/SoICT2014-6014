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
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/search-kpi`,
        method: 'GET',
        params: {
            roleId: infosearch.role,
            status: infosearch.status,
            startDate: infosearch.startDate,
            endDate: infosearch.endDate
        }
    }, false, true, 'kpi.organizational_unit');
}

// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(kpiId, date) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiId}/child-target`,
        method: 'GET',
        params: {
            date: date
        }
    }, false, true, 'kpi.organizational_unit');
}

function copyKPIUnit(kpiId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiId}/copy-kpi`,
        method: 'POST',
        params: {
            idunit: data.idunit,
            datenew: data.datenew,
            creator: data.creator,
        }
    }, true, true, 'kpi.organizational_unit');
}
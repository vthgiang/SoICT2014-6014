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
    evaluateKPIUnit,
    // getKPIUnits,
    copyKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(infosearch) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits`,
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
        url: `${LOCAL_SERVER_API}/kpiunits/kpi-units/${kpiId}/child-target`,
        method: 'GET',
        params: {
            date: date
        }
    }, false, true, 'kpi.organizational_unit');
}


// Cập nhật dữ liệu cho KPI đơn vị
function evaluateKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/evaluate/${id}`,
        method: 'PUT',
    }, false, true, 'kpi.organizational_unit');
}

function copyKPIUnit(kpiId, data) {
    return sendRequest({

        url: `${LOCAL_SERVER_API}/kpiunits/kpi-units/${kpiId}/copy-kpi`,
        method: 'POST',
        params: {
            idunit: data.idunit,
            dateold: data.dateold,
            datenew: data.datenew,
        }
    }, true, true, 'kpi.organizational_unit');
}
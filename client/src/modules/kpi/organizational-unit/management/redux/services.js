import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage
} from '../../../../../config';
import { sendRequest} from '../../../../../helpers/requestHelper'
export const managerServices = {
    getAllKPIUnit,
    getChildTargetOfCurrentTarget,
    evaluateKPIUnit,
    getKPIUnits,
    copyKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/unit/${id}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');

}

function getKPIUnits(infosearch) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpiunits/all-unit/${infosearch.role}/${infosearch.status}/${infosearch.startDate}/${infosearch.endDate}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');
}
// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(id, date) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/child-target/${id}/${date}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');
}


// Cập nhật dữ liệu cho KPI đơn vị
function evaluateKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/evaluate/${id}`,
        method: 'PUT',
    }, false, true, 'kpi.organizational_unit');
}

function copyKPIUnit(id, idunit, dateold, datenew){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/copykpi/${id}/${idunit}/${dateold}/${datenew}`,
        method: 'POST',
    }, true, true, 'kpi.organizational_unit');
}
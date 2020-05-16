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
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/unit/${id}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');

}

// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(id) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/child-target/${id}`,
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

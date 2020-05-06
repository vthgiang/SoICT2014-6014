import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
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
async function getChildTargetOfCurrentTarget(id) {
    const token= getStorage();
    const verified= await jwt.verify(token, TOKEN_SECRET);
    var id= verified._id;

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

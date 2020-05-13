import {handleResponse} from '../../../../../helpers/handleResponse';
import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest} from '../../../../../helpers/requestHelper'

export const dashboardOrganizationalUnitKpiServices = {
    getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit
}

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
function getAllChildTargetOfOrganizationalUnitKpis(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/childTargets/${id}`,
        method: 'GET'
    }, false)
}

/** Lấy tất cả task của organizationalUnit hiện tại (chỉ lấy phần evaluations của tháng hiện tại) */
function getAllTaskOfOrganizationalUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/tasks/${id}`,
        method: 'GET'
    }, false)
}

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
    getChildTargetOfOrganizationalUnitKpis
}

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
function getChildTargetOfOrganizationalUnitKpis(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/childTargets/${id}`,
        method: 'GET'
    }, false)
}
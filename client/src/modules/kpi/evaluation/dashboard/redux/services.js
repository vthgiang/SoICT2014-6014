import {
    LOCAL_SERVER_API
} from '../../../../../env';

import { sendRequest } from '../../../../../helpers/requestHelper';
export const dashboardEmployeeKpiService = {
    getAllEmployeeKpiSetOfUnit
};

// Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
function getAllEmployeeKpiSetOfUnit(role) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/get-all-employee-kpi/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
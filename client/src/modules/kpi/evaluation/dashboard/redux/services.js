import {
    LOCAL_SERVER_API
} from '../../../../../env';

import { sendRequest } from '../../../../../helpers/requestHelper';
export const dashboardEmployeeKpiService = {
    getAllEmployeeKpiSetOfUnit,
    getAllEmployeeOfUnit,
    getChildrenOfOrganizationalUnitsAsTree
};

// Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
function getAllEmployeeKpiSetOfUnit(role) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/get-all-employee-kpi/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

// Lấy tất cả nhân viên trong đơn vị
function getAllEmployeeOfUnit(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/users/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

// Lấy các đơn vị con của một đơn vị và đơn vị đó
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/organizational-unit/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
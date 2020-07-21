import {
    LOCAL_SERVER_API
} from '../../../../../env';

import { sendRequest } from '../../../../../helpers/requestHelper';
export const dashboardEmployeeKpiService = {
    getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds,
    getAllEmployeeOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree
};

/**
 * Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeKpiSetOfUnitByRole(role) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/roles/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy tất cả nhân viên trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeOfUnitByRole(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/users/roles/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeKpiSetOfUnitByIds(ids) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/organizational-units/${ids}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

/**
 *  Lấy tất cả nhân viên trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeOfUnitByIds(ids) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/users/organizational-units/${ids}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role 
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/organizational-units/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
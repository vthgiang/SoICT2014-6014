import { LOCAL_SERVER_API } from '../../../../../env';
import { getStorage } from '../../../../../config';
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
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/${role}`,
        // url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/roles/${role}`,
        method: 'GET',
        
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy tất cả nhân viên trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeOfUnitByRole(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/users/${role}`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}

/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeKpiSetOfUnitByIds(ids) {  
    let role = getStorage("currentRole");
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/${role}`,
        // url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/employee-kpis/organizational-units/${ids}`,
        method: 'GET',
        params: {
            ids: ids,
        }
    }, false, true, 'kpi.evaluation');
}

/**
 *  Lấy tất cả nhân viên trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeOfUnitByIds(ids) {   
    let role = getStorage("currentRole"); 
    return sendRequest({
        url:`${LOCAL_SERVER_API}/kpi/evaluation/dashboard/users/${role}`,
        method: 'GET',
        params: {
            ids: ids,
        }
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role 
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/organizational-units/${role}/get-as-tree`,
        method: 'GET',
    }, false, true, 'kpi.evaluation');
}
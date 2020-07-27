import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
import { getStorage } from '../../../../config';

export const UserServices = {
    get,
    edit,
    create,
    destroy,
    getRoles,
    getLinkOfRole,
    getAllUserOfCompany,
    getAllUserOfDepartment,
    getAllUserSameDepartment,
    getRoleSameDepartmentOfUser,
    getDepartmentOfUser,
    getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany,
    getAllEmployeeOfUnitByRole,
    getAllEmployeeOfUnitByIds
    
};

function get(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        params,
    }, false, true, 'super_admin.user');
}

/**
 *  Lấy tất cả nhân viên trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeOfUnitByIds(ids) {   
    let role = getStorage("currentRole"); 
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        params: {
            role: role,
            ids: ids
        }
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy tất cả nhân viên trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeOfUnitByRole(role) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET',
        params: {
            role: role
        }
    }, false, true, 'kpi.evaluation');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.user');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'POST',
        data,
    }, true, true, 'super_admin.user');
}

function destroy(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.user');
}

function getRoles() {
    const id = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/roles/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

function getLinkOfRole() {
    const currentRole = getStorage("currentRole");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/links/role/${currentRole}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}
// Lấy tất cả các vai trò cùng phòng ban với người dùng
function getRoleSameDepartmentOfUser(currentRole) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/role/same-department/${currentRole}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

// Lấy tất cả nhân viên của công ty
function getAllUserOfCompany() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/user`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

/** Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ */ 
function getAllUserOfDepartment(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/user/users-of-department/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

// Lấy tất cả nhân viên của một phòng ban kèm theo vai trò của họ
function getAllUserSameDepartment(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/user/same-department/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

function getDepartmentOfUser() {
    const id = getStorage("userId");
    
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/user/${id}/organizational-units`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}
//get all children of an organizational unit and that organizational unit
function getChildrenOfOrganizationalUnitsAsTree(id){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/user/organizational-units/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}
//get all user in organizational unit of company
function getAllUserInAllUnitsOfCompany(){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/user/organizational-units/all/users`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}
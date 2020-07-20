const Role = require('../models/auth/role.model');

/**
 * Kiểm tra vai trò hiện tại của user có được phép sử dụng service hay không?
 * 1. true : nếu có quyền dùng service
 * 2. false : ngược lại
 */
exports.checkServicePermission = async (data, path, method, currentRole) => {
    var result = false;
    var role = await Role.findById(currentRole).populate({ path: 'parents', model: Role }); //tìm thông tin về role này và các role cha của nó
    var roleArr = [role.name].concat(role.parents.map(role => role.name));
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (result === false && element.path === path && element.method === method) {
            for (let i = 0; i < element.roles.length; i++) {
                const role = element.roles[i];
                if (result === true) break;
                for (let j = 0; j < roleArr.length; j++) {
                    const element = roleArr[j];
                    if (result === true) break;
                    if (element === role) {
                        result = true;
                        break;
                    }
                }
            }
        }
    }

    return result;
}

exports.data = [
    // Authentication
    { path: '/auth/login', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/logout', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/logout-all-account', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/forget-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/reset-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/get-profile/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/profile/:id/change-information', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/profile/:id/change-password', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/get-links-that-role-can-access/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/auth/download-file', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    // Service của riêng Systemadmin
    { path: '/company', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/links', method: 'GET', roles: ['System Admin'] },
    { path: '/company', method: 'POST', roles: ['System Admin'] },
    { path: '/company/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/company/:id', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id', method: 'PATCH', roles: ['System Admin'] },
    { path: '/company/:id/add-new-link', method: 'POST', roles: ['System Admin'] },
    { path: '/company/:id/delete-link/:linkId', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/:id/add-new-component', method: 'POST', roles: ['System Admin'] },
    { path: '/company/:id/delete-component/:componentId', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/:id', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/:id/links-list', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/links-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },
    { path: '/company/:id/components-list', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/components-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },

    { path: '/company/import-file/:type', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/company/import-file', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/company/import-file/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/roles-default-management', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management/categories', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management', method: 'POST', roles: ['System Admin'] },
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin'] },
    { path: '/log/get-log-state', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/log/toggle-log-state', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },


    { path: '/user', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/user', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/:id/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/same-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users-of-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/organizational-units/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/organizational-units/all/users', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },



    { path: '/links-default-management', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/test/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/same-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/company/:idCompany', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/privilege', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/get-links-of-role/:idRole', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/educationPrograms', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/educationPrograms', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/educationPrograms/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/educationPrograms/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/courses', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/courses', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/courses/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/courses/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/employees', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/employees/:userId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/employees/:userId', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/employees', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/employees/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/employees/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/salaries', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/salaries', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/salaries/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/salaries/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/salaries/import', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/timesheets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/timesheets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/timesheets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/timesheets/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/timesheets/import', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/disciplines', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/disciplines', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/disciplines/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/disciplines/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/commendations', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/commendations', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/commendations/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/commendations/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/annualLeaves', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/annualLeaves', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/annualLeaves/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/annualLeaves/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/notifications/get', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/get-notifications', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/paginate-notifications', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/delete-manual-notification/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/delete-notification/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/notifications/readed/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/holidays', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/holidays', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/holidays/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/holidays/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/holidays/import', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/sample/item', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/sample/item', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/sample/item', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/sample/item', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/sample/item/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/documents', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/download-file/:id/:numberVersion', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/download-file-scan/:id/:numberVersion', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/:id/increase-number-view', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/permission-view/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/user-statistical', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/documents/categories', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/categories', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/categories/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/categories/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/categories/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/documents/domains', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/domains', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/domains/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/domains/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/domains/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/domains/delete-many', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/component', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/roles/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/:kpiunit/organizational-unit-kpis/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/:id/:status', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/:id/parent-organizational-unit-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/organizational-unit-kpis', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/organizational-unit-kpis/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/unit/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/all-unit/:role/:status/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/employee-kpi-in-organizational-unit/:roleId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/tasks-of-organizational-unit/:roleId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/organizational-unit-kpi-set/:organizationalUnitId/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/child-target/:id/:date', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/organizational-unit-kpi-set-of-child-organizational-unit/:roleId/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/employee-kpi-set-in-organizational-unit/:organizationalUnitId/:month', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/employee-kpi-in-children-organizational-unit/:roleId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/evaluate/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpiunits/copykpi/:id/:idunit/:dateold/:datenew', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/current/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/kpi-set-by-month/:id/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/status/:id/:status', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/create-target', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/target/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/target/:kpipersonal/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/approve/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/user/:member', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/task/:member', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/:user/:department/:date', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment/:id/:idKPI', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment-comment', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment-comment/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/comment-comment/:id/:idKPI', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/copykpi/:id/:idunit/:dateold/:datenew', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },


    { path: '/kpimembers/all-member/:role/:user/:status/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Employee'] },
    { path: '/kpimembers/user/:member', method: 'GET', roles: ['Dean', 'Employee'] },
    { path: '/kpimembers/:id', method: 'GET', roles: ['Dean', 'Employee'] },
    { path: '/kpimembers/member/:id/:date', method: 'GET', roles: ['Dean'] },
    { path: '/kpimembers/approve/:id', method: 'PUT', roles: ['Dean'] },
    { path: '/kpimembers/target/:id', method: 'PUT', roles: ['Dean'] },
    { path: '/kpimembers/status-target/:id/:status', method: 'PUT', roles: ['Dean'] },
    { path: '/detailkpi/:id', method: 'GET', roles: ['Dean'] },
    { path: '/appovepoint/:id_kpi/:id_target', method: 'PUT', roles: ['Dean'] },
    { path: '/kpimembers/task/:id/:employeeId/:date/:kpiType', method: 'GET', roles: ['Dean'] },
    { path: '/kpimembers/taskImportanceLevel/:id/:kpiType', method: 'PUT', roles: ['Dean'] },
    // Task-management
    { path: '/tasks', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/role/:id/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate/:startDateAfter/:endDateBefore', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/user/task-responsible-bydate/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/archived/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

    { path: '/tasks/edit/task-responsible/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/edit/task-accountable/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/evaluate/task-consulted/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/evaluate/task-responsible/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasks/evaluate/task-accountable/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

    { path: '/tasks/sub-task/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // Perform-task
    { path: '/performtask/log-timer/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/log-timer/currentTimer/:user', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/log-timer/start-timer', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/log-timer/pause-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/log-timer/continue-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/log-timer/stop-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/:task', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    //comment of task action
    { path: '/performtask/action-comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/action-comment/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/action-comment/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    //task action
    { path: '/performtask/task-action', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-action/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-action', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-action/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-action/:id/:idUser', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-action/files/:id/:actionId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    //taskcomment
    { path: '/performtask/task-comment/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-comment/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-comment/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    //comment of task comment
    { path: '/performtask/task-comment/comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-comment/comment/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-comment/comment/:id/:task', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },

    { path: '/performtask/add-result/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/information-task-template/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/information-task-template', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/result-task/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/result-task', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // add task log
    { path: '/performtask/logs/history', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/logs/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // edit task - evaluate task
    { path: '/performtask/edit/task-responsible/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/edit/task-accountable/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/evaluate/task-consulted/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/evaluate/task-responsible/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/evaluate/task-accountable/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Module TaskTemplate
    { path: '/tasktemplates', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/role/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/user', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/:id', method: 'DELETE', roles: ['Dean'] },
    { path: '/tasktemplates/edit/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/importTaskTemplate', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},


    //asset-type
    { path: '/assettype/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/checkTypeNumber/:typeNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    // asset
    { path: '/assets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/updateDepreciation/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/createMaintainanceForIncident/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/createUsage/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/updateUsage/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/deleteUsage/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/createMaintainance/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/updateMaintainance/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/deleteMaintainance/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/createIncident/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/updateIncident/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/deleteIncident/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    //recommend-procure
    { path: '/recommendprocure/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/checkRepairNumber/:recommendNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    //recommend-distribute
    { path: '/recommenddistribute/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/checkRecommendNumber/:recommendNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    // Module DashboardEvaluationEmployeeKpiSet
    { path: '/kpi/evaluation/dashboard/employee-kpis/roles/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/dashboard/users/roles/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/dashboard/employee-kpis/organizational-units/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/dashboard/users/organizational-units/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/dashboard/organizational-units/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // module report management
    { path: '/taskreports', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/taskreports/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/taskreports', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/taskreports/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/taskreports/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee']},

];

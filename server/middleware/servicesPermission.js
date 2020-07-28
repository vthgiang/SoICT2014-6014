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
    { path: '/company/company/companies/companies', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/links', method: 'GET', roles: ['System Admin'] },
    { path: '/company/company/companies/companies/create', method: 'POST', roles: ['System Admin'] },
    { path: '/company/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/company/company/companies/companies/:companyId', method: 'GET', roles: ['System Admin'] },
    { path: '/company/company/companies/companies/:companyId', method: 'PATCH', roles: ['System Admin'] },
    { path: '/company/company/links/company-links/:companyId/add', method: 'POST', roles: ['System Admin'] },
    { path: '/company/company/links/company-links/:companyId/:linkId', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/company/components/company-components/:companyId/add', method: 'POST', roles: ['System Admin'] },
    { path: '/company/company/components/company-components/:companyId/:componentId', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/company/companies/companies/:companyId', method: 'DELETE', roles: ['System Admin'] },
    { path: '/company/company/links/company-links/:companyId', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/links-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },
    { path: '/company/company/components/company-components/:companyId', method: 'GET', roles: ['System Admin'] },
    { path: '/company/:id/components-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },

    { path: '/company/company/import-configuraions/import-file/:type', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/company/company/import-configuraions/import-file/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/company/company/import-configuraions/import-file/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/root-role/root-role/root-roles/root-roles', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management/categories', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management', method: 'POST', roles: ['System Admin'] },
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin'] },
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin'] },
    { path: '/log/log/logs/logs', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/log/log/logs/logs', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },


    { path: '/user/users', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/user/users', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/organizational-units/:id/users', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },


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

    { path: '/role/roles', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/test/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/organizational-units/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/link/links', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/company/:idCompany', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/organizational-units/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/organizational-units/:role/get-as-tree', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/organizational-units', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/organizational-units/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/organizational-units/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/organizational-units/organizational-units/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/privilege/privileges', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/privileges', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/privileges/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/privileges/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/privileges/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/privilege/roles/:idRole/privileges', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

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

    { path: '/documents/documents', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id/download-file', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id/download-file-scan', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/:id/increase-number-view', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/documents/permission-view', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
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

    { path: '/component/components', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/role/:roleId/link/:linkId/components', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:idUnitKpiSet/organizational-unit-kpis/:idUnitKpi', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpis', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpis/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/management/organizational-unit-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/management/organizational-unit-kpi-sets/:id/copy', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/dashboard/organizational-units/get-children-of-organizational-unit-as-tree', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/kpi/employee/creation/employee-kpi-sets/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/kpi-sets-by-month/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpipersonals/kpi-set-of-all-employee-by-month/:organizationalUnitIds/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/status/:id/:status', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis/create-target', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis/target/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis/target/:kpipersonal/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/approve/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets/user/:member', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets/task/:member', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets/:user/:department/:date', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment/:id/:idKPI', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment-comment', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment-comment/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/comment-comment/:id/:idKPI', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets/copykpi/:id/:idunit/:dateold/:datenew', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpis', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets/all-employee-kpi-sets-by-month', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpis/all-employee-kpis-children-by-month', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/management/employee-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets', method: 'GET', roles: ['Dean', 'Vice Dean','Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id', method: 'GET', roles: ['Dean', 'Vice Dean','Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id/edit', method: 'POST', roles: ['Dean', 'Vice Dean'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id', method: 'POST', roles: ['Dean'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/tasks', method: 'GET', roles: ['Dean','Vice Dean'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/set-task-importance-level', method: 'POST', roles: ['Dean'] },

    // Module DashboardEvaluationEmployeeKpiSet
    { path: '/kpi/evaluation/dashboard/employee-kpis', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/dashboard/organizational-units', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Task-management
    { path: '/task/tasks', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/tasks/:taskId', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/tasks', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/tasks/:taskId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // { path: '/task/tasks/:taskId/archived', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/tasks/:taskId/sub-tasks', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/task-evaluations', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // { path: '/task/tasks/organizational-unit/tasks-by-month', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    

    // Perform-task
    { path: '/performtask/tasks/:taskId/timesheet-logs', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/task-timesheet-logs', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/timesheet-logs/start-timer', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/timesheet-logs/stop-timer', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/:task', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/files', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },

    //task action
    { path: '/performtask/tasks/:taskId/task-actions', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId/files/:fileId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },


    //comment of task action
    { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/:commentId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/:commentId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/files/:fileId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },



    //task comment
    { path: '/performtask/tasks/:taskId/task-comments', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/:commentId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/:commentId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/:commentId/files/:fileId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },



    //comment of task comment
    { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/comments/:commentId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments/:childCommentId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments/files/:fileId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },


    { path: '/performtask/add-result/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/information-task-template/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/information-task-template', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/result-task/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/result-task', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // add task log
    { path: '/performtask/tasks/:taskId/logs', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/logs', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    // edit task - evaluate task
    { path: '/performtask/tasks/:taskId', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/performtask/tasks/:taskId/evaluate', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    //task process

    { path: '/taskprocess/diagrams', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskprocess/diagrams/:diagramId', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskprocess/diagrams', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskprocess/diagrams/:diagramId/edit', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Module TaskTemplate
    { path: '/tasktemplates', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/role/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/user', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/:id', method: 'DELETE', roles: ['Dean'] },
    { path: '/tasktemplates/edit/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/tasktemplates/importTaskTemplate', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },


    //asset-type
    { path: '/assettype/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/checkTypeNumber/:typeNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },


    { path: '/assettype', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assettype/types', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/types', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/types/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/types/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/types/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/types/delete-many', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },




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


    // module report management
    { path: '/taskreports', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

];

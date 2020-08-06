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
    { path: '/system-admin/company/companies', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/company/companies', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/company/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId', method: 'PATCH', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId', method: 'DELETE', roles: ['System Admin'] },

    { path: '/system-admin/company/companies/:companyId/links', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId/links', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId/links/:linkId', method: 'DELETE', roles: ['System Admin'] },

    { path: '/system-admin/company/companies/:companyId/components', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId/components', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/company/companies/:companyId/components/:componentId', method: 'DELETE', roles: ['System Admin'] },

    { path: '/system-admin/company/:id/links-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/company/:id/components-paginate/:page/:limit', method: 'POST', roles: ['System Admin'] },

    { path: '/system-admin/company/data-import-configurations', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/company/data-import-configurations', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/company/data-import-configurations/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/system-admin/root-role/root-roles', method: 'GET', roles: ['System Admin'] },

    { path: '/system-admin/system-link/system-links-categories', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/system-link/system-links', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/system-link/system-links', method: 'POST', roles: ['System Admin'] },

    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin'] },
    { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'GET', roles: ['System Admin'] },
    { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'PATCH', roles: ['System Admin'] },
    { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'DELETE', roles: ['System Admin'] },

    { path: '/system-admin/log/logs', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/log/logs', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/links-default-management', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/system-admin/system-component/system-components', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/system-component/system-components', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/components-default-management/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/user/users', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/user/users', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/roles/abc', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/users/:id/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/user/organizational-units/:id/users', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },

    { path: '/role/roles', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/role/roles/test/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/link/links', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/link/links/company/:idCompany', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/organizational-units/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
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
    { path: '/employees/import', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

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
    { path: '/documents/documents/user-statistical', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/documents/document-categories', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-categories', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-categories/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-categories/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-categories/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/documents/document-domains', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-domains', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-domains/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-domains/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-domains/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/documents/document-domains/delete-many', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/component/components', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/component/components/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:idUnitKpiSet/organizational-unit-kpis/:idUnitKpi', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpis', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/creation/organizational-unit-kpis/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/management/organizational-unit-kpi-sets/:id/copy', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/organizational-unit/dashboard/organizational-units/get-children-of-organizational-unit-as-tree', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/kpi/employee/creation/employee-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:id/edit', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:id/status', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis/target/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpis/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/approve/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/childCommentId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/childCommentId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Employee KPI management dashboard
    { path: '/kpi/employee/management/employee-kpi-sets/:id/copy', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    // Employee KPI evaluate 
    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/tasks', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/set-task-importance-level', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Employee KPI evaluate dashboard
    { path: '/kpi/evaluation/dashboard/employee-kpis', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },

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
    { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
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
    { path: '/taskprocess/diagrams/:diagramId', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskprocess/diagrams/:diagramId', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },

    // Module TaskTemplate
    { path: '/task/task-templates', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/task-templates/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/task-templates', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/task-templates/:id', method: 'DELETE', roles: ['Dean'] },
    { path: '/task/task-templates/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/task/task-templates/import', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },


    // Asset-type
    { path: '/assettype/asset-types', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/asset-types', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/asset-types/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/asset-types/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/asset-types/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assettype/asset-types', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },




    // Asset
    { path: '/assets/assets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assets/assets/:id/depreciation', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assets/assets/:id/maintainance-logs', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assets/assets/:id/usage-logs', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/usage-logs', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/usage-logs', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assets/assets/:id/maintainance-logs', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/maintainance-logs', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/maintainance-logs', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    { path: '/assets/assets/:id/incident-logs', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/incident-logs', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/assets/assets/:id/incident-logs', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    // Recommend-procure
    { path: '/recommendprocure/recommend-procurements', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/recommend-procurements', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/recommend-procurements/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommendprocure/recommend-procurements/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },

    
    // Recommend-distribute
    { path: '/recommenddistribute/recommend-distributes', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/recommend-distributes', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/recommend-distributes/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/recommenddistribute/recommend-distributes/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    

    // module report management
    { path: '/taskreports', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee'] },
    { path: '/taskreports/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee'] },

    //material
    { path: '/materials', method: 'GET', roles: ['Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/materials', method: 'POST', roles: ['Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/materials/:id', method: 'DELETE', roles: ['Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/materials/:id', method: 'PATCH', roles: ['Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    // Customer Management
    { path: '/customer', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/customer', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/customer/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/customer/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    { path: '/customer/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    
    // Customer group
    { path: '/customer/group', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
    
    { path: '/customer/liability', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee'] },
];

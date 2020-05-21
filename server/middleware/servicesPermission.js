const Role = require('../models/auth/role.model');

/**
 * Kiểm tra vai trò hiện tại của user có được phép sử dụng service hay không?
 * 1. true : nếu có quyền dùng service
 * 2. false : ngược lại
 */
exports.checkServicePermission = async(data, path, method, currentRole) => {
    var result = false;
    var role = await Role.findById(currentRole).populate({ path: 'parents', model: Role }); //tìm thông tin về role này và các role cha của nó
    var roleArr = [role.name].concat(role.parents.map( role => role.name ));
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(result === false && element.path === path && element.method === method){
            for (let i = 0; i < element.roles.length; i++) {
                const role = element.roles[i];
                if(result === true) break;
                for (let j = 0; j < roleArr.length; j++) {
                    const element = roleArr[j];
                    if(result === true) break;
                    if(element === role){
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
    { path: '/auth/login', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/logout', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/logout-all-account', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/forget-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/reset-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/get-profile/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/profile/:id/change-information', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/profile/:id/change-password', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/get-links-that-role-can-access/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    // Service của riêng Systemadmin
    { path: '/company', method: 'GET', roles: ['System Admin']},
    { path: '/company/:id/links', method: 'GET', roles: ['System Admin']},
    { path: '/company', method: 'POST', roles: ['System Admin']},
    { path: '/company/paginate', method: 'POST', roles: ['System Admin']},
    { path: '/company/:id', method: 'GET', roles: ['System Admin']},
    { path: '/company/:id', method: 'PATCH', roles: ['System Admin']},
    { path: '/company/:id/add-new-link', method: 'POST', roles: ['System Admin']},
    { path: '/company/:id/delete-link/:linkId', method: 'DELETE', roles: ['System Admin']},
    { path: '/company/:id/add-new-component', method: 'POST', roles: ['System Admin']},
    { path: '/company/:id/delete-component/:componentId', method: 'DELETE', roles: ['System Admin']},
    { path: '/company/:id', method: 'DELETE', roles: ['System Admin']},
    { path: '/company/:id/links-list', method: 'GET', roles: ['System Admin']},
    { path: '/company/:id/links-paginate/:page/:limit', method: 'POST', roles: ['System Admin']},
    { path: '/company/:id/components-list', method: 'GET', roles: ['System Admin']},
    { path: '/company/:id/components-paginate/:page/:limit', method: 'POST', roles: ['System Admin']},

    { path: '/roles-default-management', method: 'GET', roles: ['System Admin']},
    { path: '/links-default-management/categories', method: 'GET', roles: ['System Admin']},
    { path: '/links-default-management', method: 'GET', roles: ['System Admin']},
    { path: '/links-default-management', method: 'POST', roles: ['System Admin']},
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin']},
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin']},
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin']},
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin']},
    { path: '/log/get-log-state', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/log/toggle-log-state', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    
    { path: '/user', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/:id/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/same-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/users-of-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/links-default-management', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/links-default-management', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/links-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/links-default-management/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/links-default-management/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/links-default-management/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management/:id', method: 'DELETE' , roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/components-default-management/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/test/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/role/same-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/link/company/:idCompany', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/organizational-units', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/organizational-units', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/organizational-units/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/organizational-units/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/organizational-units/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/privilege', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/get-links-of-role/:idRole', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},        
    
    { path: '/educationProgram', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/course/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/course', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/course/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/course/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/employees/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employees/personals/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employees/personals/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employees', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employees/update/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employees/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/salary/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/checkSalary/:employeeNumber/:month', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/checkArraySalary', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/salary/import', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/discipline/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/discipline/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/discipline/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/discipline/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/praise/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/praise/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/praise/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/praise/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/sabbatical/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sabbatical/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sabbatical/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sabbatical/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/notifications/get', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/get-notifications', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/paginate-notifications', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/delete-manual-notification/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/delete-notification/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},      
    { path: '/notifications/readed/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']}, 
    
    { path: '/holiday', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/sample/item', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/documents/categories', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/categories', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/categories/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/categories/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/categories/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/documents/domains', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/domains', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/domains/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/domains/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/documents/domains/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    { path: '/component', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},        
    { path: '/kpiunits/roles/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:kpiunit/organizational-unit-kpis/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id/:status', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id/parent-organizational-unit-kpi-sets', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/organizational-unit-kpis', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/organizational-unit-kpis/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/unit/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/all-unit/:role/:status/:startDate/:endDate', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/childTargets/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/tasks/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/child-target/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/evaluate/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/current/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/status/:id/:status', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/create-target', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/target/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/target/:kpipersonal/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/approve/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpipersonals/user/:member', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    { path: '/kpimembers/all-member/:role/:user/:status/:startDate/:endDate', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/user/:member', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/:id', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/member/:id/:date', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/approve/:id', method:'PUT', roles: ['Dean']},
    { path: '/kpimembers/target/:id', method: 'PUT', roles: ['Dean']},
    { path: '/kpimembers/status-target/:id/:status', method: 'PUT', roles: ['Dean']},
    { path: '/detailkpi/:id', method: 'GET', roles: ['Dean']},
    { path: '/appovepoint/:id_kpi/:id_target', method: 'PUT', roles: ['Dean']},
    { path: '/kpimembers/task/:id/:employeeId/:date', method: 'GET', roles: ['Dean']},
    // Task-management
    { path: '/tasks/', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/role/:id/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name', method: 'GET', roles:['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    
    // Perform-task
    { path: '/performtask/log-timer/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/currentTimer/:task/:user', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/start-timer', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/pause-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/continue-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/stop-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    //comment of task action
    { path: '/performtask/action-comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/action-comment/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/action-comment/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    //task action
    { path: '/performtask/task-action', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-action/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-action', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-action/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    //taskcomment
    { path: '/performtask/task-comment/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-comment/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-comment/:task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    //comment of task comment
    { path: '/performtask/task-comment/comment/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-comment/comment/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/task-comment/comment/:id/:task', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},

    { path: '/performtask/add-result/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/information-task-template/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/information-task-template', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/result-task/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/result-task', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},

    // Module TaskTemplate
    { path: '/tasktemplates', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/role/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/user', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/:id', method: 'DELETE', roles: ['Dean']},
    { path: '/tasktemplates/edit/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee']},


    //asset type
    { path: '/assettype/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/assettype/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/assettype/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/assettype/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/assettype/checkTypeNumber/:typeNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    // asset
    { path: '/asset/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset/checkAssetNumber/:assetNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset/update/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset/avatar/:assetNumber', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset/file/:assetNumber', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/asset/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    
    //repair-upgrade
    { path: '/repairupgrade/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/repairupgrade/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/repairupgrade/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/repairupgrade/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/repairupgrade/checkRepairNumber/:repairNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    //distribute-transfer
    { path: '/distributetransfer/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/distributetransfer/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/distributetransfer/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/distributetransfer/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/distributetransfer/checkDistributeNumber/:distributeNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    //recommend-procure
    { path: '/recommendprocure/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/recommendprocure/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/recommendprocure/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/recommendprocure/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/recommendprocure/checkRepairNumber/:recommendNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    //recommend-distribute
    // { path: '/recommenddistribute/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    // { path: '/recommenddistribute/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    // { path: '/recommenddistribute/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    // { path: '/recommenddistribute/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    // { path: '/recommenddistribute/checkRecommendNumber/:recommendNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    // Module DashboardEvaluationEmployeeKpiSet
    { path: '/kpi/evaluation/dashboard/employee-kpis/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/kpi/evaluation/dashboard/users/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/kpi/evaluation/dashboard/organizational-units/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    
];

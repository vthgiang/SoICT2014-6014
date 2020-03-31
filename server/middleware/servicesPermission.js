const Role = require('../models/role.model');

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
                        // await console.log("CHECKED: ", data[index]);
                        break;
                    }
                }
            }
        }
    }
    // await console.log("permission service: ", path);
    // await console.log("result: ", result);
    
    return result;
}

exports.data = [
    // Authentication
    { path: '/auth/get-links-of-role/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/profile/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/profile/:id/change-information', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/profile/:id/change-password', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},

    // Service của riêng Systemadmin
    { path: '/roles-default-management', method: 'GET', roles: ['System Admin']},
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
    
    { path: '/user/same-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/user/users-of-department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/login', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/logout', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/logout-all-account', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/forgot-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/auth/reset-password', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/company', method: 'GET', roles: ['System Admin']},
    { path: '/company', method: 'POST', roles: ['System Admin']},
    { path: '/company/paginate', method: 'POST', roles: ['System Admin']},
    { path: '/company/:id', method: 'GET', roles: ['System Admin']},
    { path: '/company/:id', method: 'PATCH', roles: ['System Admin']},
    { path: '/company/:id', method: 'DELETE', roles: ['System Admin']},
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
    { path: '/department', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/department', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/department/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/department/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/department/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/department/department-of-user/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/privilege/get-links-of-role/:idRole', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},        
    { path: '/educationProgram/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram/:numberEducation', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/educationProgram/:numberEducation', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/checkMSNV/:employeeNumber', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/checkEmail/:email', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/:email', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/:email', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/update/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/avatar/:employeeNumber', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/contract/:employeeNumber', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},        
    { path: '/employee/certificateShort/:employeeNumber', method: 'PATCH' ,roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/certificate/:employeeNumber', method: 'PATCH' , roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/file/:employeeNumber', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/employee/checkArrayMSNV', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
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
    { path: '/notifications', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/receivered/:userId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/sent/:userId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/notifications/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},   
    { path: '/notifications/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},  
    { path: '/notifications/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},      
    { path: '/holiday', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/holiday/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/sample/item/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/document/document', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/document/document', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/document/document', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/document/document', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/document/document/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/paginate', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'PATCH', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/component/role/:roleId/link/:linkId', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},        
    { path: '/kpiunits/current-unit/role/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/target/:kpiunit/:id', method: 'DELETE', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/status/:id/:status', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/parent/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/create-target', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/target/:id', method: 'PUT', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/create', method: 'POST', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
    { path: '/kpiunits/unit/:id', method: 'GET', roles: ['System Admin', 'Super Admin', 'Admin', 'Dean', 'Vice Dean', 'Employee']},
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
    
    { path: '/kpimembers/all-member/:role/:user/:status/:starttime/:endtime', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/user/:member', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/:id', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers//member/:id/:time', method: 'GET', roles: ['Dean']},
    { path: '/kpimembers/approve/:id', method:'PUT', roles: ['Dean']},
    { path: '/kpimembers/target/:id', method: 'PUT', roles: ['Dean']},
    { path: '/kpimembers/status-target/:id/:status', method: 'PUT', roles: ['Dean']},
    // Task-management
    { path: '/tasks/', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/role/:id/:role', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-responsible/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-accounatable/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-consulted/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-creator/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/user/task-informed/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', method: 'GET', roles:['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasks/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    
    // Perform-task
    { path: '/performtask/log-timer/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/currentTimer/:task/:user', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/start-timer', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/pause-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/continue-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/log-timer/stop-timer/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    
    { path: '/performtask/comment-task/:task', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/comment-task/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/comment-task/:id', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/comment-task/:id', method: 'DELETE', roles: ['Dean', 'Vice Dean', 'Employee']},
    
    { path: '/performtask/add-result/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/information-task-template/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/information-task-template', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/result-task/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/performtask/result-task', method: 'PUT', roles: ['Dean', 'Vice Dean', 'Employee']},

    // Module TaskTemplate
    { path: '/tasktemplates', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/role/:id', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/user/:id/:pageNumber/:noResultsPerPage/:unit', method: 'GET', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/create', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/:id', method: 'DELETE', roles: ['Dean']},
    { path: '/tasktemplates/test', method: 'POST', roles: ['Dean', 'Vice Dean', 'Employee']},
    { path: '/tasktemplates/edit/:id', method: 'PATCH', roles: ['Dean', 'Vice Dean', 'Employee']},
    
];

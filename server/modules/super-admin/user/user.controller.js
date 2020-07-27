const UserService = require('./user.service');
const { LogInfo, LogError } = require('../../../logs');
const { Console } = require('winston/lib/winston/transports');

exports.getUsers = async (req, res) => {
    try {
        var users = await UserService.getUsers(req.user.company._id, req.query);

        LogInfo(req.user.email, 'GET_USERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_users_success'],
            content: users
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_USERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_users_faile'],
            content: error
        })
    }
};

exports.createUser = async (req, res) => {
    try {
        var user = await UserService.createUser(req.body, req.user.company._id);
        await UserService.addRolesForUser(user._id, req.body.roles);
        var result = await UserService.getUser(user._id);

        LogInfo(req.user.email, 'CREATE_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_user_success'],
            content: result
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_user_faile'],
            content: error
        })
    }
};

exports.getUser = async (req, res) => {
    console.log("ádasdsadasdasdas")
    try {
        var user = await UserService.getUser(req.params.id);
        LogInfo(req.user.email, 'SHOW_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_user_success'],
            content: user
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_user_faile'],
            content: error
        })
    }
};

exports.editUser = async (req, res) => {
    try {
        var user = await UserService.editUser(req.params.id, req.body);
        await UserService.editRolesForUser(user._id, req.body.roles);
        var result = await UserService.getUser(user._id);
        
        LogInfo(req.user.email, 'EDIT_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_user_success'],
            content: result
        });
    } catch (error) {
        console.log("errrr: ", error)
        LogError(req.user.email, 'EDIT_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_user_faile'],
            content: error
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        var deleteUser = await UserService.deleteUser(req.params.id);

        LogInfo(req.user.email, 'DELETE_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_user_success'],
            content: deleteUser
        });
    } catch (error) {

        LogError(req.user.email, 'DELETE_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_user_faile'],
            content: error
        });
    }
};

// exports.getAllUsersInSameOrganizationalUnitWithUserRole = async (req, res) => {
//     try {
//         const users = await UserService.getAllUsersInSameOrganizationalUnitWithUserRole(req.params.id);

//         LogInfo(req.user.email, 'GET_USERS_SAME_DEPARTMENT', req.user.company);
//         res.status(200).json({
//             success: true,
//             messages: ['get_users_same_department_success'],
//             content: users
//         })
//     } catch (error) {
        
//         LogError(req.user.email, 'GET_USERS_SAME_DEPARTMENT', req.user.company);
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['get_users_same_department_faile'],
//             content: error
//         })
//     }
// }

// /** Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ */
// exports.getAllUsersInOrganizationalUnit = async (req, res) => {
//     try {
//         const users = await UserService.getAllUsersInOrganizationalUnit(req.params.id);

//         LogInfo(req.user.email, 'GET_USERS_OF_DEPARTMENT', req.user.company);
//         res.status(200).json({
//             success: true,
//             messages: ['get_users_of_department_success'],
//             content: users
//         })
//     } catch (error) {
        
//         LogError(req.user.email, 'GET_USERS_OF_DEPARTMENT', req.user.company);
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['get_users_of_department_faile'],
//             content: error
//         })
//     }
// }

exports.getOrganizationalUnitsOfUser = async (req, res) => {
    try {
        const department = await UserService.getOrganizationalUnitsOfUser(req.params.id);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_department_of_user_success'],
            content: department
        });
    } catch (error) {

        await LogError(req.user.email, 'GET_DEPARTMENT_OF_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_of_user_faile'],
            content: error
        });
    }
}

exports.getAllUserInUnitAndItsSubUnits = async (req, res) => {
    try {
        var users = await UserService.getAllUserInUnitAndItsSubUnits(req.user.company._id, req.params.id);
        await LogInfo(req.user.email, `Get all user of this unit and its sub units ${req.body.name}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_user_of_this_unit_and_its_sub_units_success'],
            content: users
        });
    } catch (error) {
        await LogError(req.user.email, `Get all user of this unit and its sub units ${req.body.name}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_user_of_this_unit_and_its_sub_units_failed'],
            content: error
        });
    }
}
// exports.getAllUserInAllDepartmentsOfCompany = async (req, res) => {
//     try {
//         var users = await UserService.getAllUserInUnitAndItsSubUnits(req.user.company._id, '-1',true);
//         await LogInfo(req.user.email, `Get all user in all department of this company  ${req.user.company}`, req.user.company);
//         res.status(200).json({
//             success: true,
//             messages: ['get_all_user_in_all_department_success'],
//             content: users
//         });
//     } catch (error) {
//         await LogError(req.user.email, `get all user in all department of this company ${req.body.name}`, req.user.company);
//         res.status(400).json({
//             success: false,
//             messages: ['get_all_user_in_all_department_failed'],
//             content: error
//         });
//     }
// }


 
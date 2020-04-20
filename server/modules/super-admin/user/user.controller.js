const UserService = require('./user.service');
const { LogInfo, LogError } = require('../../../logs');

exports.getAllUsers = async (req, res) => {
    try {
        var users = await UserService.getAllUsers(req.user.company._id);

        LogInfo(req.user.email, 'GET_USERS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_users_success',
            content: users
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_USERS', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        })
    }
};

exports.getPaginatedUsers = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var users = await UserService.getPaginatedUsers(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        LogInfo(req.user.email, 'PAGINATE_USERS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'paginate_users_success',
            content: users
        });
    } catch (error) {
        
        LogError(req.user.email, 'PAGINATE_USERS', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        var user = await UserService.createUser(req.body, req.user.company._id);
        await UserService.addRolesForUser(user._id, req.body.roles);
        var result = await UserService.getUserById(user._id);

        LogInfo(req.user.email, 'CREATE_USER', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_user_success',
            content: result
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_USER', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        })
    }
};

exports.getUserById = async (req, res) => {
    try {
        var user = await UserService.getUserById(req.params.id);

        LogInfo(req.user.email, 'SHOW_USER', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_user_success',
            content: user
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_USER', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        })
    }
};

exports.editUser = async (req, res) => {
    try {
        var user = await UserService.editUser(req.params.id, req.body);
        await UserService.editRolesForUser(user._id, req.body.roles);
        var result = await UserService.getUserById(user._id);
        
        LogInfo(req.user.email, 'EDIT_USER', req.user.company);
        res.status(200).json({
            success: true,
            message: 'edit_user_success',
            content: result
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_USER', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        var deleteUser = await UserService.deleteUser(req.params.id);

        LogInfo(req.user.email, 'DELETE_USER', req.user.company);
        res.status(200).json({
            success: true,
            message: 'delete_user_success',
            content: deleteUser
        });
    } catch (error) {

        LogError(req.user.email, 'DELETE_USER', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getAllUsersInSameOrganizationalUnitWithUserRole = async (req, res) => {
    try {
        const users = await UserService.getAllUsersInSameOrganizationalUnitWithUserRole(req.params.id);

        LogInfo(req.user.email, 'GET_USERS_SAME_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_users_same_department_success',
            content: users
        })
    } catch (error) {
        
        LogError(req.user.email, 'GET_USERS_SAME_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

exports.getAllUsersInOrganizationalUnit = async (req, res) => {
    try {
        const users = await UserService.getAllUsersInOrganizationalUnit(req.params.id);

        LogInfo(req.user.email, 'GET_USERS_OF_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_users_of_department_success',
            content: users
        })
    } catch (error) {
        
        LogError(req.user.email, 'GET_USERS_OF_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        })
    }
}
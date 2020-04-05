const UserService = require('./user.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var users = await UserService.get(req.user.company._id);

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
            message: error.message !== undefined ? error.message : 'get_users_faile',
            content: error
        })
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var users = await UserService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

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
            message: error.message !== undefined ? error.message : 'paginate_users_faile',
            content: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        var user = await UserService.create(req.body, req.user.company._id);
        await UserService.addRolesForUser(user._id, req.body.roles);
        var result = await UserService.getById(user._id);

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
            message: error.message !== undefined ? error.message : 'create_user_faile',
            content: error
        })
    }
};

exports.show = async (req, res) => {
    try {
        var user = await UserService.getById(req.params.id);

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
            message: error.message !== undefined ? error.message : 'show_user_faile',
            content: error
        })
    }
};

exports.edit = async (req, res) => {
    try {
        var user = await UserService.edit(req.params.id, req.body);
        await UserService.editRolesForUser(user._id, req.body.roles);
        var result = await UserService.getById(user._id);
        
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
            message: error.message !== undefined ? error.message : 'edit_user_faile',
            content: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var deleteUser = await UserService.delete(req.params.id);

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
            message: error.message !== undefined ? error.message : 'delete_user_faile',
            content: error
        });
    }
};

exports.getUsersSameDepartment = async (req, res) => {
    try {
        const users = await UserService.getUsersSameDepartment(req.params.id);

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
            message: error.message !== undefined ? error.message : 'get_users_same_department_faile',
            content: error
        })
    }
}

exports.getUsersOfDepartment = async (req, res) => {
    try {
        const users = await UserService.getUsersOfDepartment(req.params.id);

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
            message: error.message !== undefined ? error.message : 'get_users_of_department_faile',
            content: error
        })
    }
}
const CategoryService = require('./category.service');
const { LogInfo, LogError } = require(SERVER_LOGS_DIR);

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getCategories(req.user.company._id, req.query);
        LogInfo(req.user.email, 'GET_CATEGORIES', req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: categories
        });
    }
    catch(error) {
        LogError(req.user.email, 'GET_CATEGORIES', req.user.company)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        });
    }
}
exports.getCategoriesByType = async (req, res) => {
    try {
        const categories = await CategoryService.getCategoriesByType(req.user.company._id, req.query);
        LogInfo(req.user.email, 'GET_CATEGORIES', req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: categories
        });
    }
    catch(error) {
        LogError(req.user.email, 'GET_CATEGORIES', req.user.company)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        });
    }
}
exports.createCategory = async (req, res) => {
    try{
        let category = await CategoryService.createCategory(req.user.company._id, req.body);

        LogInfo(req.user.email, 'CREATE_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: category
        });
    } catch(error) {
        console.log(error);
        LogError(req.user.email, 'CREATE_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_faile'],
            content: error
        });
    }
}
exports.getCategory = async (req, res) => {
    try {
        let category = await CategoryService.getCategory(req.params.id);

        LogInfo(req.user.email, 'GET_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: category
        });
    } catch(error) {
        LogError(req.user.email, 'GET_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        })
    }
}
exports.editCategory = async (req, res) => {
    try {
        let category = await CategoryService.editCategory(req.params.id, req.body);
        console.log(req.params.id)
        LogInfo(req.user.email, 'EDIT_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: category
        });
    } catch(error) {
        console.log(error)
        LogError(req.user.email, 'EDIT_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_faile'],
            content: error
        });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const category = await CategoryService.deleteCategory(req.params.id);

        LogInfo(req.user.email, 'DELETE_CATEGORY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: category
        });
    } catch(error) {
        LogError(req.user.email, 'DELETE_CATEGORY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error
        })
    }
}

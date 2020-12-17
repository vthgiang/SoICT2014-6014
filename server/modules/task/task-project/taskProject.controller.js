const TaskProjectService = require('./taskProject.service');
const Logger = require('../../../logs');

exports.get = async (req, res) => {
    try {
        let tp = await TaskProjectService.get(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_task_project_faile'],
            content: error
        })
    }
}

exports.show = async (req, res) => {
    try {
        let tp = await TaskProjectService.show(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['show_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'show_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_task_project_faile'],
            content: error
        })
    }
}

exports.create = async (req, res) => {
    try {console.log("create task project")
        let tp = await TaskProjectService.create(req.portal, req.body);

        await Logger.info(req.user.email, 'create_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'create_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_task_project_faile'],
            content: error
        })
    }
}

exports.edit = async (req, res) => {
    try {
        let tp = await TaskProjectService.edit(req.portal, req.params.id, req.body);

        await Logger.info(req.user.email, 'edit_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'edit_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_task_project_faile'],
            content: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let tp = await TaskProjectService.delete(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_task_project_faile'],
            content: error
        })
    }
}
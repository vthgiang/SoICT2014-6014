const ProjectService = require('./project.service');
const Logger = require('../../logs');

exports.get = async (req, res) => {
    try {
        let tp = await ProjectService.get(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_project_faile', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_task_project_faile'],
            content: error
        })
    }
}

exports.show = async (req, res) => {
    try {
        let tp = await ProjectService.show(req.portal, req.params.id);

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
    try {
        const project = await ProjectService.create(req.portal, req.body);
        await Logger.info(req.user.email, 'create_task_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_project_success'],
            content: project
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' create_task_project_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_task_project_faile'],
            content: error
        })
    }
}

exports.edit = async (req, res) => {
    try {
        const project = await ProjectService.edit(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'edit_task_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_task_project_success'],
            content: project
        });
    } catch (error) {
        await Logger.error(req.user.email, ' edit_task_project_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_project_faile'],
            content: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let tp = await ProjectService.delete(req.portal, req.params.id);

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

exports.getMembersWithScore = async (req, res) => {
    try {
        let tp = await ProjectService.getMembersWithScore(req.portal, req.params.id, req.params.evalMonth);

        await Logger.info(req.user.email, 'get_members_with_score', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_members_with_score_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_members_with_score', error);
        await Logger.error(req.user.email, 'get_members_with_score', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_members_with_score_faile'],
            content: error
        })
    }
}


exports.getListTasksEval = async (req, res) => {
    console.log(req.params)
    try {
        let tp = await ProjectService.getListTasksEval(req.portal, req.params.id, req.params.evalMonth);

        await Logger.info(req.user.email, 'get_list_tasks_eval', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_list_tasks_eval_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_list_tasks_eval', error);
        await Logger.error(req.user.email, 'get_list_tasks_eval', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_list_tasks_eval_faile'],
            content: error
        })
    }
}

exports.getSalaryMembers = async (req, res) => {
    try {
        let tp = await ProjectService.getSalaryMembers(req.portal, req.body.data);

        res.status(200).json({
            success: true,
            messages: ['get_salary_members_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_salary_members', error);
        await Logger.error(req.user.email, 'ge_salary_members', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_salary_members_faile'],
            content: error
        })
    }
}
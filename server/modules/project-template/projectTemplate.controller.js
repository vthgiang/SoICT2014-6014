const ProjectTemplateService = require('./projectTemplate.service');
const Logger = require('../../logs');

exports.get = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.get(req.portal, req.query);

        await Logger.info(req.user.email, 'get_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_project_template_success'],
            content: tp
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'get_project_template_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_project_template_fail'],
            content: error
        })
    }
}

exports.show = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.show(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['show_project_template_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'show_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_project_template_fail'],
            content: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        const project = await ProjectTemplateService.create(req.portal, req.body);
        await Logger.info(req.user.email, 'create_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_project_template_success'],
            content: project
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' create_project_template_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_project_template_fail'],
            content: error
        })
    }
}

exports.edit = async (req, res) => {
    try {
        const project = await ProjectTemplateService.edit(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'edit_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_project_template_success'],
            content: project
        });
    } catch (error) {
        await Logger.error(req.user.email, ' edit_project_template_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_project_template_fail'],
            content: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.delete(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_project_template_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_project_template_fail'],
            content: error
        })
    }
}

exports.getMembersWithScore = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.getMembersWithScore(req.portal, req.params.id, req.params.evalMonth);

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
            messages: Array.isArray(error) ? error : ['get_members_with_score_fail'],
            content: error
        })
    }
}


exports.getListTasksEval = async (req, res) => {
    console.log(req.params)
    try {
        let tp = await ProjectTemplateService.getListTasksEval(req.portal, req.params.id, req.params.evalMonth);

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
            messages: Array.isArray(error) ? error : ['get_list_tasks_eval_fail'],
            content: error
        })
    }
}

exports.getSalaryMembers = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.getSalaryMembers(req.portal, req.body.data);

        res.status(200).json({
            success: true,
            messages: ['get_salary_members_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_salary_members', error);
        await Logger.error(req.user.email, 'get_salary_members', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_salary_members_fail'],
            content: error
        })
    }
}

exports.createProjectChangeRequest = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.createProjectChangeRequest(req.portal, req.body);

        res.status(200).json({
            success: true,
            messages: ['create_project_change_request_success'],
            content: tp
        });
    } catch (error) {
        console.log('create_project_change_request', error);
        await Logger.error(req.user.email, 'create_project_change_request', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_project_change_request_fail'],
            content: error
        })
    }
}

exports.getListProjectChangeRequests = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.getListProjectChangeRequests(req.portal, req.query);

        res.status(200).json({
            success: true,
            messages: ['get_list_project_change_requests_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_list_project_change_requests', error);
        await Logger.error(req.user.email, 'get_list_project_change_requests', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_list_project_change_requests_fail'],
            content: error
        })
    }
}

exports.updateStatusProjectChangeRequest = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.updateStatusProjectChangeRequest(req.portal, req.query.id, req.query.status);

        res.status(200).json({
            success: true,
            messages: ['update_status_project_change_request_success'],
            content: tp
        });
    } catch (error) {
        console.log('update_status_project_change_request', error);
        await Logger.error(req.user.email, 'update_status_project_change_request', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['update_status_project_change_request_fail'],
            content: error
        })
    }
}

exports.updateListProjectChangeRequests = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.updateListProjectChangeRequests(req.portal, req.body);

        res.status(200).json({
            success: true,
            messages: ['update_list_project_change_requests_success'],
            content: tp
        });
    } catch (error) {
        console.log('update_list_project_change_requests', error);
        await Logger.error(req.user.email, 'update_list_project_change_requests', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['update_list_project_change_requests_fail'],
            content: error
        })
    }
}
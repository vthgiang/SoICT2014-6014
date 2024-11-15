const ProjectService = require('./project.service');
const Logger = require('../../../logs');

/** 
 *  Lấy thông tin dự án
 */
exports.get = async (req, res) => {
    try {
        let tp = await ProjectService.get(req.portal, req.query, req.user);

        await Logger.info(req.user.email, 'get_task_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_project_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_project_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_task_project_fail'],
            content: error
        })
    }
}

/**
 *  Xem thông tin
 */

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
            messages: Array.isArray(error) ? error : ['show_task_project_fail'],
            content: error
        })
    }
}

/** 
 * Tạo dự án mới
 */
exports.create = async (req, res) => {
    try {
        const project = await ProjectService.create(req.portal, req.body, req.user.company._id);
        await Logger.info(req.user.email, 'create_task_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_project_success'],
            content: project
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' create_task_project_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_task_project_fail'],
            content: error
        })
    }
}

/**
 * Thay đổi thông tin dự án
*/
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
        await Logger.error(req.user.email, ' edit_task_project_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_project_fail'],
            content: error
        })
    }
}

/**
 * Xoá dự án
 */
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
            messages: Array.isArray(error) ? error : ['delete_task_project_fail'],
            content: error
        })
    }
}

/**
 * Lấy điểm các thành viên 
 */
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
            messages: Array.isArray(error) ? error : ['get_members_with_score_fail'],
            content: error
        })
    }
}

/**
 * Lấy danh sách các đánh giá 
 */
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
            messages: Array.isArray(error) ? error : ['get_list_tasks_eval_fail'],
            content: error
        })
    }
}

/**
 * Lấy lương nhân viên
 */
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
        await Logger.error(req.user.email, 'get_salary_members', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_salary_members_fail'],
            content: error
        })
    }
}

/**
 * Tạo yêu cầu thay đổi dự án
 */
exports.createProjectChangeRequest = async (req, res) => {
    try {
        let tp = await ProjectService.createProjectChangeRequest(req.portal, req.body);

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

/**
 * Lấy danh sách các thay đổi dự án
 */
exports.getListProjectChangeRequests = async (req, res) => {
    try {
        let tp = await ProjectService.getListProjectChangeRequests(req.portal, req.query);

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

/**
 * Cập nhật trạng thái cho các yêu cầu thay đổi
 */
exports.updateStatusProjectChangeRequest = async (req, res) => {
    try {
        let tp = await ProjectService.updateStatusProjectChangeRequest(req.portal, req.query.id, req.query.status);

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

/**
 * Cập nhật danh sách các yêu cầu thay đổi
 */
exports.updateListProjectChangeRequests = async (req, res) => {
    try {
        let tp = await ProjectService.updateListProjectChangeRequests(req.portal, req.body);

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


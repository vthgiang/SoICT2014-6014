const ProjectPhaseService = require('./projectPhase.service');
const Logger = require('../../../logs');

/** 
 *  Lấy thông tin tất cả giai đoạn theo dự án
 */
exports.getProjectPhase = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.getProjectPhase(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_project_phase_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_project_phase_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_project_phase_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_project_phase_fail'],
            content: error
        })
    }
}

/** 
 *  Lấy thông tin của 1 giai đoạn
 */
 exports.getPhase = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.getPhase(req.portal, req.params.id, req.user._id);

        await Logger.info(req.user.email, 'get_phase_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_phase_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_phase_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_phase_fail'],
            content: error
        })
    }
}

/** 
 *  Tạo giai đoạn mới
 */
exports.createPhase = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.createPhase(req.portal, req.body);

        await Logger.info(req.user.email, 'create_phase_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_phase_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'create_phase_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_phase_fail'],
            content: error
        })
    }
}

/** 
 *  Tạo cột mốc mới
 */
 exports.createMilestone = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.createMilestone(req.portal, req.body);

        await Logger.info(req.user.email, 'create_milestone_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_milestone_success'],
            content: tp
        });
    } catch (error) {
        await Logger.error(req.user.email, 'create_milestone_fail', req.portal)
        console.log(error)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_milestone_fail'],
            content: error
        })
    }
}

/** 
 * Tạo giai đoạn mới trong dự án
 */
exports.createCPMProjectPhase = async (req, res) => {
    try {
        const projectPhase = await ProjectService.createCPMProjectPhase(req.portal, req.body);
        await Logger.info(req.user.email, 'create_phase_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_phase_project_success'],
            content: projectPhase
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' create_phase_project_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_phase_project_fail'],
            content: error
        })
    }
}

/** 
 * Chỉnh sửa thông tin 1 giai đoạn
 */
exports.editPhase = async (req, res) => {
    try {
        const projectPhase = await ProjectPhaseService.editPhase(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'edit_phase_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_phase_success'],
            content: projectPhase
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' edit_phase_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_phase_fail'],
            content: error
        })
    }
}

/**
 * Xoá giai đoạn
 */
exports.deletePhase = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.deletePhase(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_phase', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_phase_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_phase', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_phase_fail'],
            content: error
        })
    }
}

/** 
 *  Lấy thông tin tất cả cột mốc theo dự án
 */
exports.getProjectMilestone = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.getProjectMilestone(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_project_milestone_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_project_milestone_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_project_milestone_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_project_milestone_fail'],
            content: error
        })
    }
}

/** 
 * Chỉnh sửa thông tin 1 cột mốc
 */
exports.editMilestone = async (req, res) => {
    try {
        const projectPhase = await ProjectPhaseService.editMilestone(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'edit_milestone_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_milestone_success'],
            content: projectPhase
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' edit_milestone_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_milestone_fail'],
            content: error
        })
    }
}

/**
 * Xoá cột mốc
 */
exports.deleteMilestone = async (req, res) => {
    try {
        let tp = await ProjectPhaseService.deleteMilestone(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_milestone', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_milestone_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_milestone', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_milestone_fail'],
            content: error
        })
    }
}
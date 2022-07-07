const KpiTemplateService = require('./template.service');
const Logger = require(`../../../logs`);

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu kpi

/**
 * Lấy tất cả mẫu kpi
 *  */
exports.getAllKpiTemplates = async (req, res) => {
    try {
        let data = await KpiTemplateService.getAllKpiTemplates(req.portal, req.query, req.params);

        Logger.info(req.user.email, 'get_all_kpi_templates', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_templates_success'],
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_all_kpi_templates', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_kpi_templates_failure'],
            content: error
        });
    }
}

/**
 * Lấy danh sách mẫu KPI theo tham số
 *  */
exports.getPaginatedKpiTemplates = async (req, res) => {
    try {
        let data = await KpiTemplateService.getPaginatedKpiTemplates(req.portal, req.query);

        // Logger.info(req.user.email, 'get_all_kpi_templates', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_templates_success'],
            content: data
        });
    } catch (error) {

        // Logger.error(req.user.email, 'get_all_kpi_templates', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_kpi_templates_failure'],
            content: error
        });
    }
}

/**
 * Lấy mẫu kpi theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getKpiTemplate = async (req, res) => {
    try {
        let kpiTemplate = await KpiTemplateService.getKpiTemplate(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_kpi_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_template_success'],
            content: kpiTemplate
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_kpi_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_kpi_template_failure'],
            content: error
        });
    }
}


/**
 * Tạo một mẫu kpi
 * @param {*} req 
 * @param {*} res 
 */
exports.createKpiTemplate = async (req, res) => {
    console.log(63)
    try {
        console.log(65)
        // let data = await KpiTemplateService.createKpiTemplate(req.portal, req.body, req.user._id);
        let data = await KpiTemplateService.createKpiTemplate(req.body);
        console.log(67)
        // await Logger.info(req.user.email, 'create_kpi_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_kpi_template_success'],
            content: data
        });
    } catch (error) {
        // await Logger.error(req.user.email, 'create_kpi_template', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_kpi_template_failure'],
            content: error
        });
    }
}

/**
 * Xóa một mẫu kpi
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteKpiTemplate = async (req, res) => {
    try {
        let data = await KpiTemplateService.deleteKpiTemplate(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_kpi_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_kpi_template_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_kpi_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_kpi_template_failure'],
            content: error
        });
    }
}

/**
 * Sửa 1 mẫu kpi
 * @param {*} req 
 * @param {*} res 
 */
exports.editKpiTemplate = async (req, res) => {
    try {
        let data = await KpiTemplateService.editKpiTemplate(req.portal, req.body, req.params.id);

        await Logger.info(req.user.email, 'edit_kpi_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_kpi_template_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'edit_kpi_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_kpi_template_failure'],
            content: error
        });
    }
}


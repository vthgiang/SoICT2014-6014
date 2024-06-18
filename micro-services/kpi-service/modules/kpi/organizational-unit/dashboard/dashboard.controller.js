const Logger = require(`../../../../logs`);
const DashboardOrganizationalUnitService = require('./dashboard.service');

const getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        let tree = await DashboardOrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(req.portal, req.user.company._id, req.query.role);

        await Logger.info(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error,
        });
    }
};

const getAllocationResultUnitKpi = async (request, response) => {
    try {
        const { currentUserUnitId } = request.params;
        const { portal } = request;
        const result = await DashboardOrganizationalUnitService.getAllocationResultUnitKpi(portal, currentUserUnitId);
        response.status(200).json({
            success: true,
            messages: ['get_allocation_result_unit_kpi_success'],
            content: result[0],
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            messages: ['get_allocation_result_unit_kpi_failed'],
            content: error,
        });
    }
};

const handleSaveAllocationResultUnit = async (request, response) => {
    try {
        const { portal } = request;
        // const { payload } = request.body;
        await DashboardOrganizationalUnitService.saveAllocationResultUnitKpi(portal, request.body);
        response.status(200).json({
            success: true,
            messages: ['handle_save_allocation_result_unit_kpi_success'],
            // content: result[0],
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            messages: ['handle_save_allocation_result_unit_kpi_failed'],
            content: error,
        });
    }
};

module.exports = {
    getChildrenOfOrganizationalUnitsAsTree,
    getAllocationResultUnitKpi,
    handleSaveAllocationResultUnit,
};

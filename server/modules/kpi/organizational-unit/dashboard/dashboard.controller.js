const { LogInfo, LogError } = require('../../../../logs');
const DashboardOrganizationalUnitService = require('./dashboard.service');

exports.getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        var tree = await DashboardOrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(req.user.company._id, req.query.role);
        
        await LogInfo(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error
        });
    }
    
};
const DashboardUnitService = require('./dashboardUnit.service');
const Logger = require(`../../logs`);

exports.getAllUnitDashboardData = async (req, res) => {
    try {
        let data = await DashboardUnitService.getAllUnitDashboardData(req.portal, req.query, req.user.company._id);
        await Logger.info(req.user.email, 'get_all_unit_dashboard_data_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_unit_dashboard_data_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error);
        await Logger.error(req.user.email, 'get_all_unit_dashboard_data_fail', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_all_unit_dashboard_data_fail"],
            content: {
                error: error
            }
        });
    }
}
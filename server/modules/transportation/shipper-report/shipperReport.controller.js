const ShipperReportService = require('./shipperReport.service');
const Log = require(`../../../logs`);

// Thêm mới một ví dụ
exports.getAllTaskWithCondition =  async (req, res) => {
    let { userId, roleId } = req.params;
    try {
        data = await ShipperReportService.getAllTaskWithCondition(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_shipper_reports_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_VEHICLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_shipper_reports_fail"],
            content: error.message
        });
    }
}
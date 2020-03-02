const KPIPersonal = require('../../../models/kpi-personal.model');

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (req, res) => {
    try {
        var kpipersonals = await KPIPersonal.find({ creater: { $in: req.params.member.split(",") } })
            .sort({ 'time': 'desc' })
            .populate("unit creater approver")
            .populate({ path: "listtarget"});
        res.json({
            message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
            content: kpipersonals
        });
    } catch (error) {
        res.json({ message: error });
    }
}
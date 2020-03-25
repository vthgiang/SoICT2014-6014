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

// Lấy tất cả KPI cá nhân của người thực hiện trong công việc
exports.getKPIResponsible = async (req, res) => {
    try {
        var kpipersonals = await KPIPersonal.find({ creater: { $in: req.params.member.split(",") }, status: { $ne: 3 } })
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
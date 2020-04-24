const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet } = require('../../../../models/index').schema;

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/** Lấy tập KPI cá nhân hiện tại theo người dùng */ 
exports.getEmployeeKpiSet = async (id) => {
    var kpipersonals = await EmployeeKpiSet.findOne({ creator: id, status: { $ne: 3 } })
            .populate("unit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } });
     return kpipersonals;
}

/** Khởi tạo tập KPI cá nhân */ 
exports.createEmployeeKpiSet = async (creatorId,approverId,unitId,timeId) => {
        // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
        var kpiUnit = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: unitId, status: 1 }).populate("kpis");//status = 1 là kpi đã đc phê duyệt
        
        var defaultKPIUnit;
        if (kpiUnit.kpis) defaultKPIUnit = kpiUnit.kpis.filter(item => item.default !== 0);
        if (defaultKPIUnit !== []) {
            var time = timeId.split("-");
            var date = new Date(time[1], time[0], 0);
        
        // Tạo thông tin chung cho KPI cá nhân
            var kpipersonal = await EmployeeKpiSet.create({
                organizationalUnit: unitId,
                creator: creatorId,
                approver: approverId,
                time: date,
                kpis: []
            });
            var defaultKPIUnit = await Promise.all(defaultKPIUnit.map(async (item) => {
                var defaultT = await EmployeeKpi.create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    status: item.default
                })
                return defaultT._id;
            }));
            kpipersonal = await EmployeeKpiSet.findByIdAndUpdate(
                kpipersonal, { kpis: defaultKPIUnit }, { timestamps: true }
            );
        
            kpipersonal = await kpipersonal.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
            return kpipersonal;
        } else {
            return null;
        }
}

/** Thêm mục tiêu cho KPI cá nhân */ 
exports.createEmployeeKpi = async (nameId,parentId,weightId,criteriaId,kpipersonalId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria
    // Thiết lập mục tiêu cho KPI cá nhân
    var target = await EmployeeKpi.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria:criteriaId
    })

    var kpipersonal = await EmployeeKpiSet.findByIdAndUpdate(
        kpipersonalId, { $push: { kpis: target._id } }, { new: true }
    );
    kpipersonal = await kpipersonal.populate('creator approver unit').populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return kpipersonal;
}

/** Chỉnh sửa mục tiêu của KPI cá nhân */ 
exports.editEmployeeKpi = async (nameId,parentId,weightId,criteriaId,id) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id
    var objUpdate = {
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    }
    var target = await EmployeeKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return target;
}

/** Xóa mục tiêu của KPI cá nhân */ 
exports.deleteEmployeeKpi = async (id,kpipersonalId) => {
    //req.params.id,req.params.kpipersonal
    var target = await EmployeeKpi.findByIdAndDelete(id);
        var kpipersonal = await EmployeeKpiSet.findByIdAndUpdate(kpipersonalId, { $pull: { kpis: id } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return kpipersonal;
}

/** Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */ 
exports.updateEmployeeKpiSetStatus = async (id,statusId) => {
    //req.params.id,req.params.status
    
    var kpipersonal = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        
        return kpipersonal;
}

/** Chỉnh sửa thông tin chung của KPI cá nhân */ 
exports.editEmployeeKpiSet = async (timeId,id) => {
    //req.body.time,req.params.id
    var time = timeId.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpipersonal = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { time: date } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return kpipersonal;
}

/** Xóa toàn bộ KPI cá nhân */ 
exports.deleteEmployeeKpiSet = async (id) => {
    //req.params.id
    var kpis = [];
        var kpipersonal = await EmployeeKpiSet.findById(id);
        if (kpipersonal.kpis) kpis = kpipersonal.kpis;
        if (kpis !== []) {
            kpis = await Promise.all(kpis.map(async (item) => {
                return EmployeeKpi.findByIdAndDelete(item._id);
            }))
        }
        kpipersonal = await EmployeeKpiSet.findByIdAndDelete(id);
        return [kpipersonal,kpis]
}


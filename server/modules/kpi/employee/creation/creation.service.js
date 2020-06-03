const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet } = require('../../../../models/index').schema;

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/** Lấy tập KPI cá nhân hiện tại theo người dùng */ 
exports.getEmployeeKpiSet = async (id) => {
    var employeeKpiSet = await EmployeeKpiSet.findOne({ creator: id, status: { $ne: 3 } })
            .populate("organizationalUnit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } });
     return employeeKpiSet;
}

/** Khởi tạo tập KPI cá nhân */ 
exports.createEmployeeKpiSet = async (creatorId,approverId,organizationalUnitId,dateId) => {
        // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
        var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: organizationalUnitId, status: 1 }).populate("kpis");//status = 1 là kpi đã đc phê duyệt
        
        var defaultOrganizationalUnitKpi;
        if (organizationalUnitKpiSet.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);
        if (defaultOrganizationalUnitKpi !== []) {
            
            var time = dateId.split("-");
            var date = new Date(time[1], time[0], 0);
        
        // Tạo thông tin chung cho KPI cá nhân
            var employeeKpiSet = await EmployeeKpiSet.create({
                organizationalUnit: organizationalUnitId,
                creator: creatorId,
                approver: approverId,
                date: date,
                kpis: []
            });
            var defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
                var defaultT = await EmployeeKpi.create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    status: null,
                    type: item.type
                })
                return defaultT._id;
            }));
            employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
                employeeKpiSet, { kpis: defaultEmployeeKpi }, { new: true }
            );            
            employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();            
            return employeeKpiSet;
        } else { 
            return null;
        }
}

/** Thêm mục tiêu cho KPI cá nhân */ 
exports.createEmployeeKpi = async (nameId,parentId,weightId,criteriaId,employeeKpiSetId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria
    // Thiết lập mục tiêu cho KPI cá nhân
    var employeeKpi = await EmployeeKpi.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    })

    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
        employeeKpiSetId, { $push: { kpis: employeeKpi._id } }, { new: true }
    );
    employeeKpiSet = await employeeKpiSet.populate('creator approver organizationalUnit').populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return employeeKpiSet;
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
    var employeeKpi = await EmployeeKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return employeeKpi;
}

/** Xóa mục tiêu của KPI cá nhân */ 
exports.deleteEmployeeKpi = async (id,employeeKpiSetId) => {
    //req.params.id,req.params.kpipersonal
    var employeeKpi = await EmployeeKpi.findByIdAndDelete(id);
        var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(employeeKpiSetId, { $pull: { kpis: id } }, { new: true });
        employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return employeeKpiSet;
}

/** Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */ 
exports.updateEmployeeKpiSetStatus = async (id,statusId) => {
    //req.params.id,req.params.status
    
    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        
        return employeeKpiSet;
}

/** Chỉnh sửa thông tin chung của KPI cá nhân */ 
exports.editEmployeeKpiSet = async (strDate,id) => {
    var arr = strDate.split("-");
    var date = new Date(arr[1], arr[0], 0)
    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true });
    employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return employeeKpiSet;
}

/** Xóa toàn bộ KPI cá nhân */ 
exports.deleteEmployeeKpiSet = async (id) => {
    //req.params.id
    var kpis = [];
        var employeeKpiSet = await EmployeeKpiSet.findById(id);
        if (employeeKpiSet.kpis) kpis = employeeKpiSet.kpis;
        if (kpis !== []) {
            kpis = await Promise.all(kpis.map(async (item) => {
                return EmployeeKpi.findByIdAndDelete(item._id);
            }))
        }
        employeeKpiSet = await EmployeeKpiSet.findByIdAndDelete(id);
        return [employeeKpiSet,kpis]
}


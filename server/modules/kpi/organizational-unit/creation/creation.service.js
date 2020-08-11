const { OrganizationalUnitKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = require('../../../../models/index').schema;

const overviewService = require('../../employee/management/management.service');

/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getOrganizationalUnitKpiSet = async (query) => {
    let now, currentYear, currentMonth, endOfCurrentMonth, endOfLastMonth;
    if (query.month) {
        now = new Date(query.month);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    } else {
        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    }

    if (!query.organizationalUnitId) {
        var department = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': query.roleId },
                { 'viceDeans': query.roleId },
                { 'employees': query.roleId }
            ]
        });
    } else {
        var department = { '_id': query.organizationalUnitId };
    }

    // Status khác 2 --> chưa kết thúc
    var kpiunit = await OrganizationalUnitKpiSet.findOne({
        organizationalUnit: department._id,
        status: { $ne: 2 }, date: { $lte: endOfCurrentMonth, $gt: endOfLastMonth }
    })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    return kpiunit;
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 * @id Id role người dùng
 */
exports.getParentOrganizationalUnitKpiSet = async (id) => {
    //req.params.id,
    var department = await OrganizationalUnit.findOne({
        $or: [
            { 'deans': id },
            { 'viceDeans': id },
            { 'employees': id }
        ]
    });

    let now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();
    let startOfCurrentMonth = new Date(currentYear, currentMonth);
    let startOfNextMonth = new Date(currentYear, currentMonth + 1);

    var kpiunit = await OrganizationalUnitKpiSet.findOne({
        organizationalUnit: department.parent,
        date: { $gte: startOfCurrentMonth, $lt: startOfNextMonth }
    })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunit;

}

/**
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
 * @query {*} organizationalUnitId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTime = async (roleId, organizationalUnitId, startDate, endDate) => {
    
    let organizationalUnit;
    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        organizationalUnit = { '_id': organizationalUnitId }
    }

    let organizationalUnitKpiSets = await OrganizationalUnitKpiSet.find(
        {
            'organizationalUnit': organizationalUnit._id,
            'date': {
                $gte: startDate,
                $lt: endDate
            }
        },
        { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
    )
    return organizationalUnitKpiSets;
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 * @query {*} roleId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (companyId, query) => {
   
    let childOrganizationalUnitKpiSets = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(companyId, query.roleId);
   
    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        childOrganizationalUnitKpiSets.push(await this.getAllOrganizationalUnitKpiSetByTime(null, childrenOrganizationalUnits[i].id, query.startDate, query.endDate));
        childOrganizationalUnitKpiSets[i].unshift({ 'name': childrenOrganizationalUnits[i].name })
    }

    return childOrganizationalUnitKpiSets;
}



/**
 * Lấy tất cả KPI của đơn vị 
 * @query {*} roleId id chức danh 
 * @query {*} startDate
 * @query {*} endDate 
 * @query {*} status trạng thái của OrganizationalUnitKPISet
 */
exports.getAllOrganizationalUnitKpiSet = async (data) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'deans': data.roleId },
            { 'viceDeans': data.roleId },
            { 'employees': data.roleId }
        ]
    });
    let status = Number(data.status);
    if (data.startDate) {
        let startDate = data.startDate.split("-");
        var startdate = new Date(startDate[1] + "-" + startDate[0] + "-" + "01");
    }
    if (data.endDate) {
        var endDate = data.endDate.split("-");
        if (endDate[0] === "12") {
            endDate[1] = String(parseInt(endDate[1]) + 1);
            endDate[0] = "1";
        }
        endDate[0] = String(parseInt(endDate[0]) + 1);
        var enddate = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
    }
    let keySearch = {
        organizationalUnit: organizationalUnit._id
    };
    if (status !== -1) {
        keySearch = {
            ...keySearch,
            status: status
        };
    }
    if (data.startDate && data.endDate) {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate, "$lt": enddate }
        }
    }
    else if (data.startDate) {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate }
        }
    }
    else if (data.endDate) {
        keySearch = {
            ...keySearch,
            date: { "$lt": enddate }
        }
    }
    var kpiunits = await OrganizationalUnitKpiSet.find(keySearch)
        .skip(0).limit(12).populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunits;
}

/**
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 * @dateString thời gian mới 
 * @id Id của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (dateString, id) => {
    var time = dateString.split("-");
    var date = new Date(time[1], time[0], 0)
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true });
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();

    return organizationalUnitKpiSet;
}


/**
 * Khởi tạo tập KPI đơn vị
 * @data thông tin chung của tập Kpi đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (data) => {
    let dateId = data.date;
    let creatorId = data.creator;
    let organizationalUnitId = data.organizationalUnit;

    let time = dateId.split("-");
    let date = new Date(time[1], time[0], 0);

    let currentMonth = data.date.slice(3, 7) + '-' + data.date.slice(0, 2);
    let nextMonth;
    if (new Number(data.date.slice(0, 2)) < 12) {
        if (new Number(data.date.slice(0, 2)) < 10) {
            nextMonth = data.date.slice(3, 7) + '-0' + (new Number(data.date.slice(0, 2)) + 1);
        } else {
            nextMonth = data.date.slice(3, 7) + '-' + (new Number(data.date.slice(0, 2)) + 1);
        }
    } else {
        nextMonth = (new Number(data.date.slice(3, 7)) + 1) + '-01';
    }
    
    // Tạo thông tin chung cho KPI đơn vị
    let organizationalUnitKpi = await OrganizationalUnitKpiSet.create({
        organizationalUnit: organizationalUnitId,
        creator: creatorId,
        date: date,
        kpis: []
    });

    // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
    let organizationalUnit = await OrganizationalUnit.findById(organizationalUnitId);

    if (organizationalUnit.parent !== null) {
        let organizationalUnitParent = await OrganizationalUnitKpiSet
            .findOne({
                organizationalUnit: organizationalUnit.parent,
                status: 1,
                date: {
                    $gte: currentMonth, $lt: nextMonth
                }
            })
            .populate("kpis");

        let defaultTarget;

        if (organizationalUnitParent.kpis) defaultTarget = organizationalUnitParent.kpis.filter(item => item.type !== 0);//default Target là nhưng mục tiêu có default !== 0
        if (defaultTarget !== []) {
            defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                let defaultT = await OrganizationalUnitKpi.create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    type: item.type
                })
                return defaultT._id;
            }))
            organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                organizationalUnitKpi, { kpis: defaultTarget }, { new: true }
            );
        }
    } else {
        let targetA = await OrganizationalUnitKpi.create({
            name: "Phê duyệt công việc",
            parent: null,
            weight: 5,
            criteria: "Thực hiện tốt vai trò người phê duyệt trong các công việc. Người phê duyệt là người chịu trách nhiệm về thành công/thất bại của công việc",
            type: 1
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetA._id } }, { new: true }
        );
        
        let targetC = await OrganizationalUnitKpi.create({
            name: "Hỗ trợ thực hiện công việc",
            parent: null,
            weight: 5,
            criteria: "Thực hiện tốt vai trò người hỗ trợ (consulted) trong các công việc",
            type: 2
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetC._id } }, { new: true }
        );
    }
    organizationalUnitKpi = await organizationalUnitKpi.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();

    return organizationalUnitKpi;

}

/**
 * Thêm một KPI vào tập KPI đơn vị
 * @data thông tin về KPI cần thêm vào tập KPI đơn vị
 * 
 */
exports.createOrganizationalUnitKpi = async (data) => {
    var target = await OrganizationalUnitKpi.create({
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    })
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(
        data.organizationalUnitKpiSetId, { $push: { kpis: target._id } }, { new: true }
    );
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return organizationalUnitKpiSet;

}

/**
 * Chỉnh sửa KPI đơn vị
 * @data thông tin KPI cần chỉnh sửa
 * @id Id của KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (data, id) => {
    var objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    var target = await OrganizationalUnitKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
    target = await target.populate("parent").execPopulate();

    return target;
}

/**
 * Xóa KPI đơn vị
 * @id Id của KPI đơn vị
 * @organizationalUnitKpiSetId Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (id, organizationalUnitKpiSetId) => {
    var organizationalUnitKpi = await OrganizationalUnitKpi.findByIdAndDelete(id);
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(organizationalUnitKpiSetId, { $pull: { kpis: id } }, { new: true });
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return organizationalUnitKpiSet;
}

/**
 * Chỉnh sửa trạng thái của tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 * @statusId trạng thái mới của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSetStatus = async (id, query) => {
    var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { status: query.status } }, { new: true });
    kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return kpiunit;
}

/**
 * Xóa tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpiSet = async (id) => {
    var kpis = [];
    var kpiunit = await OrganizationalUnitKpiSet.findById(id);
    if (kpiunit.kpis) kpis = kpiunit.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return OrganizationalUnitKpi.findByIdAndDelete(item._id);
        }))
    }
    kpiunit = await OrganizationalUnitKpiSet.findByIdAndDelete(id);
    return [kpiunit, kpis];
}


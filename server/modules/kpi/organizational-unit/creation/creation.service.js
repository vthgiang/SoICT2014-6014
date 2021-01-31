const Models = require(`../../../../models`);
const { OrganizationalUnitKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = Models;

const overviewService = require('../../employee/management/management.service');
const { connect } = require(`../../../../helpers/dbHelper`);

/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getOrganizationalUnitKpiSet = async (portal, query) => {
    let month, nextMonth, endOfCurrentMonth, endOfLastMonth, department;

    if (query.month) {
        month = new Date(query.month);
        nextMonth = new Date(query.month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
        let currentYear, currentMonth, now;

        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth() + 1;
        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }
    
        month = currentYear + "-" + currentMonth;
        nextMonth = currentYear + "-" + (currentMonth + 1);

        month = new Date(month);
        nextMonth = new Date(nextMonth);
    }

    if (!query.organizationalUnitId) {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': query.roleId },
                    { 'deputyManagers': query.roleId },
                    { 'employees': query.roleId }
                ]
            });
    } else {
        department = { '_id': query.organizationalUnitId };
    }

    let kpiunit;
    if (department) {
        // Status khác 2 --> chưa kết thúc
        kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: department._id,
                status: { $ne: 2 }, date: { $lt: nextMonth, $gte: month }
            })
            .populate("organizationalUnit creator")
            .populate({ path: "kpis", populate: { path: 'parent' } });
    }

    return kpiunit;
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 * @id Id role người dùng
 */
exports.getParentOrganizationalUnitKpiSet = async (portal, data) => {
    const { roleId, organizationalUnitId, month } = data
    let department, kpiunit;
    let monthIso, nextMonth;

    if (organizationalUnitId) {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(organizationalUnitId);
    } else {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            });
    }
    
    if (month) {
        monthIso = new Date(month);
        nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
        let currentYear, currentMonth, now;

        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth() + 1;
        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }
    
        monthIso = currentYear + "-" + currentMonth;
        nextMonth = currentYear + "-" + (currentMonth + 1);

        monthIso = new Date(monthIso);
        nextMonth = new Date(nextMonth);
    }
    
    if (department) {
        kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: department.parent,
                date: { $gte: monthIso, $lt: nextMonth }
            })
            .populate("organizationalUnit creator")
            .populate({ path: "kpis", populate: { path: 'parent' } });
    }

    return kpiunit;

}

/**
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
 * @query {*} organizationalUnitId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTime = async (portal, roleId, organizationalUnitId, startDate, endDate) => {

    let organizationalUnit, organizationalUnitKpiSets;
    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            });
    } else {
        organizationalUnit = { '_id': organizationalUnitId }
    }

    if (organizationalUnit) {
        organizationalUnitKpiSets = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .find(
                {
                    'organizationalUnit': organizationalUnit._id,
                    'date': {
                        $gte: startDate,
                        $lt: endDate
                    }
                },
                { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
            )
    }

    return organizationalUnitKpiSets;
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 * @query {*} roleId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (portal, companyId, query) => {

    let childOrganizationalUnitKpiSets = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, companyId, query.roleId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        childOrganizationalUnitKpiSets.push(await this.getAllOrganizationalUnitKpiSetByTime(portal, null, childrenOrganizationalUnits[i].id, query.startDate, query.endDate));
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
exports.getAllOrganizationalUnitKpiSet = async (portal, data) => {
    let keySearch, organizationalUnit, status;

    organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findOne({
            $or: [
                { 'managers': data.roleId },
                { 'deputyManagers': data.roleId },
                { 'employees': data.roleId }
            ]
        });

    status = Number(data.status);
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

    if (organizationalUnit) {
        keySearch = {
            organizationalUnit: organizationalUnit._id
        };
    }

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

    let kpiunits = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .skip(0).limit(12).populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    return kpiunits;
}

/**
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 * @dateString thời gian mới 
 * @id Id của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (portal, dateString, id) => {
    let time = dateString.split("-");
    let date = new Date(time[1], time[0], 0)
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { date: date } }, { new: true })

    organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return organizationalUnitKpiSet;
}


/**
 * Khởi tạo tập KPI đơn vị
 * @data thông tin chung của tập Kpi đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (portal, data) => {
    const { date, creator, organizationalUnitId } = data;

    let currentYear, currentMonth, now;

    now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth() + 1;
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }

    month = currentYear + "-" + currentMonth;
    nextMonth = currentYear + "-" + (currentMonth + 1);

    month = new Date(month);
    nextMonth = new Date(nextMonth);

    // Tạo thông tin chung cho KPI đơn vị
    let organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .create({
            organizationalUnit: organizationalUnitId,
            creator: creator,
            date: new Date(date),
            kpis: []
        });

    // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(organizationalUnitId);

    if (organizationalUnit && organizationalUnit.parent) {
        let organizationalUnitParent = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: organizationalUnit.parent,
                status: 1,
                date: {
                    $gte: month, $lt: nextMonth
                }
            })
            .populate("kpis");

        let defaultTarget;

        if (organizationalUnitParent && organizationalUnitParent.kpis) defaultTarget = organizationalUnitParent.kpis.filter(item => item.type !== 0);//default Target là nhưng mục tiêu có default !== 0
        if (defaultTarget) {
            defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                let defaultT = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
                    .create({
                        name: item.name,
                        parent: item._id,
                        weight: 5,
                        criteria: item.criteria,
                        type: item.type
                    })
                return defaultT._id;
            }))
            organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(
                    organizationalUnitKpi, { kpis: defaultTarget }, { new: true }
                );
        }
    } else {
        let targetA = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: "Phê duyệt công việc",
                parent: null,
                weight: 5,
                criteria: "Thực hiện tốt vai trò người phê duyệt trong các công việc. Người phê duyệt là người chịu trách nhiệm về thành công/thất bại của công việc",
                type: 1
            })
        organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitKpi, { $push: { kpis: targetA._id } }, { new: true }
            );

        let targetC = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: "Hỗ trợ thực hiện công việc",
                parent: null,
                weight: 5,
                criteria: "Thực hiện tốt vai trò người tư vấn (consulted) trong các công việc",
                type: 2
            })
        organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitKpi, { $push: { kpis: targetC._id } }, { new: true }
            );
    }
    organizationalUnitKpi = organizationalUnitKpi && await organizationalUnitKpi
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return organizationalUnitKpi;

}

/**
 * Thêm một KPI vào tập KPI đơn vị
 * @data thông tin về KPI cần thêm vào tập KPI đơn vị
 * 
 */
exports.createOrganizationalUnitKpi = async (portal, data) => {
    let target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            parent: data.parent,
            weight: data.weight,
            criteria: data.criteria
        })
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            data.organizationalUnitKpiSetId, { $push: { kpis: target._id } }, { new: true }
        );

    organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();
    return organizationalUnitKpiSet;

}

/**
 * Chỉnh sửa KPI đơn vị
 * @data thông tin KPI cần chỉnh sửa
 * @id Id của KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (portal, data, id) => {
    let objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    let target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
    target = target && await target.populate("parent").execPopulate();

    return target;
}

/**
 * Xóa KPI đơn vị
 * @id Id của KPI đơn vị
 * @organizationalUnitKpiSetId Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (portal, id, organizationalUnitKpiSetId) => {
    let organizationalUnitKpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
        .findByIdAndDelete(id);
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(organizationalUnitKpiSetId, { $pull: { kpis: id } }, { new: true });

    organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return organizationalUnitKpiSet;
}

/**
 * Chỉnh sửa trạng thái của tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 * @statusId trạng thái mới của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSetStatus = async (portal, id, query) => {
    let kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: query.status } }, { new: true });

    kpiunit = kpiunit && await kpiunit
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return kpiunit;
}

/**
 * Xóa tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpiSet = async (portal, id) => {
    let kpis = [];
    let kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findById(id);
    if (kpiunit.kpis) kpis = kpiunit.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(item._id);
        }))
    }
    kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    return [kpiunit, kpis];
}


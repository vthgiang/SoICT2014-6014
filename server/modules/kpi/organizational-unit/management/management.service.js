const Models = require(`../../../../models`);
const { OrganizationalUnitKpiSet, OrganizationalUnitKpi, EmployeeKpiSet, EmployeeKpi } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const EmployeeKpiService = require(`../../employee/management/management.service`);
const mongoose = require("mongoose");


/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * Có 3 trường hợp (default: copy kpi của 1 đơn vị giữa các tháng
 * kpi_to_unit: copy từ kpi đơn vị cha cho kpi đơn vị con, kpi_to_employee: copy từ kpi đơn vị cha cho kpi nhân viên 
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (portal, kpiId, data) => {
    let organizationalUnitOldKPISet, checkOrganizationalUnitKpiSet, parentUnitKpiSet;
    let monthSearch, nextMonthSearch;

    monthSearch = new Date(data?.datenew);
    nextMonthSearch = new Date(data?.datenew);
    nextMonthSearch.setMonth(nextMonthSearch.getMonth() + 1);

    // Kiểm tra tồn tại KPI
    checkOrganizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: data.idunit,
            date: { $gte: monthSearch, $lt: nextMonthSearch }
        })

    if (checkOrganizationalUnitKpiSet) {
        throw { messages: "organizatinal_unit_kpi_set_exist" }
    } else {
        let organizationalUnitKpiSet, organizationalUnitNewKpi;

        // Tạo kpi tháng mới
        organizationalUnitNewKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .create({
                organizationalUnit: data.idunit,
                creator: data.creator,
                date: new Date(data?.datenew),
                kpis: []
            })

        // Lấy dữ liệu kpi được sao chép
        organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findById(kpiId)
            .populate("organizationalUnit")
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } });

        // Lấy kpi đơn vị cha của tập kpi mới
        if (data.type === 'default') {
            parentUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findOne({
                    organizationalUnit: mongoose.Types.ObjectId(organizationalUnitOldKPISet?.organizationalUnit?.parent),
                    date: { $gte: monthSearch, $lt: nextMonthSearch }
                })
                .populate({ path: "kpis" });
        } else {
            // true: sao chép từ kpi đơn vị cha, false: sao chép từ kpi đơn vị cùng cấp
            let organizationalUnit = JSON.parse(data?.matchParent?.toLowerCase()) ? organizationalUnitOldKPISet?.organizationalUnit?._id : organizationalUnitOldKPISet?.organizationalUnit?.parent

            parentUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findOne({
                    organizationalUnit: mongoose.Types.ObjectId(organizationalUnit),
                    date: { $gte: monthSearch, $lt: nextMonthSearch }
                })
                .populate({ path: "kpis" });
        }

        // Match các mục tiêu kpi
        for (let i in organizationalUnitOldKPISet?.kpis) {
            if (data?.listKpiUnit?.includes(organizationalUnitOldKPISet.kpis?.[i]?._id.toString())) {
                let target, parent;

                if (data.type === 'default' ) {
                    let parentKpi = parentUnitKpiSet?.kpis?.filter(item => {
                        return item?.name === organizationalUnitOldKPISet.kpis[i]?.parent?.name
                    })

                    parent = parentKpi?.[0]?._id 
                } else {    // 2 trường hợp, copy từ kpi cha hoặc copy từ đơn vị cùng cha
                    let parentKpi = parentUnitKpiSet?.kpis?.filter(item => {
                        if (JSON.parse(data?.matchParent?.toLowerCase())) {
                            return item?.name === organizationalUnitOldKPISet.kpis[i]?.name
                        } else {
                            return item?.name === organizationalUnitOldKPISet.kpis[i]?.parent?.name
                        }
                    })

                    parent = parentKpi?.[0]?._id 
                }

                target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
                    .create({
                        name: organizationalUnitOldKPISet.kpis[i]?.name,
                        parent: parent,
                        weight: organizationalUnitOldKPISet.kpis[i]?.weight,
                        criteria: organizationalUnitOldKPISet.kpis[i]?.criteria,
                        type: organizationalUnitOldKPISet.kpis[i]?.type
                    })

                organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                    .findByIdAndUpdate(
                        organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
                    );
            }
        }

        organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findById(organizationalUnitNewKpi?._id)
            .populate("organizationalUnit")
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } });

        return {
            kpiunit: organizationalUnitKpiSet,
            copyKpi: organizationalUnitOldKPISet
        };
    }
}

/**
 * Copy KPI đơn vị sang KPI nhân viên
 * @param {*} kpiId id của OrganizationalUnitKPIset 
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} idunit Id của đơn vị 
 * @query {*} creator Id nhân viên
 * @query {*} approver Id người phê duyệt
 */
exports.copyParentKPIUnitToChildrenKPIEmployee = async (portal, kpiId, data) => {
    let organizationalUnitOldKPISet, checkEmployeeKpiSet;
    let newDate, nextNewDate;

    newDate = new Date(data.datenew);
    nextNewDate = new Date(data.datenew);
    nextNewDate.setMonth(nextNewDate.getMonth() + 1);

    checkEmployeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: data.idunit,
            creator: data.creator,
            status: { $ne: 3 },
            date: { $gte: newDate, $lt: nextNewDate }
        })

    if (checkEmployeeKpiSet) {
        throw { messages: "employee_kpi_set_exist" }
    } else {
        let employeeKpiSet, employeeNewKpiSet;

        employeeNewKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .create({
                organizationalUnit: data.idunit,
                creator: data.creator,
                approver: data.approver,
                date: newDate,
                kpis: []
            })

        organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findById(kpiId)
            .populate("organizationalUnit")
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } });


        for (let i in organizationalUnitOldKPISet.kpis) {
            if (data?.listKpiUnit?.includes(organizationalUnitOldKPISet.kpis?.[i]?._id.toString())) {
                let target = await EmployeeKpi(connect(DB_CONNECTION, portal))
                    .create({
                        name: organizationalUnitOldKPISet.kpis[i].name,
                        parent: organizationalUnitOldKPISet.kpis[i]._id,
                        weight: organizationalUnitOldKPISet.kpis[i].weight,
                        criteria: organizationalUnitOldKPISet.kpis[i].criteria,
                        type: organizationalUnitOldKPISet.kpis[i].type
                    })

                employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
                    .findByIdAndUpdate(
                        employeeNewKpiSet._id, { $push: { kpis: target._id } }, { new: true }
                    );
            }
        }

        employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                creator: data.creator,
                organizationalUnit: data.idunit,
                status: { $ne: 3 },
                date: { $gte: newDate, $lt: nextNewDate }
            })
            .populate("organizationalUnit")
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "approver", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate([
                { path: 'comments.creator', select: 'name email avatar ' },
                { path: 'comments.comments.creator', select: 'name email avatar' }
            ])

        return {
            employeeKpiSet: employeeKpiSet,
            copyKpi: organizationalUnitOldKPISet
        };
    }
}


exports.calculateKpiUnit = async (portal, data) => {
    let kpiUnitSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findOne({ _id: data.idKpiUnitSet })
    .populate("organizationalUnit")
    .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let employeeImportances = kpiUnitSet?.employeeImportances;
    let organizationUnitKpiAutomaticPoint = 0;
    let organizationUnitKpiEmployeePoint = 0;
    let organizationUnitKpiApprovePoint = 0;
    let totalWeight = 0;

    let currentMonth = new Date(kpiUnitSet?.date);
    let nextMonth = new Date(kpiUnitSet?.date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    for (i in kpiUnitSet.kpis) {
        let organizationUnitKpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findOne({ _id: kpiUnitSet.kpis[i] });
        let weight = organizationUnitKpi.weight / 100;
        let autoPoint = 0;
        let employeePoint = 0;
        let approvedPoint = 0;
        let totalImportance = 0;

        // Lấy tất cả mục tiêu KPI cá nhân thuộc đơn vị
        let kpiEmployee = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).aggregate([
            { $match: 
                { $and: [
                    { organizationalUnit: kpiUnitSet?.organizationalUnit },
                    { date: { $lt: nextMonth, $gte: currentMonth } }
                ]}
            },
            
            {
                $lookup: {
                    from: "employeekpis",
                    localField: "kpis",
                    foreignField: "_id",
                    as: "employeeKpiSet"
                }
            },
            {
                $addFields: {
                    'employeeKpiSet.creator': "$creator",
                }
            },
            {
                $unwind: {
                    path: "$employeeKpiSet",
                }
            },
            { $replaceRoot: { newRoot: "$employeeKpiSet" } }
        ])

        // let kpiEmployee = await EmployeeKpi(connect(DB_CONNECTION, portal)).find({ parent: organizationUnitKpi._id });
        for (j in kpiEmployee) {
            if (Number(kpiEmployee?.[j]?.weight) > 0) {
                let employeeImportance = employeeImportances.filter(item => item?.employee?.toString() === kpiEmployee?.[j]?.creator?.toString())?.[0];

                autoPoint += kpiEmployee[j].automaticPoint * employeeImportance?.importance;
                employeePoint += kpiEmployee[j].employeePoint * employeeImportance?.importance;
                approvedPoint += kpiEmployee[j].approvedPoint * employeeImportance?.importance;

                totalImportance += employeeImportance?.importance;
            }
        }

        if (kpiEmployee.length && totalImportance) {
            autoPoint = autoPoint / totalImportance;
            employeePoint = employeePoint / totalImportance;
            approvedPoint = approvedPoint / totalImportance;
            totalWeight += weight;
        } else {
            organizationUnitKpi.weight = 0;
        }

        // update point for each kpiUnit in kpiUnitSet
        organizationUnitKpi.automaticPoint = Math.round(autoPoint);
        organizationUnitKpi.employeePoint = Math.round(employeePoint);
        organizationUnitKpi.approvedPoint = Math.round(approvedPoint);

        await organizationUnitKpi.save();

        // increase kpiUnitSet's point
        organizationUnitKpiAutomaticPoint += autoPoint * weight;
        organizationUnitKpiEmployeePoint += employeePoint * weight;
        organizationUnitKpiApprovePoint += approvedPoint * weight;
    }

    // update kpiUnitSet
    kpiUnitSet.automaticPoint = Math.round(organizationUnitKpiAutomaticPoint / totalWeight ? organizationUnitKpiAutomaticPoint / totalWeight : 0);
    kpiUnitSet.employeePoint = Math.round(organizationUnitKpiEmployeePoint / totalWeight ? organizationUnitKpiEmployeePoint / totalWeight : 0);
    kpiUnitSet.approvedPoint = Math.round(organizationUnitKpiApprovePoint / totalWeight ? organizationUnitKpiApprovePoint / totalWeight : 0);
    
    await kpiUnitSet.save();
    let childrenKpi = await EmployeeKpiService.getChildTargetByParentId(portal, { organizationalUnitKpiSetId: data.idKpiUnitSet })
    
    return { kpiUnitSet, childrenKpi };
}

/** Thêm logs */
exports.createOrganizationalUnitKpiSetLogs = async (portal, data) => {
    const { creator, title, description, organizationalUnitKpiSetId } = data;

    let log = {
        creator: creator,
        title: title,
        description: description,
    };

    await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { '_id': organizationalUnitKpiSetId },
            { $push: { logs: log } },
            { new: true }
        )
        .populate({ path: "logs.creator", select: "_id name emmail avatar" });

    let kpiLogs = await this.getOrganizationalUnitKpiSetLogs(portal, organizationalUnitKpiSetId);

    return kpiLogs;
} 

/** Lấy các logs của tập kpi đơn vị */
exports.getOrganizationalUnitKpiSetLogs = async (portal, organizationalUnitKpiSetId) => {
    let kpiLogs = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findById(organizationalUnitKpiSetId)
        .populate({ path: "logs.creator", select: "_id name emmail avatar" });

    return kpiLogs?.logs?.reverse();
}

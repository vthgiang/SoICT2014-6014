const Models = require(`../../../../models`);
const { OrganizationalUnitKpiSet, OrganizationalUnitKpi, EmployeeKpiSet, EmployeeKpi } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const EmployeeKpiService = require(`../../employee/management/management.service`);
const mongoose = require("mongoose");


/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (portal, kpiId, data) => {
    let organizationalUnitOldKPISet, checkOrganizationalUnitKpiSet;
    let newDate, nextNewDate;

    newDate = new Date(data.datenew);
    nextNewDate = new Date(data.datenew);
    nextNewDate.setMonth(nextNewDate.getMonth() + 1);

    checkOrganizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: data.idunit,
            date: { $gte: newDate, $lt: nextNewDate }
        })

    if (checkOrganizationalUnitKpiSet) {
        throw { messages: "organizatinal_unit_kpi_set_exist" }
    } else {
        let organizationalUnitKpiSet, organizationalUnitNewKpi;

        organizationalUnitNewKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .create({
                organizationalUnit: data.idunit,
                creator: data.creator,
                date: newDate,
                kpis: []
            })

        if (data.type === 'default') {
            organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findById(kpiId)
                .populate("organizationalUnit")
                .populate({ path: "creator", select: "_id name email avatar" })
                .populate({ path: "kpis", populate: { path: 'parent' } });
        } else {
            organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findOne({
                    organizationalUnit: mongoose.Types.ObjectId(data?.organizationalUnitIdCopy),
                    date: { $gte: newDate, $lt: nextNewDate }
                })
                .populate("organizationalUnit")
                .populate({ path: "creator", select: "_id name email avatar" })
                .populate({ path: "kpis" });
        }



        for (let i in organizationalUnitOldKPISet?.kpis) {
            if (data?.listKpiUnit?.includes(organizationalUnitOldKPISet.kpis?.[i]?._id.toString())) {
                let target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
                    .create({
                        name: organizationalUnitOldKPISet.kpis[i]?.name,
                        parent: data.type !== 'default' ? (JSON.parse(data?.matchParent?.toLowerCase()) ? organizationalUnitOldKPISet.kpis[i]?._id : organizationalUnitOldKPISet.kpis[i]?.parent) : null,
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

        return organizationalUnitKpiSet;
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

        return employeeKpiSet;
    }
}


exports.calculateKpiUnit = async (portal, data) => {

    let kpiUnitSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findOne({ _id: data.idKpiUnitSet })
        .populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let organizationUnitKpiAutomaticPoint = 0;
    let organizationUnitKpiEmployeePoint = 0;
    let organizationUnitKpiApprovePoint = 0;
    let totalWeight = 0;
    for (i in kpiUnitSet.kpis) {
        let organizationUnitKpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findOne({ _id: kpiUnitSet.kpis[i] });
        let weight = organizationUnitKpi.weight / 100;
        let autoPoint = 0;
        let employeePoint = 0;
        let approvedPoint = 0;

        let kpiEmployee = await EmployeeKpi(connect(DB_CONNECTION, portal)).find({ parent: organizationUnitKpi._id });
        for (j in kpiEmployee) {
            autoPoint += kpiEmployee[j].automaticPoint;
            employeePoint += kpiEmployee[j].employeePoint;
            approvedPoint += kpiEmployee[j].approvedPoint;
        }
        if (kpiEmployee.length) {
            autoPoint = autoPoint / kpiEmployee.length;
            employeePoint = employeePoint / kpiEmployee.length;
            approvedPoint = approvedPoint / kpiEmployee.length;
            totalWeight += weight;
            newWeight = weight;
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


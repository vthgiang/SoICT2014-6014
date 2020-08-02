const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');
const EmployeeKPI = require('../../../../models/kpi/employeeKpi.model');
const EmployeeKPISet = require('../../../../models/kpi/employeeKpiSet.model');

const mongoose = require("mongoose");



/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} creator Id người tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (kpiId, data) => {
    var organizationalUnitOldKPISet = await OrganizationalUnitKpiSet.findById(kpiId)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let date, dateNewKPIUnit, organizationalUnitKpiSet;
    date = data.datenew.split("-");
    dateNewKPIUnit = new Date(date[1], date[0], 0);

    var organizationalUnitNewKpi = await OrganizationalUnitKpiSet.create({
        organizationalUnit: organizationalUnitOldKPISet.organizationalUnit._id,
        creator: data.creator,
        date: dateNewKPIUnit,
        kpis: []
    })

    for (let i in organizationalUnitOldKPISet.kpis) {
        var target = await OrganizationalUnitKpi.create({
            name: organizationalUnitOldKPISet.kpis[i].name,
            parent: organizationalUnitOldKPISet.kpis[i].parent,
            weight: organizationalUnitOldKPISet.kpis[i].weight,
            criteria: organizationalUnitOldKPISet.kpis[i].criteria,
            type: organizationalUnitOldKPISet.kpis[i].type
        })
        organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
        );
    }
    organizationalUnitKpiSet = await OrganizationalUnitKpiSet.find({ organizationalUnit: data.idunit })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return organizationalUnitKpiSet;
}
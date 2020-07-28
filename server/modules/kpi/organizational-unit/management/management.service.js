const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');
const EmployeeKPI = require('../../../../models/kpi/employeeKpi.model');
const EmployeeKPISet = require('../../../../models/kpi/employeeKpiSet.model');

const mongoose = require("mongoose");


/**
 * Lấy tất cả KPI của đơn vị 
 * @query {*} roleId id chức danh 
 * @query {*} startDate
 * @query {*} endDate 
 * @query {*} status trạng thái của OrganizationalUnitKPISet
 */
exports.getKPIUnits = async (data) => {
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
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} creator Id người tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (kpiId, data) => {
    var organizationalUnitOldKPI = await OrganizationalUnitKpiSet.findById(kpiId)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    let date, dateNewKPIUnit, monthNewKPI, yearNewKPI;
    date = data.datenew.split("-");
    dateNewKPIUnit = new Date(date[1], date[0], 0);
    monthNewKPI = dateNewKPIUnit.getMonth();
    yearNewKPI = dateNewKPIUnit.getFullYear();

    var organizationalUnitNewKpi = await OrganizationalUnitKpiSet.create({
        organizationalUnit: organizationalUnitOldKPI.organizationalUnit._id,
        creator: data.creator,
        date: dateNewKPIUnit,
        kpis: []
    })

    for (let i in organizationalUnitOldKPI.kpis) {
        var target = await OrganizationalUnitKpi.create({
            name: organizationalUnitOldKPI.kpis[i].name,
            parent: organizationalUnitOldKPI.kpis[i].parent,
            weight: organizationalUnitOldKPI.kpis[i].weight,
            criteria: organizationalUnitOldKPI.kpis[i].criteria,
            type: organizationalUnitOldKPI.kpis[i].type
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
        );
    }
    organizationalUnitKpi = await OrganizationalUnitKpiSet.find({ organizationalUnit: data.idunit })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return organizationalUnitKpi;
}
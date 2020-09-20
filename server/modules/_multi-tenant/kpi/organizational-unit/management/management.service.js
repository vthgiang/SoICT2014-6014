const Models = require(`${SERVER_MODELS_DIR}/_multi-tenant`);
const { OrganizationalUnitKpiSet, OrganizationalUnitKpi } = Models;

const mongoose = require("mongoose");
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);



/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} creator Id người tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (portal, kpiId, data) => {
    var organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findById(kpiId)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let date, dateNewKPIUnit, organizationalUnitKpiSet;
    date = data.datenew.split("-");
    dateNewKPIUnit = new Date(date[1], date[0], 0);

    var organizationalUnitNewKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .create({
            organizationalUnit: organizationalUnitOldKPISet.organizationalUnit._id,
            creator: data.creator,
            date: dateNewKPIUnit,
            kpis: []
        })

    for (let i in organizationalUnitOldKPISet.kpis) {
        var target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: organizationalUnitOldKPISet.kpis[i].name,
                parent: organizationalUnitOldKPISet.kpis[i].parent,
                weight: organizationalUnitOldKPISet.kpis[i].weight,
                criteria: organizationalUnitOldKPISet.kpis[i].criteria,
                type: organizationalUnitOldKPISet.kpis[i].type
            })
        organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
            );
    }
    organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .find({ organizationalUnit: data.idunit })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    
    return organizationalUnitKpiSet;
}
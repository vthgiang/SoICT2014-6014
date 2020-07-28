const { OrganizationalUnit, EmployeeKpiSet } = require('../../../../models').schema;


/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeKpiSetOfUnitByIds = async (ids) => {
    let data = [];
    for (let i = 0; i < ids.length; i++) {

        let employeekpis = await EmployeeKpiSet.find({
            organizationalUnit: ids[i]
        })
            .skip(0).limit(50)
            .populate("organizationalUnit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } });
        data = data.concat(employeekpis);

    };
    return data;
}

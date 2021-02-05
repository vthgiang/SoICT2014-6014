import { getStorage} from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const createUnitKpiServices = {
    getCurrentKPIUnit,
    getKPIParent,
    getAllOrganizationalUnitKpiSetByTime,
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit,
    addKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    addTargetKPIUnit,
    editTargetKPIUnit,
    deleteTargetKPIUnit,
}

/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
function getCurrentKPIUnit(roleId, organizationalUnitId, month) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            roleId: roleId,
            organizationalUnitId: organizationalUnitId,
            month: month
        },
    }, false, true, 'kpi.organizational_unit');
}

/** Lấy KPI đơn vị cha của 1 đơn vị trong 1 tháng
 * @data gồm các thuộc tính: roleId, organizationalUnitId, month
 */
function getKPIParent(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            parent: 1,
            roleId: data ? data.roleId : null,
            organizationalUnitId: data ? data.organizationalUnitId : null,
            month: data ? data.month : null
        }
    }, false, true, 'kpi.organizational_unit');
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị 
 */
function getAllOrganizationalUnitKpiSetByTime(roleId, organizationalUnitId, startDate, endDate) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            allOrganizationalUnitKpiSetByTime: true,
            roleId: roleId,
            organizationalUnitId: organizationalUnitId,
            startDate: startDate,
            endDate: endDate,
        }
    }, false, false)
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 */
function getAllOrganizationalUnitKpiSetByTimeOfChildUnit(roleId, startDate, endDate) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            child: true,
            roleId: roleId,
            startDate: startDate,
            endDate: endDate,
        }
    }, false, false)
}

// Khởi tạo KPI đơn vị 
function addKPIUnit(newKPI) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'POST',
        data: {
            date: newKPI ? newKPI.month : null,
            organizationalUnitId: newKPI ? newKPI.organizationalUnitId : null
        }
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set_modal');
}



// Chỉnh sửa KPI đơn vị
function editKPIUnit(kpiId, data, type) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${kpiId}`,
        method: 'PATCH',
        params: {
            type: type
        },
        data: data
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}


// Xóa KPI đơn vị
function deleteKPIUnit(kpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${kpiId}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpis`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_modal');
}

// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpis/${id}`,
        method: 'PATCH',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.edit_target_kpi_modal');
}

// Xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    let kpiunit = organizationalUnitKpiSetId
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${kpiunit}/organizational-unit-kpis/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}
import { handleResponse } from '../../../../../helpers/handleResponse';

import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';

import { sendRequest } from '../../../../../helpers/requestHelper';

export const createUnitKpiServices = {
    getCurrentKPIUnit,
    getKPIParent,
    addKPIUnit,
    addTargetKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    deleteTargetKPIUnit,
    editStatusKPIUnit,
    editTargetKPIUnit,
    
}

/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
function getCurrentKPIUnit(roleId, organizationalUnitId, month) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            roleId: roleId,
            organizationalUnitId: organizationalUnitId,
            month: month
        },
    }, false, true, 'kpi.organizational_unit');
}

// Lấy KPI đơn vị cha
function getKPIParent(parentUnit) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/parent`,
        method: 'GET',
        params: {
            roleId: parentUnit
        }
    }, false, true, 'kpi.organizational_unit');
}

// Khởi tạo KPI đơn vị 
function addKPIUnit(newKPI) {
    var id = getStorage("userId");

    newKPI = { ...newKPI, creator: id };

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit`,
        method: 'POST',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set_modal');
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpis`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_modal');
}

// Chỉnh sửa KPI đơn vị
function editKPIUnit(kpiId, newKPI) {
    var userId = getStorage("userId");
    newKPI = { ...newKPI, creator: userId };
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiId}`,
        method: 'PATCH',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(kpiId, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiId}/status-kpi`,
        method: 'PATCH',
        params: {
            status: status,
        }
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}


// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpis/${id}`,
        method: 'PATCH',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.edit_target_kpi_modal');
}


// Xóa KPI đơn vị
function deleteKPIUnit(kpiId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiId}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    let kpiunit = organizationalUnitKpiSetId
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpi/organizational-unit/organizational-unit-kpi-sets/${kpiunit}/organizational-unit-kpis/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}
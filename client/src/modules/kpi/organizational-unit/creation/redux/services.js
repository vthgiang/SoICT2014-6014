import {handleResponse} from '../../../../../helpers/handleResponse';

import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';

import { sendRequest } from '../../../../../helpers/requestHelper';

export const createUnitKpiServices = {
    getCurrentKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    deleteTargetKPIUnit,
    editStatusKPIUnit,
    getKPIParent,
    addTargetKPIUnit,
    editTargetKPIUnit,
    addKPIUnit
}

// Lấy KPI đơn vị hiện tại
function getCurrentKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/current-unit/role/${id}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');
}

// Lấy KPI đơn vị cha
function getKPIParent(parentUnit) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/parent/${parentUnit}`,
        method: 'GET',
    }, false, true, 'kpi.organizational_unit');
}

// Khởi tạo KPI đơn vị 
function addKPIUnit(newKPI) {
    var id = getStorage("userId");
    
    newKPI = {...newKPI, creator: id};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/create`,
        method: 'POST',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set_modal');
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/create-target`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_modal');
}

// Chỉnh sửa KPI đơn vị
function editKPIUnit(id, newKPI) {
    var userId = getStorage("userId");
    newKPI = {...newKPI, creator: userId};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/${id}`,
        method: 'PUT',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/status/${id}/${status}`,
        method: 'PUT',
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}


// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/target/${id}`,
        method: 'PUT',
        data: newTarget
    }, true, true, 'kpi.organizational_unit.edit_target_kpi_modal');
}


// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    let kpiunit = organizationalUnitKpiSetId
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/target/${kpiunit}/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}
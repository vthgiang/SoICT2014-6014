import {handleResponse} from '../../../../../helpers/handleResponse';

import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../../env';
import {
    getStorage, AuthenticateHeader
} from '../../../../../config';
import jwt from 'jsonwebtoken';

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
    });
}

// Lấy KPI đơn vị cha
function getKPIParent(parentUnit) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/parent/${parentUnit}`,
        method: 'GET',
    });
}

// Khởi tạo KPI đơn vị 
async function addKPIUnit(newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    
    newKPI = {...newKPI, creator: id};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/create`,
        method: 'POST',
        data: newKPI
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal');
}

// Thêm mục tiêu cho KPI đơn vị 
function addTargetKPIUnit(newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/create-target`,
        method: 'POST',
        data: newTarget
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_modal');
}

// Chỉnh sửa KPI đơn vị
async function editKPIUnit(id, newKPI) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var creater = verified._id;
    newKPI = {...newKPI, creater: creater};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/${id}`,
        method: 'PUT',
        data: newKPI
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information');
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/status/${id}/${status}`,
        method: 'PUT',
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_set.request_approval_kpi');
}


// Chỉnh sửa mục tiêu của KPI đơn vị
function editTargetKPIUnit(id, newTarget) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/target/${id}`,
        method: 'PUT',
        data: newTarget
    }, true, 'organizational_unit_kpi_set.edit_target_kpi_modal');
}


// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/${id}`,
        method: 'DELETE'
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information');
}

// xóa mục tiêu của KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    let kpiunit = organizationalUnitKpiSetId
    return sendRequest({
        url: `${LOCAL_SERVER_API}/kpiunits/target/${kpiunit}/${id}`,
        method: 'DELETE'
    }, true, 'organizational_unit_kpi_set.create_organizational_unit_kpi_set.delete_kpi');
}
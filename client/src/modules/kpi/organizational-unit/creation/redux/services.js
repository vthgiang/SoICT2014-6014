import { getStorage} from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const createUnitKpiServices = {
    getCurrentKPIUnit,
    getKPIParent,
    getAllOrganizationalUnitKpiSetByTime,
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit,
    addKPIUnit,
    editStatusKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    addTargetKPIUnit,
    editTargetKPIUnit,
    deleteTargetKPIUnit,

    createComment,
    editComment,
    deleteComment,
    createChildComment,
    editChildComment,
    deleteChildComment,
    deleteFileComment,
    deleteFileChildComment
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

/*
 *Lấy KPI đơn vị cha
 */
function getKPIParent(parentUnit) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            parent: 1,
            roleId: parentUnit
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
    var id = getStorage("userId");

    newKPI = { ...newKPI, creator: id };

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'POST',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set_modal');
}



// Chỉnh sửa KPI đơn vị
function editKPIUnit(kpiId, newKPI) {
    var userId = getStorage("userId");
    newKPI = { ...newKPI, creator: userId };
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${kpiId}`,
        method: 'PATCH',
        data: newKPI
    }, true, true, 'kpi.organizational_unit.create_organizational_unit_kpi_set');
}

// Chỉnh sửa trạng thái của KPI đơn vị
function editStatusKPIUnit(kpiId, status) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${kpiId}`,
        method: 'PATCH',
        params: {
            status: status,
        }
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

/**
 * Tạo comment cho kpi set
 */
function createComment(setKpiId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments`,
        method: 'POST',
        data: data
    }, false, true)
}
/**
 * Tạo comment cho kpi set
 */
function createChildComment(setKpiId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}/child-comments`,
        method: 'POST',
        data: data
    }, false, true)
}

/**
 * Edit comment cho kpi set
 */
function editComment(setKpiId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment
 */
function deleteComment(setKpiId, commentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Edit comment of comment
 */
function editChildComment(setKpiId, commentId, childCommentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment of comment
 */
function deleteChildComment(setKpiId, commentId, childCommentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'DELETE',
    }, false, true)
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId,commentId, setKpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Delete file child comment
 */
function deleteFileChildComment(fileId, childCommentId, commentId, setKpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}
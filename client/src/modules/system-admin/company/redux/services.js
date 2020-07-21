import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const CompanyServices = {
    get,
    create,
    edit,
    addNewLink,
    deleteLink,    
    addNewComponent,
    deleteComponent,
    linksList,
    componentsList,

    getImportConfiguration,
    createImportConfiguration,
    editImportConfiguration,
};

/**
 * Lấy danh sách tất cả các công ty
 */
function get(params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @company dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
function create(company) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company`,
        method: 'POST',
        data: company,
    }, true, true, 'system_admin.company');
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
function edit(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Thêm link mới cho công ty
 * @id id của công ty
 * @data
    * @linkUrl đường dẫn cho link muốn tạo
    * @linkDescription mô tả về link
 */
function addNewLink(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}/add-new-link`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Xóa 1 link của công ty
 * @companyId id của công ty
 * @linkId id của link muốn xóa
 */
function deleteLink(companyId, linkId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/delete-link/${linkId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.company');
}

/**
 * Thêm mới 1 component cho công ty
 * @id id của công ty
 * @data
    * @componentname tên của component
    * @componentDescription mô tả về component
    * @linkId id của link được chứa component này
 */
function addNewComponent(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}/add-new-component`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Xóa một của component của công ty
 * @companyId id của công ty
 * @componentId id của component muốn xóa
 */
function deleteComponent(companyId, componentId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/delete-component/${componentId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.company');
}

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
function linksList(companyId, params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/links-list`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Lấy danh sách các component của công ty
 * @companyId id của công ty
 */
function componentsList(companyId, params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/components-list`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Lấy thông tin cấu hình file import
 * @data
    * @type Thể loại file cấu hình(salary, taskTemplate);
 */
function getImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/${data.type}`,
        method: 'GET',
    }, false, false, 'system_admin.company');
}

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 */
function createImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @data Dữ liệu chinhe sửa file cấu hình
 */
function editImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/${data.id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}
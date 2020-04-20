import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const DisciplineService = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,
    
    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
}
/**
 * Start
 * Quản lý kỷ luật
 * 
 */
// Lấy danh sách kỷ luật
function getListDiscipline(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/discipline/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Thêm mới kỷ luật của nhân viên
function createNewDiscipline(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/discipline/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/discipline/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/discipline/${id}`,
        method: 'PUT',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}
/**
 * End
 * Quản lý kỷ luật
 * 
 */

/**
 * Start
 * Quản lý khen thưởng
 * 
 */
// Lấy danh sách khen thưởng
function getListPraise(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/praise/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Thêm mới thông tin khen thưởng
function createNewPraise(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/praise/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin khen thưởng
function deletePraise(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/praise/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin khen thưởng
function updatePraise(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/praise/${id}`,
        method: 'PUT',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}
/**
 * End
 * Quản lý khen thưởng
 * 
 */
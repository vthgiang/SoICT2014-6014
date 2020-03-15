import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader
} from '../../../../config';
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

// Lấy danh sách kỷ luật
function getListDiscipline(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/discipline/paginate`, requestOptions).then(handleResponse);

}

// tạo mới kỷ luật của nhân viên
function createNewDiscipline(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/discipline/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(id) {
    const requestOptions = {
        headers: AuthenticateHeader(),
        method: 'DELETE',
    };

    return fetch(`${ LOCAL_SERVER_API }/discipline/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/discipline/${id}`, requestOptions).then(handleResponse);
}




// Lấy danh sách khen thưởng
function getListPraise(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/praise/paginate`, requestOptions).then(handleResponse);

}

// tạo mới thông tin khen thưởng
function createNewPraise(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/praise/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin khen thưởng
function deletePraise(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/praise/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin khen thưởng
function updatePraise(id, data) {
    const requestOptions ={
        method: 'PUT',
        headers:AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/praise/${id}`, requestOptions).then(handleResponse);
}
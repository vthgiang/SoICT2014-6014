import {
    handleResponse
} from '../../../../helpers/HandleResponse';
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/discipline/paginate`, requestOptions).then(handleResponse);

}

// tạo mới kỷ luật của nhân viên
function createNewDiscipline(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/discipline/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(employeeNumber, number) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/discipline/${employeeNumber}/${number}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(employeeNumber, number, data) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return fetch(`/discipline/${employeeNumber}/${number}`, requestOptions).then(handleResponse);
}




// Lấy danh sách khen thưởng
function getListPraise(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/praise/paginate`, requestOptions).then(handleResponse);

}

// tạo mới thông tin khen thưởng
function createNewPraise(data) {
    const requestOptions ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/praise/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin khen thưởng
function deletePraise(employeeNumber,number) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/praise/${employeeNumber}/${number}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin khen thưởng
function updatePraise(employeeNumber,number, data) {
    const requestOptions ={
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return fetch(`/praise/${employeeNumber}/${number}`, requestOptions).then(handleResponse);
}
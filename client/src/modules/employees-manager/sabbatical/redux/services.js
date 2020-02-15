import {
    handleResponse
} from '../../../../helpers/HandleResponse';
export const SabbaticalService = {
    getListSabbatical,
    createNewSabbatical,
    deleteSabbatical,
    updateSabbatical,
}

// Lấy danh sách nghỉ phép
function getListSabbatical(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/sabbatical/paginate`, requestOptions).then(handleResponse);

}

// tạo mới thông tin nghỉ phép
function createNewSabbatical(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/sabbatical/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin nghỉ phép
function deleteSabbatical(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/sabbatical/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin nghỉ phép
function updateSabbatical(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return fetch(`/sabbatical/${id}`, requestOptions).then(handleResponse);
}



import {
    handleResponse
} from '../../../../helpers/HandleResponse';
export const employeeService = {
    getAll,
    getByNameDepartment,

}

// get all imformaltion employee
function getAll(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    return fetch(`/employee/paginate`, requestOptions).then(handleResponse);
}

// get list employee by namedepartment and position
function getByNameDepartment(nameDepartment, chief, deputy) {
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`/employee/${nameDepartment}/${chief}/${deputy}`, requestOptions).then(handleResponse);
}
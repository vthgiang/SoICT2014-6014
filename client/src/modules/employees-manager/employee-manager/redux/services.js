import {
    handleResponse
} from '../../../../helpers/HandleResponse';
export const employeeService = {
    getAll,
    getByNameDepartment,

}

// get all imformaltion employee
function getAll() {
    const requestOptions = {
        method: 'GET',
    }

    return fetch(`/employee/`, requestOptions).then(handleResponse);
}

// get list employee by namedepartment and position
function getByNameDepartment(nameDepartment, chief, deputy) {
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`/employee/${nameDepartment}/${chief}/${deputy}`, requestOptions).then(handleResponse);
}
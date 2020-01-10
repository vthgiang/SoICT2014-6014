import {
    handleResponse
} from '../../../../helpers/HandleResponse';
export const employeeService = {
    addNewEmployee,
    getByEmployeeNumber,
    updateInformationEmpoyee,

}

// get information employee by employeeNumber
function getByEmployeeNumber(id) {
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`/employee/${id}`, requestOptions).then(handleResponse);
}

// add new employee
function addNewEmployee(newEmployee) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
    };

    return fetch(`/employee`, requestOptions).then(handleResponse)

}

// update information employee

function updateInformationEmpoyee(id, information) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(information)
    };
    return fetch(`employee/${id}`, requestOptions).then(handleResponse)
}
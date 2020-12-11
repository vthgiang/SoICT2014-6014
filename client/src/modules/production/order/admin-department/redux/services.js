import { sendRequest } from '../../../../../helpers/requestHelper';

export const AdminDepartmentServices = {
    getAllAdminDepartments,
    createAdminDepartment,
    editAdminDepartment,
}

function getAllAdminDepartments(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/admin-department`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "order.admin_department"
    );
}

function createAdminDepartment(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/admin-department`,
            method: "POST",
            data
        },
        true,
        true,
        "order.admin_department")
}

function editAdminDepartment(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/admin-department/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        "order.admin_department"
    )
}
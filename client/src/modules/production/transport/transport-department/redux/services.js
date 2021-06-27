import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportDepartmentServices = {
    getAllTransportDepartments,
    createTransportDepartment,
    deleteTransportDepartment,
    getUserByRole,
}

function createTransportDepartment(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-department`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transport.transportDepartment"
    )
}

function getAllTransportDepartments(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-department`,
            method: "GET",
            params: {
                // page: queryData !== undefined ? queryData.page : null,
                // limit: queryData !== undefined ? queryData.limit : null
                page: 1,
                limit: 100
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "manage_transport.transportDepartment"
    );
}

function deleteTransportDepartment(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-department/${id}`,
            method: "DELETE"
        },
        true,
        true,
        "manage_transport.transportDepartment"
    )
}

function getUserByRole(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-department/get-user-by-role`,
            method: "GET",
            params: {
                // page: queryData !== undefined ? queryData.page : null,
                // limit: queryData !== undefined ? queryData.limit : null
                currentUserId: queryData !== undefined ? queryData.currentUserId : null,
                role: queryData !== undefined ? queryData.role : null,
            } 
        }
    );
}
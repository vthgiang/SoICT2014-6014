import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportDepartmentServices = {
    getAllTransportDepartments,
    createTransportDepartment,
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
        "manage_transport"
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
         "transport.department"
    );
}
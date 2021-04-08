import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportRequirementsServices = {
    getAllTransportRequirements,
    createTransportRequirement,
    editTransportRequirement,
    deleteTransportRequirement,
}

function getAllTransportRequirements(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement`,
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
         "transport.requirements"
    );
}

function createTransportRequirement(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function editTransportRequirement(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function deleteTransportRequirement(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement/${id}`,
            method: "DELETE"
        },
        true,
        true,
        "manage_transport"
    )
}
import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportRequirementsServices = {
    getAllTransportRequirements,
    createTransportRequirement,
    getDetailTransportRequirement,
    editTransportRequirement,
    deleteTransportRequirement,
}

function getAllTransportRequirements(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement`,
            method: "GET",
            params: {
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null,
                // page: 1,
                // limit: 100,
                status: queryData !== undefined ? queryData.status : null,
                currentUserId: localStorage.getItem('userId'),
                currentRole: localStorage.getItem('currentRole'),
                searchData: queryData,
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "manage_transport.transportRequirement"
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
        "manage_transport.transportRequirement"
    )
}

function getDetailTransportRequirement(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement/${id}`,
            method: "GET"
        },
        false,
        true,
        'manage_transport.transportRequirement'
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
        "manage_transport.transportRequirement"
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
        "manage_transport.transportRequirement"
    )
}
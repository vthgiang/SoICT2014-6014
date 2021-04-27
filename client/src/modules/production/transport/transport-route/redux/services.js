import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportProcessServices = {
    // getAllTransportRequirements,
    // createTransportRequirement,
    // getDetailTransportRequirement,
    // editTransportRequirement,
    // deleteTransportRequirement,
    startLocate,
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
                limit: 100,
                status: queryData !== undefined ? queryData.status : null
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "transport.requirements"
    );
}

function startLocate(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-process/start-locate`,
            method: "GET",
            params: {
                // page: queryData !== undefined ? queryData.page : null,
                // limit: queryData !== undefined ? queryData.limit : null
                // page: 1,
                // limit: 100,
                // status: queryData !== undefined ? queryData.status : null
                
                manageId: queryData !== undefined ? queryData.manageId : null,
                driverId: queryData !== undefined ? queryData.driverId : null,
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "transport.process"
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

function getDetailTransportRequirement(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement/${id}`,
            method: "GET"
        },
        false,
        true,
        'manage_transport'
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
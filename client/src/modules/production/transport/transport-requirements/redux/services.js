import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportRequirementsServices = {
    getAllTransportRequirements,
    createTransportRequirement,
}

function getAllTransportRequirements(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirements`,
            method: "GET",
            params: {
                exampleName: queryData !== undefined ?
                                       queryData.exampleName : "",
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null
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

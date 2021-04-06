import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportVehicleServices = {
    getAllTransportVehicles,
    createTransportVehicle,
}

function getAllTransportVehicles(queryData) {
    console.log(queryData, " day la queyrasdasdasdasdad")
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-vehicle`,
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
         "transport.vehicle"
    );
}

function createTransportVehicle(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-vehicle`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

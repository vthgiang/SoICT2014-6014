import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportScheduleServices = {
    // getAllTransportRequirements,
    createTransportSchedule,
}

// function getAllTransportRequirements(queryData) {
//     console.log(queryData, "sssssssssssssssssss")
//     return sendRequest(
//         {
//             url: `${process.env.REACT_APP_SERVER}/transport-requirement`,
//             method: "GET",
//             params: {
//                 // page: queryData !== undefined ? queryData.page : null,
//                 // limit: queryData !== undefined ? queryData.limit : null
//                 page: 1,
//                 limit: 100
//             }
//         },
//          false, // Nếu có truy vấn thành công thì không hiện thông báo
//          true, // Nếu có truy vấn thất bại thì hiện thông báo
//          "transport.requirements"
//     );
// }

function createTransportSchedule(data) {
    console.log(data, " schedule");
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-schedule`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

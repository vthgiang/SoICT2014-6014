import { sendRequest } from '../../../../../helpers/requestHelper';

export const worksServices = {
    getAllManufacturingWorks,
}

function getAllManufacturingWorks(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-works`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manufacturing.manufacturing_works"
    );
}
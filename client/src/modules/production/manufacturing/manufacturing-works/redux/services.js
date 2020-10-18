import { sendRequest } from '../../../../../helpers/requestHelper';

export const worksServices = {
    getAllManufacturingWorks,
    createManufacturingWorks,
    getDetailManufacturingWorks
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

function createManufacturingWorks(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-works`,
            method: "POST",
            data
        },
        true,
        true,
        "manufacturing.manufacturing_works")
}

function getDetailManufacturingWorks(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-works/${id}`,
            method: "GET"
        },
        false,
        true,
        "manufacturing.manufacturing_works"
    )
} 
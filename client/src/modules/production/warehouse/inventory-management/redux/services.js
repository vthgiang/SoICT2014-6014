import { sendRequest } from '../../../../../helpers/requestHelper';
export const LotServices = {
    getAllLots,
    getDetailLot,
    editLot,
    getLotsByGood,
    createOrUpdateLots,
    deleteManyLots,
    getAllManufacturingLots,
    createManufacturingLot,
    getDetailManufacturingLot,
    handleEditManufacturingLot
}

function getAllLots(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.inventory_management')
}

function getDetailLot(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/get-detail/${id}`,
        method: 'GET',
    }, false, true, 'manage_warehouse.inventory_management')
}

function editLot(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'manage_warehouse.inventory_management')
}

function getLotsByGood(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/get-lot-by-good`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.inventory_management')
}

function createOrUpdateLots(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/create-or-edit-lot`,
        method: 'POST',
        data
    }, true, true, 'manage_warehouse.inventory_management')
}

function deleteManyLots(array) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/delete-many`,
        method: 'POST',
        data: { array }
    }, true, true, 'manage_warehouse.inventory_management')
}

function getAllManufacturingLots(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/lot/get-manufacturing-lot`,
            method: "GET",
            params: query
        },
        false,
        true,
        "manufacturing.lot"
    );
}

function createManufacturingLot(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/lot/create-manufacturing-lot`,
            method: "POST",
            data
        },
        true,
        true,
        "manufacturing.lot"
    );
}

function getDetailManufacturingLot(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/get-manufacturing-lot/${id}`,
        method: 'GET'
    },
        false,
        true,
        'manufacturing.lot')
}

function handleEditManufacturingLot(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/lot/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'manage_warehouse.inventory_management')
}
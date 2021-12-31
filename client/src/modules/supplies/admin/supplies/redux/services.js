import { sendRequest } from "../../../../../helpers/requestHelper";

export const SuppliesService = {
    searchSupplies,
    createSupplies,
    updateSupplies,
    deleteSupplies,
    getSuppliesById,
};

function searchSupplies(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/supplies`,
        method: 'GET',
        params: {
            getAll: data.getAll,
            code: data.code,
            suppliesName: data.suppliesName,
            page: data.page,
            limit: data.limit
        },
    },
    false,
    true,
    'supplies.supplies_management');
}

function createSupplies(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/supplies`,
        method: 'POST',
        data: data,
    },
    true,
    true,
    'supplies.supplies_management');
}

function updateSupplies(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/supplies/${id}`,
        method: 'PATCH',
        data: data,
    },
    true,
    true,
    'supplies.supplies_management');
}

function deleteSupplies(ids) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/supplies`,
        method: 'DELETE',
        data: ids,
    },
    true,
    true,
    'supplies.supplies_management');
}

function getSuppliesById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/supplies/${id}`,
        method: 'GET',
    },
    false,
    true,
    'supplies.supplies_management');
}
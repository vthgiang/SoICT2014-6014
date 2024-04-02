import { sendRequest } from "../../../../helpers/requestHelper"

export const ManufacturingProcessService = {
    getAllManufacturingProcess,
    getManufacturingProcessById,
    createManufacturingProcess,
    editManufacturingProcess,
    deleteManufacturingProcess,
}

function getManufacturingProcessById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manager-manufacturing-process/${id}`,
        method: 'GET',
    },
        true,
        true,
        "manager-manufacturing-process"
    )
}

function getAllManufacturingProcess(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manager-manufacturing-process`,
        method: 'GET',
    },
        true,
        true,
        "manager-manufacturing-process"
    )
}

function createManufacturingProcess(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manager-manufacturing-process`,
        method: 'POST',
        data: data
    },
        true,
        true,
        "manager-manufacturing-process"
    )
}

function editManufacturingProcess(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manager-manufacturing-process/${id}`,
        method: 'PATCH',
        data: data
    },
        true,
        true,
        "manager-manufacturing-process"
    )
}

function deleteManufacturingProcess(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manager-manufacturing-process/${id}`,
        method: 'DELETE',
    },
        true,
        true,
        "manager-manufacturing-process"
    )
}
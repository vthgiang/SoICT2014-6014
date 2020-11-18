import { sendRequest } from "../../../../../helpers/requestHelper"

export const commandServices = {
    getAllManufacturingCommands,
    getDetailManufacturingCommand,
    handleEditCommand
}

function getAllManufacturingCommands(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-command`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.command'
    )
}

function getDetailManufacturingCommand(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-command/${id}`,
            method: "GET"
        },
        false,
        true,
        'manufacturing.command'
    )
}

function handleEditCommand(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-command/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        'manufacturing.command'
    )
}
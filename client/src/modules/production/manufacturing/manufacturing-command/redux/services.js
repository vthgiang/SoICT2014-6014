import { sendRequest } from "../../../../../helpers/requestHelper"

export const commandServices = {
    getAllManufacturingCommands
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
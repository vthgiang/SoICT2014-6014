import { commandConstants } from "./constants"
import { commandServices } from "./services";

export const commandActions = {
    getAllManufacturingCommands
}

function getAllManufacturingCommands(query) {
    return dispatch => {
        dispatch({
            type: commandConstants.GET_ALL_MANUFACTURING_COMMAND_REQUEST
        });
        commandServices.getAllManufacturingCommands(query)
            .then((res) => {
                dispatch({
                    type: commandConstants.GET_ALL_MANUFACTURING_COMMAND_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: commandConstants.GET_ALL_MANUFACTURING_COMMAND_FAILURE,
                    error
                });
            })
    }
}
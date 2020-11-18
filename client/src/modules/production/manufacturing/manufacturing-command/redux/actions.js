import { commandConstants } from "./constants"
import { commandServices } from "./services";

export const commandActions = {
    getAllManufacturingCommands,
    getDetailManufacturingCommand,
    handleEditCommand,
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

function getDetailManufacturingCommand(id) {
    return dispatch => {
        dispatch({
            type: commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_REQUEST
        });
        commandServices.getDetailManufacturingCommand(id)
            .then((res) => {
                dispatch({
                    type: commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_FAILURE,
                    error
                });
            });
    }
}

function handleEditCommand(id, data) {
    return dispatch => {
        dispatch({
            type: commandConstants.EDIT_MANUFACTURING_COMMAND_REQUEST
        });
        commandServices.handleEditCommand(id, data)
            .then((res) => {
                dispatch({
                    type: commandConstants.EDIT_MANUFACTURING_COMMAND_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: commandConstants.EDIT_MANUFACTURING_COMMAND_FAILURE,
                    error
                });
            });
    }
}
import { commandConstants } from "./constants"
import { commandServices } from "./services";

export const commandActions = {
    getAllManufacturingCommands,
    getDetailManufacturingCommand,
    handleEditCommand,
    getNumberCommands,
    getNumberCommandsStatus
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

function getNumberCommands(query) {
    console.log(query);
    console.log('aaa')
    return dispatch => {
        dispatch({
            type: commandConstants.GET_NUMBER_COMMAND_REQUEST
        });
        commandServices.getNumberCommands(query)
            .then((res) => {
                dispatch({
                    type: commandConstants.GET_NUMBER_COMMAND_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: commandConstants.GET_NUMBER_COMMAND_FAILURE,
                    error
                });
            });
    }
}

function getNumberCommandsStatus(query) {
    return dispatch => {
        dispatch({
            type: commandConstants.GET_NUMBER_COMMAND_BY_STATUS_REQUEST
        });
        commandServices.getNumberCommandsStatus(query)
            .then((res) => {
                dispatch({
                    type: commandConstants.GET_NUMBER_COMMAND_BY_STATUS_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: commandConstants.GET_NUMBER_COMMAND_BY_STATUS_FAILURE,
                    error
                });
            });
    }
}
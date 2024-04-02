import { ManufacturingProcessConstants } from './constants'
import { ManufacturingProcessService } from './services';

export const ManufacturingProcessActions = {
    getAllManufacturingProcess,
    getManufacturingProcessByID,
    createManufacturingProcess,
    editManufacturingProcess,
    deleteManufacturingProcess
}

function getManufacturingProcessByID(id) {
    return (dispatch) => {
        dispatch({
            type: ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS_BY_ID_REQUEST
        });

        ManufacturingProcessService.getManufacturingProcessById(id).then((res)=> {
            dispatch({
                type: ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS_BY_ID_SUCCESS,
                payload: res.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS__BY_ID_FAILURE,
                error
            })
        })
    }
}

function getAllManufacturingProcess(){
    return (dispatch) => {
        dispatch({
            type: ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS_REQUEST
        });

        ManufacturingProcessService.getAllManufacturingProcess().then((res)=> {
            dispatch({
                type: ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS_SUCCESS,
                payload: res.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS_FAILURE,
                error
            })
        })
    }
}

function createManufacturingProcess(data){
    return (dispatch) => {
        dispatch({
            type: ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_REQUEST
        });

        ManufacturingProcessService.createManufacturingProcess(data).then((res)=> {
            dispatch({
                type: ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_SUCCESS,
                payload: res.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_FAILURE,
                error
            })
        })
    }
}

function editManufacturingProcess(id, data){
    return (dispatch) => {
        dispatch({
            type: ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_REQUEST
        });

        ManufacturingProcessService.editManufacturingProcess(id, data).then((res)=> {
            dispatch({
                type: ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_SUCCESS,
                payload: res.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_FAILURE,
                error
            })
        })
    }
}

function deleteManufacturingProcess(id){
    return (dispatch) => {
        dispatch({
            type: ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_REQUEST
        });

        ManufacturingProcessService.deleteManufacturingProcess(id).then((res)=> {
            dispatch({
                type: ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_SUCCESS,
                payload: res.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_FAILURE,
                error
            })
        })
    }
}
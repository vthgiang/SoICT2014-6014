import { ManufacturingProcessConstants } from './constants';

const initialState = {
    list: [],
    isLoading: false,
    processEdit: undefined,
    error: null,
    totalList: 0
}

export function manufacturingProcess(state = initialState, action) {
    switch (action.type) {
        case ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS:
            return {
                ...state,
                isLoading: true,
            }
        case ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                list: action.payload.data,
                totalList: action.payload.totalList
            }
        case ManufacturingProcessConstants.GET_ALL_MANUFACTURE_PROCESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS_BY_ID_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                processEdit: action.payload
            }
        case ManufacturingProcessConstants.GET_MANUFACTURE_PROCESS__BY_ID_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                list: action.payload.data,
            }
        case ManufacturingProcessConstants.CREATE_MANUFACTURE_PROCESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                list: action.payload.data,
            }
        case ManufacturingProcessConstants.EDIT_MANUFACTURE_PROCESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                list: action.payload.data,
            }
        case ManufacturingProcessConstants.DELETE_MANUFACTURE_PROCESS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        default:
            return state
    }
}
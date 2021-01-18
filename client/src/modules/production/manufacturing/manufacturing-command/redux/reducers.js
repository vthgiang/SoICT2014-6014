import { commandConstants } from "./constants";
var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    isLoading: false,
    listCommands: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    currentCommand: {}
}

export function manufacturingCommand(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case commandConstants.GET_ALL_MANUFACTURING_COMMAND_REQUEST:
        case commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_REQUEST:
        case commandConstants.EDIT_MANUFACTURING_COMMAND_REQUEST:
        case commandConstants.GET_NUMBER_COMMAND_REQUEST:
        case commandConstants.GET_NUMBER_COMMAND_BY_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case commandConstants.GET_ALL_MANUFACTURING_COMMAND_FAILURE:
        case commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_FAILURE:
        case commandConstants.EDIT_MANUFACTURING_COMMAND_FAILURE:
        case commandConstants.GET_NUMBER_COMMAND_FAILURE:
        case commandConstants.GET_NUMBER_COMMAND_BY_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case commandConstants.GET_ALL_MANUFACTURING_COMMAND_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listCommands: action.payload.manufacturingCommands.docs,
                totalDocs: action.payload.manufacturingCommands.totalDocs,
                limit: action.payload.manufacturingCommands.limit,
                totalPages: action.payload.manufacturingCommands.totalPages,
                page: action.payload.manufacturingCommands.page,
                pagingCounter: action.payload.manufacturingCommands.pagingCounter,
                hasPrevPage: action.payload.manufacturingCommands.hasPrevPage,
                hasNextPage: action.payload.manufacturingCommands.hasNextPage,
                prevPage: action.payload.manufacturingCommands.prevPage,
                nextPage: action.payload.manufacturingCommands.nextPage,
            }
        case commandConstants.GET_DETAIL_MANUFACTURING_COMMAND_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentCommand: action.payload.manufacturingCommand
            }
        case commandConstants.EDIT_MANUFACTURING_COMMAND_SUCCESS:
            index = findIndex(state.listCommands, action.payload.manufacturingCommand._id);
            if (index !== -1) {
                state.listCommands[index] = action.payload.manufacturingCommand
            }
            return {
                ...state,
                isLoading: false
            }
        case commandConstants.GET_NUMBER_COMMAND_SUCCESS:
            return {
                ...state,
                isLoading: false,
                commandNumber: action.payload
            }
        case commandConstants.GET_NUMBER_COMMAND_BY_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                commandNumberStatus: action.payload
            }
        default:
            return state
    }
}
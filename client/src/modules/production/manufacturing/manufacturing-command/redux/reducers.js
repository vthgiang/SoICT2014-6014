import { commandConstants } from "./constants";


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
}

export function manufacturingCommand(state = initState, action) {
    switch (action.type) {
        case commandConstants.GET_ALL_MANUFACTURING_COMMAND_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case commandConstants.GET_ALL_MANUFACTURING_COMMAND_FAILURE:
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
        default:
            return state
    }
}
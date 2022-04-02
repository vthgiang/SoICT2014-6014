import { AllocationHistoryConstants } from "./constants";
import { AllocationHistoryService } from "./services";

export const AllocationHistoryActions = {
    searchAllocation,
    createAllocations,
    updateAllocation,
    deleteAllocations,
    getAllocationById
}

function searchAllocation(data) {
    return (dispatch) => {
        dispatch({
            type: AllocationHistoryConstants.SEARCH_ALLOCATION_REQUEST
        });
        AllocationHistoryService.searchAllocation(data)
            .then((res) => {
                dispatch({
                    type: AllocationHistoryConstants.SEARCH_ALLOCATION_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AllocationHistoryConstants.SEARCH_ALLOCATION_FAILURE,
                    error: err,
                });
            });
    };
}

function createAllocations(data) {
    return (dispatch) => {
        // tao moi
        dispatch({
            type: AllocationHistoryConstants.CREATE_ALLOCATIONS_REQUEST,
        });
        // 
        AllocationHistoryService.createAllocations(data)
            .then((res) => {
                if (res.data) {
                    dispatch({
                        type: AllocationHistoryConstants.CREATE_ALLOCATIONS_SUCCESS,
                        payload: res.data.content
                    });
                }

            }).catch((err) => {
                dispatch({
                    type: AllocationHistoryConstants.CREATE_ALLOCATIONS_FAILURE,
                    error: err,
                    payload: err.response.data.content
                });
            });
    }
}

function updateAllocation(id, data) {
    return (dispatch) => {
        dispatch({
            type: AllocationHistoryConstants.UPDATE_ALLOCATION_REQUEST,
        });
        AllocationHistoryService.updateAllocation(id, data)
            .then((res) => {
                dispatch({
                    type: AllocationHistoryConstants.UPDATE_ALLOCATION_SUCCESS,
                    payload: res.data.content
                });
            }).catch((err) => {
                dispatch({
                    type: AllocationHistoryConstants.UPDATE_ALLOCATION_FAILURE,
                    error: err,
                });
            });
    }
}

function deleteAllocations(data) {
    return (dispatch) => {
        dispatch({
            type: AllocationHistoryConstants.DELETE_ALLOCATIONS_REQUEST,
        });
        AllocationHistoryService.deleteAllocations(data)
            .then((res) => {
                dispatch({
                    type: AllocationHistoryConstants.DELETE_ALLOCATIONS_SUCCESS,
                    payload: res.data.content,
                    ids: data.ids
                });
            }).catch((err) => {
                dispatch({
                    type: AllocationHistoryConstants.DELETE_ALLOCATIONS_FAILURE,
                    error: err,
                });
            });
    }
}

function getAllocationById(id) {
    return (dispatch) => {
        dispatch({
            type: AllocationHistoryConstants.GET_ALLOCATION_BY_ID_REQUEST,
        });
        AllocationHistoryService.getAllocationById(id)
            .then((res) => {
                dispatch({
                    type: AllocationHistoryConstants.GET_ALLOCATION_BY_ID_SUCCESS,
                    payload: res.data.content,
                });
            }).catch((err) => {
                dispatch({
                    type: AllocationHistoryConstants.GET_ALLOCATION_BY_ID_FAILURE,
                    error: err,
                });
            });
    }
}
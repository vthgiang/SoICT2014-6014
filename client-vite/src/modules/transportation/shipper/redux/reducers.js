import { ShipperConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    taskList: [],
    todayShippersSchedule: [],
    availableForCurrentJourney: [],
    isLoading: false,
    error: null,
    totalList: 0,
    driversNotConfirm: [],
    calculatedSalary: [],
    shippersSalary: [],
}

export function shipper(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case ShipperConstants.GET_ALL_SHIPPER_REQUEST:
        case ShipperConstants.DELETE_SHIPPER_REQUEST:
        case ShipperConstants.CREATE_SHIPPER_REQUEST:
        case ShipperConstants.EDIT_SHIPPER_REQUEST:
        case ShipperConstants.GET_SHIPPER_DETAIL_REQUEST:
        case ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_REQUEST:
        case ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_REQUEST:
        case ShipperConstants.GET_ALL_SHIPPER_TASK_REQUEST:
        case ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_REQUEST:
        case ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_REQUEST:
        case ShipperConstants.CALCULATE_SHIPPER_SALARY_REQUEST:
        case ShipperConstants.SAVE_SHIPPER_SALARY_REQUEST:
        case ShipperConstants.GET_ALL_SHIPPER_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case ShipperConstants.GET_ALL_SHIPPER_FAILURE:
        case ShipperConstants.DELETE_SHIPPER_FAILURE:
        case ShipperConstants.CREATE_SHIPPER_FAILURE:
        case ShipperConstants.EDIT_SHIPPER_FAILURE:
        case ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_FAILURE:
        case ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_FAILURE:
        case ShipperConstants.GET_ALL_SHIPPER_TASK_FAILURE:
        case ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_FAILURE:
        case ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_FAILURE:
        case ShipperConstants.CALCULATE_SHIPPER_SALARY_FAILURE:
        case ShipperConstants.SAVE_SHIPPER_SALARY_FAILURE:
        case ShipperConstants.GET_ALL_SHIPPER_SALARY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case ShipperConstants.GET_ALL_SHIPPER_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case ShipperConstants.DELETE_SHIPPER_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(task => !action.taskIds.includes(task?._id)),
                isLoading: false
            }
        case ShipperConstants.CREATE_SHIPPER_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                driversNotConfirm: state.driversNotConfirm.filter((driver) => driver._id != action.payload.user),
                isLoading: false
            }
        case ShipperConstants.EDIT_SHIPPER_SUCCESS:
            index = findIndex(state.lists, action.payload?._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case ShipperConstants.GET_SHIPPER_DETAIL_SUCCESS:
            return {
                ...state,
                currentDetailVehicle: action.payload,
                isLoading: false
            }
        case ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_SUCCESS: {
            return {
                ...state,
                todayShippersSchedule: action.payload,
                isLoading: false
            }
        }
        case ShipperConstants.GET_ALL_SHIPPER_TASK_SUCCESS: {
            return {
                ...state,
                taskList: action.payload,
                isLoading: false
            }
        }
        case ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                availableForCurrentJourney: action.payload,
            }
        }
        case ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                driversNotConfirm: action.payload
            }
        }
        case ShipperConstants.CALCULATE_SHIPPER_SALARY_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                calculatedSalary: action.payload
            }
        }
        case ShipperConstants.SAVE_SHIPPER_SALARY_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                shippersSalary: action.payload
            }
        }
        case ShipperConstants.GET_ALL_SHIPPER_SALARY_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                shippersSalary: action.payload
            }
        }
        case ShipperConstants.UPDATE_REALTIME_SHIPPER_STATUS: {
            let updateListShipper = state.lists;
            console.log(action.payload);
            let updateData = action.payload;
            if (Array.isArray(updateData.driverIds)) {
                updateData.driverIds.forEach((driverId) => {
                    let index = updateListShipper.findIndex((shipper) => shipper.driver._id == driverId);
                    if (index != -1) {
                        updateListShipper[index].status = updateData.status
                    }
                })
            }
            return {
                ...state,
                lists: updateListShipper
            }
        }
        default:
            return state
    }
}
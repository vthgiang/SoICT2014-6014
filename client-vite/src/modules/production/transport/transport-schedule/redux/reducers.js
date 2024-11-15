import { transportScheduleConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initialState = {
  lists: [],
  isLoading: false,
  error: null,
  totalList: 0
}
export function transportSchedule(state = initialState, action) {
  let index = -1
  switch (action.type) {
    case transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_REQUEST:
    case transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_REQUEST:
    case transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_REQUEST:
    case transportScheduleConstants.GET_ALL_TRANSOPRT_SCHEDULE_ROUTE_BY_CARRIER_ID_REQUEST:
    case transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_FAILURE:
    case transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_FAILURE:
    case transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_FAILURE:
    case transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_FAILURE:
    case transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_SUCCESS:
    case transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_SUCCESS:
    case transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentTransportSchedule: action.payload
      }
    case transportScheduleConstants.GET_ALL_TRANSOPRT_SCHEDULE_ROUTE_BY_CARRIER_ID_SUCCESS:
    case transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transportScheduleByCarrierId: action.payload
      }
    // case transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_SUCCESS:
    // // index = findIndex(state.lists, action.payload._id);
    // // if (index !== -1) {
    // //     state.lists[index] = action.payload
    // // }
    // return {
    //     ...state,
    //     isLoading: false,
    //     currentTransportScheduleAfterEdit: action.payload,
    // }
    default:
      return state
  }
}

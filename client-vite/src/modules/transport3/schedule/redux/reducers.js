import { ScheduleConstants } from './constants'

const initState = {
  isLoading: false,
  listSchedules: [],
  depot: {}
}

export function schedule(state = initState, action) {
  switch (action.type) {
    case ScheduleConstants.GET_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listSchedules: action.payload
      }
    case ScheduleConstants.GET_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.GET_NEAREST_DEPOT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_NEAREST_DEPOT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        depot: action.payload
      }
    case ScheduleConstants.GET_NEAREST_DEPOT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

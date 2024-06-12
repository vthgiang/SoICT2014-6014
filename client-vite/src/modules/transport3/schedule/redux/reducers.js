import { ScheduleConstants } from './constants'

const initState = {
  isLoading: false,
  listSchedules: [],
  listStocsWithLatLng: []
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
    case ScheduleConstants.CREATE_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.CREATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.CREATE_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listStocsWithLatLng: action.payload
      }
    case ScheduleConstants.GET_SCHEDULE_WITH_LATLNG_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

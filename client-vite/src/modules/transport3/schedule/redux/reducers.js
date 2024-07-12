import { ScheduleConstants } from './constants'

const initState = {
  isLoading: false,
  isAutoScheduling: false,
  listAutoSchedules: null,
  listSchedules: [],
  schedule: {},
  listStocsWithLatLng: [],
  predictOntimeDeliveryResults: [],
  hyperparameters: [],
  draftSchedule: [],
  list3rdPartySchedules: []
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
    case ScheduleConstants.GET_SCHEDULE_BY_ID_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_SCHEDULE_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        schedule: action.payload
      }
    case ScheduleConstants.GET_SCHEDULE_BY_ID_FAILURE:
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
    case ScheduleConstants.AUTO_SCHEDULE_REQUEST:
      return {
        ...state,
        isAutoScheduling: true,
        listAutoSchedules: null
      }
    case ScheduleConstants.AUTO_SCHEDULE_SUCCESS:
      return {
        ...state,
        isAutoScheduling: false,
        listAutoSchedules: ['']
      }
    case ScheduleConstants.AUTO_SCHEDULE_FAILURE:
      return {
        ...state,
        isAutoScheduling: false,
        listAutoSchedules: []
      }
    case ScheduleConstants.PREDICT_ONTIME_DELIVERY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.PREDICT_ONTIME_DELIVERY_SUCCESS:
      return {
        ...state,
        predictOntimeDeliveryResults: action.payload,
        isLoading: false
      }
    case ScheduleConstants.PREDICT_ONTIME_DELIVERY_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.POST_HYPERPARAMETER:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.POST_HYPERPARAMETER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.POST_HYPERPARAMETER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.GET_HYPERPARAMETER:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_HYPERPARAMETER_SUCCESS:
      return {
        ...state,
        hyperparameters: action.payload,
        isLoading: false
      }
    case ScheduleConstants.GET_HYPERPARAMETER_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.GET_DRAFT_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_DRAFT_SCHEDULE_SUCCESS:
      return {
        ...state,
        draftSchedule: action.payload,
        isLoading: false
      }
    case ScheduleConstants.GET_DRAFT_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.SET_SCHEDULE_FROM_DRAFT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.DELETE_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.DELETE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.DELETE_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.GET_3RD_PARTY_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.GET_3RD_PARTY_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        list3rdPartySchedules: action.payload
      }
    case ScheduleConstants.GET_3RD_PARTY_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.CREATE_3RD_PARTY_SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ScheduleConstants.CREATE_3RD_PARTY_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case ScheduleConstants.CREATE_3RD_PARTY_SCHEDULE_FAILURE:
      return {
        ...state,
        isLoading: false
      }

    default:
      return state
  }
}

import { qualityDasboardConstants } from './constants'

const initState = {
  isLoading: false,
  numberCreatedInspection: 0,
  errorNumByReporter: {},
  errorNumByGroup: {}
}

export function qualityDasboard(state = initState, action) {
  switch (action.type) {
    case qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_REQUEST:
    case qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_REQUEST:
    case qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_FAILURE:
    case qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_FAILURE:
    case qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        numberCreatedInspection: action.payload
      }
    case qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorNumByReporter: action.payload
      }
    case qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorNumByGroup: action.payload
      }
    default:
      return state
  }
}

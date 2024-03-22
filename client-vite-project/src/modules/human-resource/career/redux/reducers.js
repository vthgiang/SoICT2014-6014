import { CareerConstant } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  listPosition: [],
  error: ''
}

export function career(state = initState, action) {
  switch (action.type) {
    case CareerConstant.GET_CAREER_POSITION_REQUEST:
    case CareerConstant.CREATE_CAREER_POSITION_REQUEST:
    case CareerConstant.DELETE_CAREER_POSITION_REQUEST:
    case CareerConstant.UPDATE_CAREER_POSITION_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case CareerConstant.GET_CAREER_POSITION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPosition: action.payload !== undefined ? action.payload : [],
        totalList: action.payload.totalList
      }

    case CareerConstant.CREATE_CAREER_POSITION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPosition: action.payload !== undefined ? action.payload : []
      }

    case CareerConstant.UPDATE_CAREER_POSITION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPosition: action.payload !== undefined ? action.payload : []
      }

    case CareerConstant.DELETE_CAREER_POSITION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPosition: action.payload !== undefined ? action.payload : []
      }

    case CareerConstant.GET_CAREER_POSITION_FAILURE:
    case CareerConstant.CREATE_CAREER_POSITION_FAILURE:
    case CareerConstant.DELETE_CAREER_POSITION_FAILURE:
    case CareerConstant.UPDATE_CAREER_POSITION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    default:
      return state
  }
}

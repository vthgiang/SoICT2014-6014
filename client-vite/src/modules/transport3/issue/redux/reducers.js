import { IssueConstants } from './constants.js'

const initState = {
  isLoading: false,
  issues: []
}

export function issue(state = initState, action) {
  switch (action.type) {
    case IssueConstants.GET_ALL_ISSUE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case IssueConstants.GET_ALL_ISSUE_SUCCESS:
      return {
        ...state,
        issues: action.payload,
        isLoading: false
      }
    case IssueConstants.GET_ALL_ISSUE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case IssueConstants.ADD_TO_3RD_PARTY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case IssueConstants.ADD_TO_3RD_PARTY_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case IssueConstants.ADD_TO_3RD_PARTY_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

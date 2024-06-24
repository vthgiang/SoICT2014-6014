import { IssueConstants } from './constants'
import { IssueServices } from './services'

const getIssues = () => {
  return async (dispatch) => {
    dispatch({ type: IssueConstants.GET_ALL_ISSUE_REQUEST })
    try {
      const res = await IssueServices.getIssues()
      dispatch({ type: IssueConstants.GET_ALL_ISSUE_SUCCESS, payload: res.data })
    } catch (error) {
      dispatch({ type: IssueConstants.GET_ALL_ISSUE_FAILURE })
    }
  }
}
export const IssueActions = {
  getIssues
}

import { IssueConstants } from './constants'
import { IssueServices } from './services'

const getIssues = () => {
  return async (dispatch) => {
    dispatch({ type: IssueConstants.GET_ALL_ISSUE_REQUEST })
    try {
      const res = await IssueServices.getIssues()
      dispatch({ type: IssueConstants.GET_ALL_ISSUE_SUCCESS, payload: res.data.data })
    } catch (error) {
      dispatch({ type: IssueConstants.GET_ALL_ISSUE_FAILURE })
    }
  }
}

const addTo3rd = (data) => {
  return async (dispatch) => {
    dispatch({ type: IssueConstants.ADD_TO_3RD_PARTY_REQUEST })
    try {
      await IssueServices.addTo3rd(data)
      dispatch({ type: IssueConstants.ADD_TO_3RD_PARTY_SUCCESS })
    } catch (error) {
      dispatch({ type: IssueConstants.ADD_TO_3RD_PARTY_FAILURE })
    }
  }
}

export const IssueActions = {
  getIssues,
  addTo3rd
}

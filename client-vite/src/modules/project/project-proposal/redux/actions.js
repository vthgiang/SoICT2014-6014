import { ProjectProposalConstants } from "./constants"
import { ProjectProposalServices } from "./services"

function proposalForProjectDispatch(id, data) {
  return (dispatch) => {
    dispatch({ type: ProjectProposalConstants.PROPOSAL_PROJECT_REQUEST })
    ProjectProposalServices.proposalForProject(id, data) 
      .then((res) => {
        dispatch({
          type: ProjectProposalConstants.PROPOSAL_PROJECT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ProjectProposalConstants.PROPOSAL_PROJECT_FAIL
        })
      })
  }
}

function assignProjectFromProposalDataDispatch(id) {
  return (dispatch) => {
    dispatch({ type: ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_REQUEST })
    ProjectProposalServices.assignProjectFromProposalData(id)
      .then((res) => {
        dispatch({
          type: ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_SUCCESS,
          payload: res?.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_FAIL
        })
      })
  }
}

export const ProjectProposalActions = {
  proposalForProjectDispatch,
  assignProjectFromProposalDataDispatch
}

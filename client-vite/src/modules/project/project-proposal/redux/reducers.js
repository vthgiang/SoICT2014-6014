import { ProjectProposalConstants } from "./constants"; 

const initState = {
  isLoading: false,
  projectProposalData: {},
  isAssignProposalLoading: false
}

export function projectProposal(state = initState, action) {
  switch (action.type) {
    case ProjectProposalConstants.PROPOSAL_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isAssignProposalLoading: true
      }
    case ProjectProposalConstants.PROPOSAL_PROJECT_SUCCESS: 
      return {
        ...state,
        isLoading: false,
        projectProposalData: action.payload
      }
    case ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAssignProposalLoading: false,
        projectProposalData: action.payload
      }
    case ProjectProposalConstants.PROPOSAL_PROJECT_FAIL: 
      return {
        ...state,
        isLoading: false
      }
    case ProjectProposalConstants.ASSIGN_PROPOSAL_PROJECT_FAIL:
      return {
        ...state,
        isLoading: false,
        isAssignProposalLoading: false,
      }
    default: 
      return state
  }
}

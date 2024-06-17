import { ProjectProposalConstants } from "./constants"; 

const initState = {
  isLoading: false,
  projectProposalData: {},
}

export function projectProposal(state = initState, action) {
  switch (action.type) {
    case ProjectProposalConstants.PROPOSAL_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ProjectProposalConstants.PROPOSAL_PROJECT_SUCCESS: 
      return {
        ...state,
        isLoading: false,
        projectProposalData: action.payload
      }
    case ProjectProposalConstants.PROPOSAL_PROJECT_FAIL: 
      return {
        ...state,
        isLoading: false
      }

    default: 
      return state
  }
}

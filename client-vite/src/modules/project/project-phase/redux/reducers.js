import { ProjectPhaseConstants } from './constants'

const initState = {
  isPhaseLoading: false,
  isMilestoneLoading: false,
  phases: [],
  milestones: [],
  milestonesByProjectPaginate: [],
  phasesByProjectPaginate: [],
  totalMilestoneDocs: 0,
  totalPhaseDocs: 0,
  performPhase: ''
}

export function projectPhase(state = initState, action) {
  switch (action.type) {
    case ProjectPhaseConstants.GET_PROJECT_PHASE_REQUEST:
    case ProjectPhaseConstants.GET_PERFORM_PHASE_REQUEST:
    case ProjectPhaseConstants.CREATE_PHASE_REQUEST:
    case ProjectPhaseConstants.EDIT_PHASE_REQUEST:
    case ProjectPhaseConstants.DELETE_PHASE_REQUEST:
    case ProjectPhaseConstants.GET_PROJECT_PHASE_PAGINATE_REQUEST:
      return {
        ...state,
        isPhaseLoading: true
      }

    case ProjectPhaseConstants.CREATE_MILESTONE_REQUEST:
    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_REQUEST:
    case ProjectPhaseConstants.EDIT_MILESTONE_REQUEST:
    case ProjectPhaseConstants.DELETE_MILESTONE_REQUEST:
    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_PAGINATE_REQUEST:
      return {
        ...state,
        isMilestoneLoading: true
      }

    case ProjectPhaseConstants.GET_PROJECT_PHASE_FAIL:
    case ProjectPhaseConstants.GET_PERFORM_PHASE_FAIL:
    case ProjectPhaseConstants.CREATE_PHASE_FAIL:
    case ProjectPhaseConstants.EDIT_PHASE_FAIL:
    case ProjectPhaseConstants.DELETE_PHASE_FAIL:
    case ProjectPhaseConstants.GET_PROJECT_PHASE_PAGINATE_FAIL:
      return {
        ...state,
        isPhaseLoading: false
      }
    case ProjectPhaseConstants.CREATE_MILESTONE_FAIL:
    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_FAIL:
    case ProjectPhaseConstants.EDIT_MILESTONE_FAIL:
    case ProjectPhaseConstants.DELETE_MILESTONE_FAIL:
    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_PAGINATE_FAIL:
      return {
        ...state,
        isMilestoneLoading: false
      }

    case ProjectPhaseConstants.GET_PROJECT_PHASE_SUCCESS:
      let updatePhaseId = state.phasesByProjectPaginate.map((item) => item._id) || []
      return {
        ...state,
        isPhaseLoading: false,
        phases: action.payload.docs,
        phasesByProjectPaginate: action.payload.docs.filter((doc) => updatePhaseId.includes(doc._id)),
        totalPhaseDocs: action.payload.totalDocs
      }

    case ProjectPhaseConstants.GET_PERFORM_PHASE_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false,
        performPhase: action.payload
      }

    case ProjectPhaseConstants.CREATE_PHASE_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false,
        performPhase: action.payload,
        phases: [action.payload, ...state.phases],
        phasesByProjectPaginate: [action.payload, ...state.phasesByProjectPaginate],
        totalPhaseDocs: state.totalPhaseDocs + 1
      }

    case ProjectPhaseConstants.EDIT_PHASE_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false,
        performPhase: action.payload,
        phases: state.phases.map((phase) => (phase._id === action.payload._id ? action.payload : phase)),
        phasesByProjectPaginate: state.phasesByProjectPaginate.map((phase) => (phase._id === action.payload._id ? action.payload : phase))
      }

    case ProjectPhaseConstants.DELETE_PHASE_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false,
        performPhase: action.payload,
        phases: state.phases.filter((phase) => phase._id !== action.payload),
        phasesByProjectPaginate: state.phasesByProjectPaginate.filter((phase) => phase._id !== action.payload),
        totalPhaseDocs: state.totalPhaseDocs - 1
      }

    case ProjectPhaseConstants.CREATE_MILESTONE_SUCCESS:
      return {
        ...state,
        isMilestoneLoading: false,
        milestones: [action.payload, ...state.milestones],
        milestonesByProjectPaginate: [action.payload, ...state.milestonesByProjectPaginate],
        totalMilestoneDocs: state.totalMilestoneDocs + 1
      }

    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_SUCCESS:
      let updateMilestoneId = state.milestonesByProjectPaginate.map((item) => item._id) || []
      return {
        ...state,
        isMilestoneLoading: false,
        milestones: action.payload.docs,
        milestonesByProjectPaginate: action.payload.docs.filter((doc) => updateMilestoneId.includes(doc._id)),
        totalMilestoneDocs: action.payload.totalDocs
      }

    case ProjectPhaseConstants.EDIT_MILESTONE_SUCCESS:
      return {
        ...state,
        isMilestoneLoading: false,
        milestones: state.milestones.map((milestone) => (milestone._id === action.payload._id ? action.payload : milestone)),
        milestonesByProjectPaginate: state.milestonesByProjectPaginate.map((milestone) =>
          milestone._id === action.payload._id ? action.payload : milestone
        )
      }

    case ProjectPhaseConstants.DELETE_MILESTONE_SUCCESS:
      return {
        ...state,
        isMilestoneLoading: false,
        milestones: state.milestones.filter((milestone) => milestone._id !== action.payload),
        milestonesByProjectPaginate: state.milestonesByProjectPaginate.filter((milestone) => milestone._id !== action.payload),
        totalMilestoneDocs: state.totalMilestoneDocs - 1
      }

    case ProjectPhaseConstants.GET_PROJECT_MILESTONE_PAGINATE_SUCCESS:
      return {
        ...state,
        isMilestoneLoading: false,
        milestonesByProjectPaginate: action.payload.docs,
        totalMilestoneDocs: action.payload.totalDocs
      }

    case ProjectPhaseConstants.GET_PROJECT_PHASE_PAGINATE_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false,
        phasesByProjectPaginate: action.payload.docs,
        totalPhaseDocs: action.payload.totalDocs
      }

    default:
      return state
  }
}

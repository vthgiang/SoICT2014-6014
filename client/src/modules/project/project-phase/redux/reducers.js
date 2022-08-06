import { ProjectPhaseConstants } from './constants';

const initState = {
    isLoading: false,
    phases: [],
    milestones: [],
    performPhase: '',
}

export function projectPhase(state = initState, action) {
    switch (action.type) {
        case ProjectPhaseConstants.GET_PROJECT_PHASE_REQUEST:
        case ProjectPhaseConstants.GET_PERFORM_PHASE_REQUEST:
        case ProjectPhaseConstants.CREATE_PHASE_REQUEST:
        case ProjectPhaseConstants.EDIT_PHASE_REQUEST:
        case ProjectPhaseConstants.DELETE_PHASE_REQUEST:
        case ProjectPhaseConstants.CREATE_MILESTONE_REQUEST:
        case ProjectPhaseConstants.GET_PROJECT_MILESTONE_REQUEST:
        case ProjectPhaseConstants.EDIT_MILESTONE_REQUEST:
        case ProjectPhaseConstants.DELETE_MILESTONE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case ProjectPhaseConstants.GET_PROJECT_PHASE_FAIL:
        case ProjectPhaseConstants.GET_PERFORM_PHASE_FAIL:
        case ProjectPhaseConstants.CREATE_PHASE_FAIL:
        case ProjectPhaseConstants.EDIT_PHASE_FAIL:
        case ProjectPhaseConstants.DELETE_PHASE_FAIL:
        case ProjectPhaseConstants.CREATE_MILESTONE_FAIL:
        case ProjectPhaseConstants.GET_PROJECT_MILESTONE_FAIL:
        case ProjectPhaseConstants.EDIT_MILESTONE_FAIL:
        case ProjectPhaseConstants.DELETE_MILESTONE_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        case ProjectPhaseConstants.GET_PROJECT_PHASE_SUCCESS:

            return {
                ...state,
                isLoading: false,
                phases: action.payload,
            };

        case ProjectPhaseConstants.GET_PERFORM_PHASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                performPhase: action.payload,
            };

        case ProjectPhaseConstants.CREATE_PHASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                performPhase: action.payload,
                phases: [action.payload, ...state.phases],
            };

        case ProjectPhaseConstants.EDIT_PHASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                performPhase: action.payload,
                phases: state.phases.map(phase => phase._id === action.payload._id ?
                    action.payload : phase),
            };

        case ProjectPhaseConstants.DELETE_PHASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                performPhase: action.payload,
                phases: state.phases.filter(phase => phase._id !== action.payload),
            };

        case ProjectPhaseConstants.CREATE_MILESTONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                milestones: [action.payload, ...state.milestones]
            };

        case ProjectPhaseConstants.GET_PROJECT_MILESTONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                milestones: action.payload,
            };

        case ProjectPhaseConstants.EDIT_MILESTONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                milestones: state.milestones.map(milestone => milestone._id === action.payload._id ?
                    action.payload : milestone),
            };

        case ProjectPhaseConstants.DELETE_MILESTONE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                milestones: state.milestones.filter(milestone => milestone._id !== action.payload),
            };

        default:
            return state;
    }

}
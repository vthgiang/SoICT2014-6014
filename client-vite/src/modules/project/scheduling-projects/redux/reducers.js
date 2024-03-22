import { SchedulingProjectsConstants } from './constants'

const initState = {
  isTaskLoading: false,
  isPhaseLoading: false
}

export function schedulingProjects(state = initState, action) {
  switch (action.type) {
    case SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_REQUEST:
      return {
        ...state,
        isTaskLoading: true
      }

    case SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_FAIL:
      return {
        ...state,
        isTaskLoading: false
      }

    case SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_SUCCESS:
      return {
        ...state,
        isTaskLoading: false
      }

    case SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_REQUEST:
      return {
        ...state,
        isPhaseLoading: true
      }

    case SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_FAIL:
      return {
        ...state,
        isPhaseLoading: false
      }

    case SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_SUCCESS:
      return {
        ...state,
        isPhaseLoading: false
      }

    default:
      return state
  }
}

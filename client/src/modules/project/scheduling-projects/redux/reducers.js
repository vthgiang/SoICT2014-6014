import { SchedulingProjectsConstants } from './constants';

const initState = {
    isLoading: false,
}

export function schedulingProjects(state = initState, action) {
    switch (action.type) {
        case SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM:
            return {
                ...state,
                isLoading: true,
            }

        case SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        case SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM:
            return {
                ...state,
                isLoading: true,
            }

        case SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_FAIL:
            return {
                ...state,
                isLoading: false,
            }

        default:
            return state;
    }

}
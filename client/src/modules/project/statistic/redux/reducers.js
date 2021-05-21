import { StatisticConstants } from './constants';

const initState = {
    isLoading: false,
    listTasksEval: [],
}

export function projectStatistic(state = initState, action) {
    switch (action.type) {
        case StatisticConstants.GET_LIST_TASKS_EVAL:
            return {
                ...state,
                isLoading: true,
            }
        case StatisticConstants.GET_LIST_TASKS_EVAL_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case StatisticConstants.GET_LIST_TASKS_EVAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listTasksEval: action.payload,
            };
            
        default:
            return state;
    }

}
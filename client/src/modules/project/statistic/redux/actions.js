import { StatisticServices } from './services';
import { StatisticConstants } from './constants';

export const StatisticActions = {
    getListTasksEvalDispatch,
}

function getListTasksEvalDispatch(id, evalMonth) {
    return (dispatch) => {
        dispatch({ type: StatisticConstants.GET_LIST_TASKS_EVAL });
        StatisticServices.getListTasksEvalDispatchAPI(id, evalMonth)
            .then((res) => {
                dispatch({
                    type: StatisticConstants.GET_LIST_TASKS_EVAL_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: StatisticConstants.GET_LIST_TASKS_EVAL_FAILE });
            });
    };
}

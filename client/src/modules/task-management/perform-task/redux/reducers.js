import { performTaskConstants } from "./constants";

export function performtasks(state = {}, action) {
    switch (action.type) {
        case performTaskConstants.CREATE_RESULT_TASK_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.CREATE_RESULT_TASK_SUCCESS:
            return {
                ...state,
                adding: false,
                currentTask: action.task.content
            };
        case performTaskConstants.CREATE_RESULT_TASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_RESULT_TASK_REQUEST:
            return {
                ...state
            };
        case performTaskConstants.EDIT_RESULT_TASK_SUCCESS:
            return {
                ...state,
                resulttask: action.resultTask.content
            };
        case performTaskConstants.EDIT_RESULT_TASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_LOGTIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_LOGTIMER_SUCCESS:
            return {
                ...state,
                loading: false,
                logtimer: action.logTimer
            };
        case performTaskConstants.GET_LOGTIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_TIMERSTATUS_REQUEST:
            return {
                ...state,
                currentTimer: null,
                loading: true
            };
        case performTaskConstants.GET_TIMERSTATUS_SUCCESS:
            return {
                ...state,
                currentTimer: action.currentTimer
            };
        case performTaskConstants.GET_TIMERSTATUS_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.START_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.START_TIMER_SUCCESS:
            return {
                ...state,
                currentTimer: action.timer.timerStatus
            };
        case performTaskConstants.START_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.PAUSE_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.PAUSE_TIMER_SUCCESS:
            return {
                ...state,
                currentTimer: action.newTimer.timerStatus
            };
        case performTaskConstants.PAUSE_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.CONTINUE_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.CONTINUE_TIMER_SUCCESS:
            return {
                ...state,
                currentTimer: action.newTimer.timerStatus
            };
        case performTaskConstants.CONTINUE_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.STOP_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.STOP_TIMER_SUCCESS:
            return {
                ...state,
                currentTimer: null
            };
        case performTaskConstants.STOP_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_COMMENTTASK_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_COMMENTTASK_SUCCESS:
            return {
                ...state,
                commenttasks: action.commentTasks
            };
        case performTaskConstants.GET_COMMENTTASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.ADDNEW_COMMENTTASK_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.ADDNEW_COMMENTTASK_SUCCESS:
            return {
                ...state,
                commenttasks: [
                    ...state.commenttasks,
                    action.newComment.commentTask
                ]
            };
        case performTaskConstants.ADDNEW_COMMENTTASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_COMMENTTASK_REQUEST:
            return {
                ...state,
                commenttasks: state.commenttasks.map(comment =>
                    comment._id === action.id
                        ? { ...comment, editing: true }
                        : comment
                )
            };
        case performTaskConstants.EDIT_COMMENTTASK_SUCCESS:
            return {
                ...state,
                commenttasks: state.commenttasks.map(comment =>
                    comment._id === action.newComment.commentTask._id
                        ? action.newComment.commentTask : comment
                )
            };
        case performTaskConstants.EDIT_COMMENTTASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.DELETE_COMMENTTASK_REQUEST:
            return {
                ...state,
                commenttasks: state.commenttasks.map(comment =>
                    comment._id === action.id
                        ? { ...comment, deleting: true }
                        : comment
                )
            };
        case performTaskConstants.DELETE_COMMENTTASK_SUCCESS:
            return {
                ...state,
                commenttasks: state.commenttasks.filter(comment => comment._id !== action.id)
            };
        case performTaskConstants.DELETE_COMMENTTASK_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
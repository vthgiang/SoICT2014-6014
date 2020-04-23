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
        case performTaskConstants.GET_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_ACTIONCOMMENT_SUCCESS:
            return {
                ...state,
                actioncomments: action.actionComments.content
            };
        case performTaskConstants.GET_ACTIONCOMMENT_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_TASKACTION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_TASKACTION_SUCCESS:
            return {
                ...state,
                taskactions: action.taskActions.content
            };
        case performTaskConstants.GET_TASKACTION_FAILURE:
            return {
                error: action.error
            };    
        case performTaskConstants.ADDNEW_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.ADDNEW_ACTIONCOMMENT_SUCCESS:
            return {
                
                ...state,
                actioncomments: [
                    ...state.actioncomments,
                    action.newComment.commentTask
                ]
            };
        case performTaskConstants.ADDNEW_ACTIONCOMMENT_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.ADDNEW_TASKACTION_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.ADDNEW_TASKACTION_SUCCESS:
             return {
                ...state,
                taskactions:[
                    ...state.taskactions,
                    //action.newAction là respone sv trả về.
                    //action.newAction.actionTask.actionTask
                    // actionstasks
                    //casi nafy can fix
                    action.newAction.actionTask[action.newAction.actionTask.length-1]
                ]
            }
        case performTaskConstants.ADDNEW_TASKACTION_FAILURE:
            return {
                error: action.error
            };        
        case performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                actioncomments: state.actioncomments.map(comment =>
                    comment._id === action.id
                        ? { ...comment, editing: true }
                        : comment
                )
            };
        case performTaskConstants.EDIT_ACTIONCOMMENT_SUCCESS:
            return {
                ...state,
                actioncomments: state.actioncomments.map(comment =>
                    comment._id === action.newComment.commentTask._id
                        ? action.newComment.commentTask : comment
                )
            };
        case performTaskConstants.EDIT_ACTIONCOMMENT_FAILURE:
            return {
                error: action.error
            };
            //đây này
        case performTaskConstants.EDIT_TASKACTION_REQUEST:
            return {
                ...state,
                taskactions: state.taskactions.map(action =>
                    action._id === action.id
                        ? { ...action, editing: true }
                        : action
                )
            };
        case performTaskConstants.EDIT_TASKACTION_SUCCESS:
            return {
                ...state,
                taskactions: state.taskactions.map(action1=>
                    action1._id === action.newAction.content._id ? 
                    action.newAction.content : action1)
            };
        case performTaskConstants.EDIT_TASKACTION_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.DELETE_COMMENTTASK_REQUEST:
            return {
                ...state,
                actioncomments: state.actioncomments.map(comment =>
                    comment._id === action.id
                        ? { ...comment, deleting: true }
                        : comment
                )
            };
        case performTaskConstants.DELETE_ACTIONCOMMENT_SUCCESS:
            return {
                ...state,
                actioncomments: state.actioncomments.filter(comment => comment._id !== action.id)
            };
        case performTaskConstants.DELETE_ACTIONTASK_REQUEST:
            return {
                ...state,
                taskactions: state.taskactions.map(action1=>
                    action1._id=== action.id?
                    {...action1,deleting: true}:action1)
            }
        case performTaskConstants.DELETE_TASKACTION_SUCCESS:
            
            return {
                ...state,
                taskactions: state.taskactions.filter(action1 => action1._id !== action.id)
            }
        case performTaskConstants.DELETE_TASKACTION_FAILURE:
            return {
                error: action.error
            }          
        default:
            return state
    }
}
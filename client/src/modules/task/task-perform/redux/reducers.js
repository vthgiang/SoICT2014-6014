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
                currentTask: action.task.data.content
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
                resulttask: action.resultTask.data.content
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
                logtimer: action.logTimer.data.content
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
                currentTimer: action.currentTimer.data.content
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
                currentTimer: action.timer.data.content
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
                currentTimer: action.newTimer.data.content
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
                currentTimer: action.newTimer.data.content
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
        case performTaskConstants.GET_TASKACTION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_TASKACTION_SUCCESS:
            console.log(action.taskActions.data.content)
            return {
                ...state,
                taskactions: action.taskActions.data.content
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
                taskactions : action.newComment.data.content
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
            console.log("ahahahahahahahhaahahha")
            console.log(action.newAction)
             return {
                ...state,
                taskactions : action.newAction.data.content
            }
        case performTaskConstants.ADDNEW_TASKACTION_FAILURE:
            console.log(action)
            return {
                error: action.error
            };        
        case performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                editing : true
            };
        case performTaskConstants.EDIT_ACTIONCOMMENT_SUCCESS:
            return {
                ...state,
                taskactions : action.newComment.data.content
            };
        case performTaskConstants.EDIT_ACTIONCOMMENT_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_TASKACTION_REQUEST:
            return {
                ...state,
                editing :true
            };
        case performTaskConstants.EDIT_TASKACTION_SUCCESS:
            return {
                ...state,
                taskactions : action.newAction.data.content
            };
        case performTaskConstants.EDIT_TASKACTION_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.DELETE_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                deleting : true
            };
        case performTaskConstants.DELETE_ACTIONCOMMENT_SUCCESS:
            
            return {
                ...state,
                taskactions : action.task.data.content
            };
        case performTaskConstants.DELETE_TASKACTION_REQUEST:
            return {
                ...state,
                deleting : true
            }
        case performTaskConstants.DELETE_TASKACTION_SUCCESS:
            
            return {
                ...state,
                taskactions : action.task.data.content
            }
        case performTaskConstants.DELETE_TASKACTION_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.CREATE_TASKCOMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.newComment.data.content
            }
        case performTaskConstants.CREATE_TASKCOMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.GET_TASKCOMMENTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case performTaskConstants.GET_TASKCOMMENTS_SUCCESS:
            return {
                ...state,
                taskcomments: action.taskComments.data.content
            }
        case performTaskConstants.GET_TASKCOMMENTS_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.EDIT_TASKCOMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.newComment.data.content
            }
        case performTaskConstants.EDIT_TASKCOMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.DELETE_TASKCOMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }                 
        case performTaskConstants.DELETE_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.task.data.content
            } 
        case performTaskConstants.DELETE_TASKCOMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.newComment.data.content
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.newComment.data.content
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_SUCCESS:
            return {
                ...state,
                taskcomments: action.comment.data.content
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.EVALUATION_ACTION_REQUEST:
            return {
                ...state,
                evaluating: true
            }
        case performTaskConstants.EVALUATION_ACTION_SUCCESS:
            return {
                ...state,
                taskactions: action.evaluations.data.content
            } 
        case performTaskConstants.EVALUATION_ACTION_FAILURE:
            return {
                ...state,
                error: action.error
            }                                                                                  
        default:
            return state
    }
}
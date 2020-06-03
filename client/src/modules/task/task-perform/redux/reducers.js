import { performTaskConstants } from "./constants";
import {taskManagementConstants} from "../../task-management/redux/constants"
export function performtasks(state = {}, action) {
    switch (action.type) {
        case taskManagementConstants.GETTASK_BYID_REQUEST:
            return {
                ...state,
                task: null,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_BYID_SUCCESS:
            return {
                ...state,
                task: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_BYID_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
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
        case performTaskConstants.GET_TIMESHEETLOGS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_TIMESHEETLOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                logtimer: action.payload.data.content
            };
        case performTaskConstants.GET_TIMESHEETLOGS_FAILURE:
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
                currentTimer: action.payload.data.content
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
                currentTimer: action.payload.data.content
            };
        case performTaskConstants.START_TIMER_FAILURE:
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
                logtimer: action.payload.data.content,
                currentTimer: null,
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
        case performTaskConstants.ADDNEW_ACTIONCOMMENT_SUCCESS:
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
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
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
        case performTaskConstants.ADDNEW_TASKACTION_FAILURE:
            return {
                error: action.error
            };        
        case performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST:
            return {
                ...state,
                editing : true
            };
        case performTaskConstants.EDIT_ACTIONCOMMENT_SUCCESS:
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
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
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
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
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
        case performTaskConstants.DELETE_TASKACTION_REQUEST:
            return {
                ...state,
                deleting : true
            }
        case performTaskConstants.DELETE_TASKACTION_SUCCESS:
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
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
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskcomments
                }
            }
        case performTaskConstants.CREATE_TASKCOMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.EDIT_TASKCOMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_TASKCOMMENT_SUCCESS:
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskcomments
                }
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
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
            return {
               ...state,
               task : {
                   ...state.task,
                   info : taskcomments
               }
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
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskcomments
                }
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
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskcomments
                }
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
            var taskcomments = {...state.task.info,taskComments:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskcomments
                }
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
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
        case performTaskConstants.EVALUATION_ACTION_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.CONFIRM_ACTION_REQUEST:
            return {
                ...state,
                abc : true
            }
        case performTaskConstants.CONFIRM_ACTION_SUCCESS:
            var taskactions = {...state.task.info,taskActions:action.payload.data.content}
             return {
                ...state,
                task : {
                    ...state.task,
                    info : taskactions
                }
            }
        case performTaskConstants.CONFIRM_ACTION_FAILURE:
            return {
                ...state,
                error: action.error
            }  
        case performTaskConstants.DOWNLOAD_FILE_REQUEST:      
        case performTaskConstants.DOWNLOAD_FILE_FAILURE:
        case performTaskConstants.DOWNLOAD_FILE_SUCCESS:
        case performTaskConstants.UPLOAD_FILE_REQUEST:
            return {
                ...state,
                abc : true
            }
        case performTaskConstants.UPLOAD_FILE_SUCCESS:
            return {
                ...state,
                files : action.payload.data.content
            }
        case performTaskConstants.UPLOAD_FILE_FAILURE:                                                                                                  
        default:
            return state
    }
}
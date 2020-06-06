import { taskManagementConstants } from "./constants";

export function tasks(state = {}, action) {
    switch (action.type) {
        case taskManagementConstants.GETALL_TASK_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETALL_TASK_SUCCESS:
            return {
                ...state,
                items: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETALL_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
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
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingResponsible: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingAccountable: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingAccountable: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingConsulted: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingInformed: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingCreator: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_SUCCESS:            
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    action.payload
                ],
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        // case taskManagementConstants.EDIT_TASK_REQUEST:
        //     return {
        //         ...state,
        //         items: state.items.map(task =>
        //             task._id === action.id
        //                 ? { ...task, editing: true }
        //                 : task
        //         ),
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_SUCCESS:

        // console.log(action.payload)
        //     return {
        //         ...state,
        //         tasks: state.tasks.map(task =>
        //             task._id === action.payload.info._id
        //                 ? action.payload.info : task
        //         ),
        //         task: action.payload,
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_FAILURE:
        //     return {
        //         error: action.error,
        //         isLoading: false
        //     };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload     
                }
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: state.tasks.filter(task => task._id !== action.payload._id),
            };
            
        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.DELETE_TASK_REQUEST:
            return {
                ...state,
                items: state.items.map(task =>
                    task._id === action.id
                        ? { ...task, deleting: true }
                        : task
                ),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_SUCCESS:
            return {
                ...state,
                items: state.items.filter(task => task._id !== action.id),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_REQUEST:
            return {
                ...state,
                subtasks: null,
                isLoading: true
            };
        case taskManagementConstants.GET_SUBTASK_SUCCESS:
            return {
                ...state,
                subtasks: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            }
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload
                }
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload
                }
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload
                }
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload
                }
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading : true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: {
                    info : action.payload
                }
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        default:
            return state
    }
}
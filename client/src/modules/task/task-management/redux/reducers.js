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
                items: action.tasks,
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
                task: action.task,
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
                tasks: action.taskResponsibles.tasks,
                pages: action.taskResponsibles.totalpage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingAccountable: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskAccounatables.tasks,
                pages: action.taskAccounatables.totalpage,
                loadingAccountable: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_FAILURE:
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
                tasks: action.taskConsulteds.tasks,
                pages: action.taskConsulteds.totalpage,
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
                tasks: action.taskInformeds.tasks,
                pages: action.taskInformeds.totalpage,
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
                tasks: action.taskCreators.tasks,
                pages: action.taskCreators.totalpage,
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
                    action.task.data
                ],
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.EDIT_TASK_REQUEST:
            return {
                ...state,
                items: state.items.map(task =>
                    task._id === action.id
                        ? { ...task, editing: true }
                        : task
                ),
                isLoading: false
            };
        case taskManagementConstants.EDIT_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task._id === action.newTask.info._id
                        ? action.newTask.info : task
                ),
                task: action.newTask,
                isLoading: false
            };
        case taskManagementConstants.EDIT_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
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
                    info : action.task.content
                }
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_FAILURE:
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
        default:
            return state
    }
}
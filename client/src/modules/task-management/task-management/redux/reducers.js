import { taskManagementConstants } from "./constants";

export function tasks(state = {}, action) {
    switch (action.type) {
        case taskManagementConstants.GETALL_TASK_REQUEST:
            return {
                ...state,
                loading: true
            };
        case taskManagementConstants.GETALL_TASK_SUCCESS:
            return {
                ...state,
                items: action.tasks
            };
        case taskManagementConstants.GETALL_TASK_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_BYID_REQUEST:
            return {
                ...state,
                task: null,
                loading: true,
            };
        case taskManagementConstants.GETTASK_BYID_SUCCESS:
            return {
                ...state,
                task: action.task
            };
        case taskManagementConstants.GETTASK_BYID_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingResponsible: true
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskResponsibles.tasks,
                pages: action.taskResponsibles.totalpage,
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingAccountable: true
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskAccounatables.tasks,
                pages: action.taskAccounatables.totalpage,
                loadingAccountable: false
            };
        case taskManagementConstants.GETTASK_ACCOUNATABLE_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingConsulted: true
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskConsulteds.tasks,
                pages: action.taskConsulteds.totalpage,
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingInformed: true
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskInformeds.tasks,
                pages: action.taskInformeds.totalpage,
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                loadingCreator: true
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS:
            return {
                ...state,
                tasks: action.taskCreators.tasks,
                pages: action.taskCreators.totalpage,
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true
            };
        case taskManagementConstants.ADDNEW_TASK_SUCCESS:
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    action.task.data
                ]
            };
        case taskManagementConstants.ADDNEW_TASK_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.EDIT_TASK_REQUEST:
            return {
                ...state,
                items: state.items.map(task =>
                    task._id === action.id
                        ? { ...task, editing: true }
                        : task
                )
            };
        case taskManagementConstants.EDIT_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task._id === action.newTask.info._id
                        ? action.newTask.info : task
                ),
                task: action.newTask
            };
        case taskManagementConstants.EDIT_TASK_FAILURE:
            return {
                error: action.error
            };
        case taskManagementConstants.DELETE_TASK_REQUEST:
            return {
                ...state,
                items: state.items.map(task =>
                    task._id === action.id
                        ? { ...task, deleting: true }
                        : task
                )
            };
        case taskManagementConstants.DELETE_TASK_SUCCESS:
            return {
                ...state,
                items: state.items.filter(task => task._id !== action.id)
            };
        case taskManagementConstants.DELETE_TASK_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
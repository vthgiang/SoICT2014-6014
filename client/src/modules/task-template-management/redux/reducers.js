import { taskTemplateConstants } from "../redux/constants";

export function tasktemplates(state = {}, action) {
    switch (action.type) {
        case taskTemplateConstants.GETALL_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case taskTemplateConstants.GETALL_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: action.templates
            };
        case taskTemplateConstants.GETALL_TEMPLATE_FAILURE:
            return {
                error: action.error
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_REQUEST:
            return {
                ...state,
                loadingByRole: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS:
            return {
                ...state,
                items: action.tasktemplates
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_FAILURE:
            return {
                error: action.error
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_REQUEST:
            return {
                ...state,
                loadingByUser: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS:
            return {
                ...state,
                items: action.tasktemplates.message,
                pageTotal: action.tasktemplates.pages
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_FAILURE:
            return {
                error: action.error
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_REQUEST:
            return {
                ...state,
                template: null,
                loadingById: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_SUCCESS:
            return {
                ...state,
                template: action.tasktemplate
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_FAILURE:
            return {
                
                error: action.error
            };
        case taskTemplateConstants.ADDNEW_TEMPLATE_REQUEST:
            return {
                ...state,
                adding: true
            };
        case taskTemplateConstants.ADDNEW_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.taskTemplate.data
                ]
            };
        case taskTemplateConstants.ADDNEW_TEMPLATE_FAILURE:
            return {
                error: action.error
            };
        case taskTemplateConstants.EDIT_TEMPLATE_REQUEST:
            return {
                ...state,
                items: state.items.map(template =>
                    template._id === action.id
                        ? { ...template, editing: true }
                        : template
                )
            };
        case taskTemplateConstants.EDIT_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.map(template =>
                    template._id === action.taskTemplate.tasktemplate._id
                        ? action.taskTemplate.tasktemplate : template
                )
            };
        case taskTemplateConstants.EDIT_TEMPLATE_FAILURE:
            return {
                error: action.error
            };
        case taskTemplateConstants.DELETE_TEMPLATE_REQUEST:
            return {
                ...state,
                items: state.items.map(template =>
                    template.resourceId._id === action.id
                        ? { ...template, deleting: true }
                        : template
                )
            };
        case taskTemplateConstants.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.filter(template => template.resourceId._id !== action.id)
            };
        case taskTemplateConstants.DELETE_TEMPLATE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
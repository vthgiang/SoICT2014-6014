import { taskTemplateConstants } from "../redux/constants";

export function tasktemplates(state = {}, action) {
    switch (action.type) {
        case taskTemplateConstants.GETALL_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case taskTemplateConstants.GETALL_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: action.templates,
                isLoading: false
            };
        case taskTemplateConstants.GETALL_TEMPLATE_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_REQUEST:
            return {
                ...state,
                loadingByRole: true,
                isLoading: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS:
            return {
                ...state,
                items: action.tasktemplates,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYROLE_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_REQUEST:
            return {
                ...state,
                loadingByUser: true,
                isLoading: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS:
            return {
                ...state,
                items: action.tasktemplates.message,
                pageTotal: action.tasktemplates.pages,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_REQUEST:
            return {
                ...state,
                template: null,
                loadingById: true,
                isLoading: true
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_SUCCESS:
            return {
                ...state,
                template: action.tasktemplate,
                isLoading: false
            };
        case taskTemplateConstants.GETTEMPLATE_BYID_FAILURE:
            return {
                
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.ADDNEW_TEMPLATE_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };
        case taskTemplateConstants.ADDNEW_TEMPLATE_SUCCESS:
            if(state.items.length < 5){ 
                return {
                    ...state,
                    items: [
                        ...state.items,
                        action.taskTemplate.data
                    ],
                    isLoading: false
                };    
            }
            else{
                return {
                    ...state,
                    isLoading: false
                };
            }
            
        case taskTemplateConstants.ADDNEW_TEMPLATE_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.EDIT_TEMPLATE_REQUEST:
            return {
                    ...state,
                    items: state.items.map(template =>
                        template._id === action.id
                             ? { ...template, editing: true }
                             : template
                        ),
                    isLoading: false
                };
        case taskTemplateConstants.EDIT_TEMPLATE_SUCCESS:
            return {
                    ...state,
                    items: state.items.map(template =>
                        template._id === action.taskTemplate.data._id
                            ? action.taskTemplate.data :  template
                    ),
                    isLoading: false
                };
        case taskTemplateConstants.EDIT_TEMPLATE_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskTemplateConstants.DELETE_TEMPLATE_REQUEST:
            return {
                ...state,
                items: state.items.map(template =>
                    template.resourceId._id === action.id
                        ? { ...template, deleting: true }
                        : template
                ),
                isLoading: false
            };
        case taskTemplateConstants.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.filter(template => template.resourceId._id !== action.id),
                isLoading: false
            };
        case taskTemplateConstants.DELETE_TEMPLATE_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        default:
            return state
    }
}
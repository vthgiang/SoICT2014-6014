import { kpiTemplateConstants } from "../redux/constants";

export function kpitemplates(state = {}, action) {
    switch (action.type) {

        case kpiTemplateConstants.GETALL_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GETALL_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: action.payload.content.templates,
                isLoading: false
            };

        case kpiTemplateConstants.GETALL_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.GETTEMPLATE_BYROLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS:
            return {
                ...state,
                items: action.payload.content.kpitemplates,
                isLoading: false
            };

        case kpiTemplateConstants.GETTEMPLATE_BYROLE_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case kpiTemplateConstants.GETTEMPLATE_BYUSER_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS:
            return {
                ...state,
                items: action.payload.docs,
                pageTotal: action.payload.totalPages,
                isLoading: false
            };

        case kpiTemplateConstants.GETTEMPLATE_BYUSER_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case kpiTemplateConstants.GETTEMPLATE_BYID_REQUEST:
            return {
                ...state,
                kpiTemplate: {},
                isLoading: true
            };

        case kpiTemplateConstants.GETTEMPLATE_BYID_SUCCESS:
            return {
                ...state,
                kpiTemplate: action.payload.content,
                isLoading: false
            };

        case kpiTemplateConstants.GETTEMPLATE_BYID_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.ADDNEW_TEMPLATE_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };

        case kpiTemplateConstants.ADDNEW_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.payload.content
                ],
                isLoading: false
            };

        case kpiTemplateConstants.ADDNEW_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.EDIT_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.EDIT_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.map(template =>
                    template._id === action.payload.content._id
                        ? action.payload.content
                        : template
                ),
                kpiTemplate: action.payload.content,
                isLoading: false
            };

        case kpiTemplateConstants.EDIT_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.filter(template => template._id !== action.payload.id),
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.IMPORT_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case kpiTemplateConstants.IMPORT_TEMPLATE_SUCCESS:
            let item = [...state.items];
            for (let i in action.payload.content) {
                item = [...item, action.payload.content[i]];
            }
            return {
                ...state,
                isLoading: false,
                items: item,
            };

        case kpiTemplateConstants.IMPORT_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
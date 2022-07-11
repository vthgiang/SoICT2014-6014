import { kpiTemplateConstants } from "../redux/constants";

export function kpitemplates(state = {}, action) {
    switch (action.type) {

        case kpiTemplateConstants.GET_TEMPLATE_KPI_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GET_TEMPLATE_KPI_SUCCESS:
            return {
                ...state,
                items: action.payload.kpiTemplates,
                totalCount: action.payload.totalCount,
                totalPage: action.payload.totalPage,
                isLoading: false
            };

        case kpiTemplateConstants.GET_TEMPLATE_KPI_FAILURE:
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
            const res = state.items.kpiTemplates.filter(template => template._id !== action.payload.content.id)
            return {
                ...state,
                items: res,
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
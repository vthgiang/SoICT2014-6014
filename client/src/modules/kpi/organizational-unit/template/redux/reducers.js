import { kpiTemplateConstants } from "../redux/constants";

export function kpitemplates(state = {
    items: [],
    isLoading: false
}, action) {
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

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_SUCCESS:
            return {
                ...state,
                items: action.payload.content.kpitemplates,
                isLoading: false
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_SUCCESS:
            return {
                ...state,
                items: action.payload.docs,
                pageTotal: action.payload.totalPages,
                isLoading: false
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_REQUEST:
            return {
                ...state,
                kpiTemplate: {},
                isLoading: true
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_SUCCESS:
            return {
                ...state,
                kpiTemplate: action.payload.content,
                isLoading: false
            };

        case kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.ADD_KPI_TEMPLATE_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };

        case kpiTemplateConstants.ADD_KPI_TEMPLATE_SUCCESS:
            const newState = {
                ...state,
                items: [
                    action.payload.content,
                    ...state.items,
                ],
                isLoading: false
            }
            return newState;

        case kpiTemplateConstants.ADD_KPI_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.EDIT_KPI_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.EDIT_KPI_TEMPLATE_SUCCESS:
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

        case kpiTemplateConstants.EDIT_KPI_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_KPI_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_KPI_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.filter(template => template._id !== action.payload.content._id),
                isLoading: false
            };

        case kpiTemplateConstants.DELETE_KPI_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case kpiTemplateConstants.IMPORT_KPI_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case kpiTemplateConstants.IMPORT_KPI_TEMPLATE_SUCCESS:
            let item = [...state.items];
            for (let i in action.payload.content) {
                item = [...item, action.payload.content[i]];
            }
            return {
                ...state,
                isLoading: false,
                items: item,
            };

        case kpiTemplateConstants.IMPORT_KPI_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
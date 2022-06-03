import { ProjectTemplateConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}
const initState = {
    isLoading: false,
    salaries: [],
    list: [],
    totalItems: 0,
}

export function projectTemplate(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    var indexUserAll = -1;
    switch (action.type) {
        case ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_REQUEST:
        case ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_REQUEST:
        case ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_REQUEST:
        case ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_REQUEST:
        case ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_REQUEST:
        case ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE:
            return {
                ...state,
                isLoading: true,
            }

        case ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_FAILE:
        case ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                totalItems: action.payload.totalItems,
                list: action.payload.list,
                // data: {
                //     ...state.data,
                //     paginate: action.payload.docs,
                //     totalDocs: action.payload.totalDocs,
                //     limit: action.payload.limit,
                //     totalPages: action.payload.totalPages,
                //     page: action.payload.page,
                //     pagingCounter: action.payload.pagingCounter,

                //     hasPrevPage: action.payload.hasPrevPage,
                //     hasNextPage: action.payload.hasNextPage,
                //     prevPage: action.payload.prevPage,
                //     nextPage: action.payload.nextPage,
                // }
            }
        case ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                list: [
                    action.payload,
                    ...state.list
                ],
            }
        case ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_SUCCESS:
            index = findIndex(state.list, action.payload);
            if (index !== -1) state.list.splice(index, 1);
            return {
                ...state,
                isLoading: false
            };

        case ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if (index !== -1) state.list[index] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if (index !== -1) state.list[index] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                salaries: action.payload,
            };

        default:
            return state;
    }

}
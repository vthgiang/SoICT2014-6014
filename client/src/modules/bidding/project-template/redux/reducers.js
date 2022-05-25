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
        case ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE:
            return {
                ...state,
                isLoading: true,
            }

        case ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_FAILE:
        case ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_FAILE:
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
                data: {
                    ...state.data,
                    list: [
                        action.payload,
                        ...state.data.list
                    ],
                    paginate: [
                        action.payload,
                        ...state.data.paginate,
                    ],
                    listbyuser: [
                        action.payload,
                        ...state.data.listbyuser,
                    ]
                }
            }
        case ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_SUCCESS:
            index = findIndex(state.data.list, action.payload);
            if (index !== -1) state.data.list.splice(index, 1);
            indexPaginate = findIndex(state.data.paginate, action.payload);
            if (indexPaginate !== -1) state.data.paginate.splice(indexPaginate, 1);
            indexUserAll = findIndex(state.data.listbyuser, action.payload);
            if (indexUserAll !== -1) state.data.listbyuser.splice(indexUserAll, 1);
            return {
                ...state,
                isLoading: false
            };

        case ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_SUCCESS:
            index = findIndex(state.data.list, action.payload._id);
            if (index !== -1) state.data.list[index] = action.payload;
            indexPaginate = findIndex(state.data.paginate, action.payload._id);
            if (indexPaginate !== -1) state.data.paginate[indexPaginate] = action.payload;
            indexUserAll = findIndex(state.data.listbyuser, action.payload);
            if (indexUserAll !== -1) state.data.listbyuser.splice(indexUserAll, 1);
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
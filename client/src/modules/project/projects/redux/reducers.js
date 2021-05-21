import { ProjectConstants } from './constants';

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
    value: {},
    isLoading: false,
    data: {
        list: [], paginate: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: 0,
        nextPage: 0,
    },
    salaries: [],
}

export function project(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case ProjectConstants.GET_PROJECTS_REQUEST:
        case ProjectConstants.CREATE_PROJECTS_REQUEST:
        case ProjectConstants.DELETE_PROJECTS_REQUEST:
        case ProjectConstants.EDIT_PROJECTS_REQUEST:
        case ProjectConstants.GET_SALARY_MEMBER:
        case ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST:
        case ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS:
            return {
                ...state,
                isLoading: true,
            }

        case ProjectConstants.GET_PROJECTS_FAILE:
        case ProjectConstants.CREATE_PROJECTS_FAILE:
        case ProjectConstants.DELETE_PROJECTS_FAILE:
        case ProjectConstants.EDIT_PROJECTS_FAILE:
        case ProjectConstants.GET_SALARY_MEMBER_FAILE:
        case ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST_FAILE:
        case ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case ProjectConstants.GET_PROJECTS_SUCCESS:
            if (action.calledId === "paginate") {
                return {
                    ...state,
                    isLoading: false,
                    data: {
                        ...state.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,

                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            }
            else {
                return {
                    ...state,
                    isLoading: false,
                    data: {
                        ...state.data,
                        list: action.payload
                    }
                }
            }
        case ProjectConstants.CREATE_PROJECTS_SUCCESS:
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
                    ]
                }
            }
        case ProjectConstants.DELETE_PROJECTS_SUCCESS:
            index = findIndex(state.data.list, action.payload);
            if (index !== -1) state.data.list.splice(index, 1);
            indexPaginate = findIndex(state.data.paginate, action.payload);
            if (indexPaginate !== -1) state.data.paginate.splice(indexPaginate, 1);
            return {
                ...state,
                isLoading: false
            };

        case ProjectConstants.EDIT_PROJECTS_SUCCESS:
            index = findIndex(state.data.list, action.payload._id);
            if (index !== -1) state.data.list[index] = action.payload;
            indexPaginate = findIndex(state.data.paginate, action.payload._id);
            if (indexPaginate !== -1) state.data.paginate[indexPaginate] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case ProjectConstants.GET_SALARY_MEMBER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                salaries: action.payload,
            };

        case ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            }

        case ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                changeRequests: action.payload,
            }

        default:
            return state;
    }

}
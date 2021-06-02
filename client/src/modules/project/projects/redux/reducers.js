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
        list: [], paginate: [], listbyuser: [],
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
    var indexUserAll = -1;
    switch (action.type) {
        case ProjectConstants.GET_PROJECTS_REQUEST:
        case ProjectConstants.CREATE_PROJECTS_REQUEST:
        case ProjectConstants.DELETE_PROJECTS_REQUEST:
        case ProjectConstants.EDIT_PROJECTS_REQUEST:
        case ProjectConstants.GET_SALARY_MEMBER:
            return {
                ...state,
                isLoading: true,
            }

        case ProjectConstants.GET_PROJECTS_FAILE:
        case ProjectConstants.CREATE_PROJECTS_FAILE:
        case ProjectConstants.DELETE_PROJECTS_FAILE:
        case ProjectConstants.EDIT_PROJECTS_FAILE:
        case ProjectConstants.GET_SALARY_MEMBER_FAILE:
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
            else if (action.calledId === "user_all") {
                return {
                    ...state,
                    isLoading: false,
                    data: {
                        ...state.data,
                        listbyuser: action.payload
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
                    ],
                    listbyuser: [
                        action.payload,
                        ...state.data.listbyuser,
                    ]
                }
            }
        case ProjectConstants.DELETE_PROJECTS_SUCCESS:
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

        case ProjectConstants.EDIT_PROJECTS_SUCCESS:
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

        case ProjectConstants.GET_SALARY_MEMBER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                salaries: action.payload,
            };

        default:
            return state;
    }

}
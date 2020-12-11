import { AdminDepartmentConstants } from './constants';

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
    listAdminDepartments: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0
}

export function adminDepartments(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_REQUEST:
        case AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_REQUEST:
        case AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_FAILURE:
        case AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_FAILURE:
        case AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAdminDepartments: action.payload.allAdminDepartments.docs,
                totalDocs: action.payload.allAdminDepartments.totalDocs,
                limit: action.payload.allAdminDepartments.limit,
                totalPages: action.payload.allAdminDepartments.totalPages,
                page: action.payload.allAdminDepartments.page,
                pagingCounter: action.payload.allAdminDepartments.pagingCounter,
                hasPrevPage: action.payload.allAdminDepartments.hasPrevPage,
                hasNextPage: action.payload.allAdminDepartments.hasNextPage,
                prevPage: action.payload.allAdminDepartments.prevPage,
                nextPage: action.payload.allAdminDepartments.nextPage

            }
        case AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_SUCCESS:
            return {
                ...state,
                listAdminDepartments: [
                    ...state.listAdminDepartments,
                    action.payload.adminDepartment
                ],
                isLoading: false
            }
        case AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_SUCCESS:
            index = findIndex(state.listAdminDepartments, action.payload.adminDepartment._id);
            if (index !== -1) {
                state.listAdminDepartments[index] = action.payload.adminDepartment
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state

    }
}
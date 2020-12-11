import { BusinessDepartmentConstants } from './constants';

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
    listBusinessDepartments: [],
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

export function businessDepartments(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_REQUEST:
        case BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_REQUEST:
        case BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_FAILURE:
        case BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_FAILURE:
        case BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBusinessDepartments: action.payload.allBusinessDepartments.docs,
                totalDocs: action.payload.allBusinessDepartments.totalDocs,
                limit: action.payload.allBusinessDepartments.limit,
                totalPages: action.payload.allBusinessDepartments.totalPages,
                page: action.payload.allBusinessDepartments.page,
                pagingCounter: action.payload.allBusinessDepartments.pagingCounter,
                hasPrevPage: action.payload.allBusinessDepartments.hasPrevPage,
                hasNextPage: action.payload.allBusinessDepartments.hasNextPage,
                prevPage: action.payload.allBusinessDepartments.prevPage,
                nextPage: action.payload.allBusinessDepartments.nextPage

            }
        case BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_SUCCESS:
            return {
                ...state,
                listBusinessDepartments: [
                    ...state.listBusinessDepartments,
                    action.payload.businessDepartment
                ],
                isLoading: false
            }
        case BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_SUCCESS:
            index = findIndex(state.listBusinessDepartments, action.payload.businessDepartment._id);
            if (index !== -1) {
                state.listBusinessDepartments[index] = action.payload.businessDepartment
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state

    }
}
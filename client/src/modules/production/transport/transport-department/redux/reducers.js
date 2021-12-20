import { transportDepartmentConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    isLoading: false,
}
export function transportDepartment(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_REQUEST:
        case transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_REQUEST:
        case transportDepartmentConstants.GET_USER_BY_ROLE_REQUEST:
        case transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_FAILURE:
        case transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_FAILURE:
        case transportDepartmentConstants.GET_USER_BY_ROLE_FAILURE:
        case transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                isLoading: false
            }
        case transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case transportDepartmentConstants.GET_USER_BY_ROLE_SUCCESS:
            let res = [];
            if (state && state.listUser && state.listUser.length !== 0) {
                res = state.listUser.filter(r => Number(r.role) !== Number(action.payload?.role));
                res.push(action.payload);
            }
            else {
                res = [action.payload];
            }
            return {
                ...state,
                listUser: res,
                isLoading: false
            }
        case transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(department => (department?._id !== action.payload?._id)),
                isLoading: false
            }
        default:
            return state
    }
}

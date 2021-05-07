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
    isLoading: true,
}
export function transportDepartment(state = initialState, action) {
    let index = -1;
    switch (action.type) {
		case transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_REQUEST:
        case transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_FAILURE:
        case transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_FAILURE:    
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
		default:
            		return state
}
}

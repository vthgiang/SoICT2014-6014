import { DepartmentConstants } from "./constants";

const initState = {
    list: [],
    tree: null,
    item: null,
    error: null,
    isLoading: false
}

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if(value._id === id){
            result = index;
        }
    });
    return result;
}

export function department(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case DepartmentConstants.GET_DEPARTMENTS_REQUEST:
        case DepartmentConstants.CREATE_DEPARTMENT_REQUEST:
        case DepartmentConstants.DELETE_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case DepartmentConstants.GET_DEPARTMENTS_FAILE:
        case DepartmentConstants.CREATE_DEPARTMENT_FAILE:
        case DepartmentConstants.DELETE_DEPARTMENT_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case DepartmentConstants.GET_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                list: action.payload.list,
                tree: action.payload.tree,
                isLoading: false
            };

        case DepartmentConstants.CREATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload.department
                ],
                tree: action.payload.tree,
                isLoading: false
            };

        case DepartmentConstants.DELETE_DEPARTMENT_SUCCESS:
            index = findIndex(state.list, action.payload.id);
            if(index !== -1){
                state.list.splice(index, 1);
            }
            return {
                ...state,
                tree: action.payload.data.tree,
                isLoading: false
            };
        case DepartmentConstants.GETALL_REQUEST:
                return {
                  loading: true
                };
        case DepartmentConstants.GETALL_SUCCESS:
                return {
                  items: action.departments
                };
        case DepartmentConstants.GETALL_FAILURE:
                return { 
                  error: action.error
                };
        case DepartmentConstants.GETDEPARTMENT_OFUSER_REQUEST:
            return {
                loading: true
            };
        case DepartmentConstants.GETDEPARTMENT_OFUSER_SUCCESS:
            return {
                ...state,
                unitofuser: action.departments
            };
        case DepartmentConstants.GETDEPARTMENT_OFUSER_FAILURE:
            return { 
                error: action.error
            };


        case 'LOGOUT':
            return initState;

        default:
            return state;
    }
}
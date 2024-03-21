import { DepartmentConstants } from './constants'

const initState = {
  list: [],
  tree: null,
  item: null,
  error: null,
  isLoading: false
}

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })

  return result
}

export function department(state = initState, action) {
  var index = -1
  switch (action.type) {
    case DepartmentConstants.GET_DEPARTMENTS_REQUEST:
    case DepartmentConstants.CREATE_DEPARTMENT_REQUEST:
    case DepartmentConstants.EDIT_DEPARTMENT_REQUEST:
    case DepartmentConstants.DELETE_DEPARTMENT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      }

    case DepartmentConstants.GET_DEPARTMENTS_FAILE:
    case DepartmentConstants.CREATE_DEPARTMENT_FAILE:
    case DepartmentConstants.EDIT_DEPARTMENT_FAILE:
    case DepartmentConstants.DELETE_DEPARTMENT_FAILE:
      return {
        ...state,
        loading: false,
        isLoading: false
      }

    case DepartmentConstants.GET_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        tree: action.payload.tree,
        isLoading: false
      }

    case DepartmentConstants.GET_DEPARTMENT_REQUEST:
      return {
        ...state,
        unitLoading: true,
        loading: true,
        isLoading: true
      }
    case DepartmentConstants.GET_DEPARTMENT_SUCCESS:
      return {
        ...state,
        unitLoading: false,
        loading: false,
        unit: action.payload,
        isLoading: false
      }
    case DepartmentConstants.GET_DEPARTMENT_FAILURE:
      return {
        ...state,
        unitLoading: false,
        loading: false,
        isLoading: false
      }

    case DepartmentConstants.CREATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload.department],
        tree: action.payload.tree,
        isLoading: false
      }

    case DepartmentConstants.EDIT_DEPARTMENT_SUCCESS:
      index = findIndex(state.list, action.payload.department._id)

      if (index !== -1) {
        state.list[index] = action.payload.department
      }

      return {
        ...state,
        tree: action.payload.tree,
        isLoading: false
      }

    case DepartmentConstants.DELETE_DEPARTMENT_SUCCESS:
      index = findIndex(state.list, action.payload.id)

      if (index !== -1) {
        state.list.splice(index, 1)
      }

      return {
        ...state,
        tree: action.payload.data.tree,
        isLoading: false
      }

    case DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_MANAGER_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_MANAGER_SUCCESS:
      return {
        ...state,
        departmentsThatUserIsManager: action.payload.data,
        isLoading: false
      }

    case DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_MANAGER_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
      }

    case DepartmentConstants.IMPORT_DEPARTMENT_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case DepartmentConstants.IMPORT_DEPARTMENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload.department],
        tree: action.payload.tree,
        isLoading: false
      }

    case DepartmentConstants.IMPORT_DEPARTMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }

    default:
      return { ...state }
  }
}

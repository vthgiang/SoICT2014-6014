import { EmployeeConstants } from './constants'

const initialState = {
  isLoading: false,
  listEmployees: [],
  listEmployeesNotConfirm: []
}

export function employee(state = initialState, action) {
  switch (action.type) {
    case EmployeeConstants.GET_ALL_EMPLOYEE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case EmployeeConstants.GET_ALL_EMPLOYEE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listEmployees: action.payload.listEmployees,
        listEmployeesNotConfirm: action.payload.listEmployeesNotConfirm
      }
    case EmployeeConstants.GET_ALL_EMPLOYEE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case EmployeeConstants.CONFIRM_EMPLOYEE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case EmployeeConstants.CONFIRM_EMPLOYEE_SUCCESS:
    case EmployeeConstants.CONFIRM_EMPLOYEE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case EmployeeConstants.REMOVE_EMPLOYEE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case EmployeeConstants.REMOVE_EMPLOYEE_SUCCESS:
    case EmployeeConstants.REMOVE_EMPLOYEE_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

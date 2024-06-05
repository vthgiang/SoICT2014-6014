import { EmployeeConstants } from './constants'
import * as EmployeeServices from './services'

export const EmployeeActions = {
  getAllEmployee: () => {
    return async (dispatch) => {
      dispatch({ type: EmployeeConstants.GET_ALL_EMPLOYEE_REQUEST })
      try {
        const res = await EmployeeServices.getAllEmployee()
        if (res.status === 200) {
          dispatch({
            type: EmployeeConstants.GET_ALL_EMPLOYEE_SUCCESS,
            payload: res.data
          })
        } else {
          dispatch({ type: EmployeeConstants.GET_ALL_EMPLOYEE_FAILURE })
        }
      } catch (error) {
        dispatch({ type: EmployeeConstants.GET_ALL_EMPLOYEE_FAILURE })
      }
    }
  },
  confirmEmployee: (employeeId) => {
    return async (dispatch) => {
      dispatch({ type: EmployeeConstants.CONFIRM_EMPLOYEE_REQUEST })
      try {
        const res = await EmployeeServices.confirmEmployee(employeeId)
        if (res.status === 200) {
          dispatch({
            type: EmployeeConstants.CONFIRM_EMPLOYEE_SUCCESS,
            payload: employeeId
          })
        } else {
          dispatch({ type: EmployeeConstants.CONFIRM_EMPLOYEE_FAILURE })
        }
      } catch (error) {
        dispatch({ type: EmployeeConstants.CONFIRM_EMPLOYEE_FAILURE })
      }
    }
  },
  removeEmployee: (employeeId) => {
    return async (dispatch) => {
      dispatch({ type: EmployeeConstants.REMOVE_EMPLOYEE_REQUEST })
      try {
        const res = await EmployeeServices.removeEmployee(employeeId)
        if (res.status === 200) {
          dispatch({
            type: EmployeeConstants.REMOVE_EMPLOYEE_SUCCESS,
            payload: employeeId
          })
        } else {
          dispatch({ type: EmployeeConstants.REMOVE_EMPLOYEE_FAILURE })
        }
      } catch (error) {
        dispatch({ type: EmployeeConstants.REMOVE_EMPLOYEE_FAILURE })
      }
    }
  }
}

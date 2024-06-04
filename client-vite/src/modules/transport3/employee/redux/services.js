import { sendRequest } from '@helpers/requestHelper'

const getAllEmployee = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/employees`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.employee'
  )
}

const confirmEmployee = (employeeId) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/employees/${employeeId}/confirm`,
      method: 'PUT'
    },
    true,
    true,
    'transport3.employee'
  )
}

const removeEmployee = (employeeId) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/employees/${employeeId}`,
      method: 'DELETE'
    },
    true,
    true,
    'transport3.employee'
  )
}

export { getAllEmployee, confirmEmployee, removeEmployee }

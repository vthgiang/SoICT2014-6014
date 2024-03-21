import { sendRequest } from '../../../../../helpers/requestHelper'

export const BusinessDepartmentServices = {
  getAllBusinessDepartments,
  createBusinessDepartment,
  editBusinessDepartment
}

function getAllBusinessDepartments(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/business-department`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.business_department'
  )
}

function createBusinessDepartment(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/business-department`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.business_department'
  )
}

function editBusinessDepartment(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/business-department/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.business_department'
  )
}

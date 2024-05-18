import { sendRequest } from '../../../../../helpers/requestHelper'

export const worksServices = {
  getAllManufacturingWorks,
  createManufacturingWorks,
  getDetailManufacturingWorks,
  editManufacturingWorks,
  getAllUsersByWorksManageRole,
  getAllManufacturingEmployeeRoles
}

function getAllManufacturingWorks(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manufacturing.manufacturing_works'
  )
}

function createManufacturingWorks(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.manufacturing_works'
  )
}

function getDetailManufacturingWorks(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.manufacturing_works'
  )
}

function editManufacturingWorks(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.manufacturing_works'
  )
}

function getAllUsersByWorksManageRole(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works/users`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'manufacturing.manufacturing_works'
  )
}

function getAllManufacturingEmployeeRoles(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-works/${id}/get-employee-roles`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.manufacturing_works'
  )
}


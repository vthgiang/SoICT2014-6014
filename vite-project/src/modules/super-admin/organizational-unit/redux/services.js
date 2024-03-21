import { sendRequest } from '../../../../helpers/requestHelper'
import { getStorage } from '../../../../config'

export const DepartmentServices = {
  get,
  getOrganizationalUnit,
  getDepartmentsThatUserIsManager,
  create,
  edit,
  destroy,
  importDepartment
}

function get() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.organization_unit'
  )
}

function getDepartmentsThatUserIsManager(currentRole) {
  const id = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units`,
      method: 'GET',
      params: {
        managerOfOrganizationalUnit: id
      }
    },
    false,
    true,
    'super_admin.organization_unit'
  )
}

/** Lấy thông tin unit by id */
function getOrganizationalUnit(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units/${id}`,
      method: 'GET'
    },
    false,
    false,
    'super_admin.organization_unit'
  )
}

function create(department) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units`,
      method: 'POST',
      data: department
    },
    true,
    true,
    'super_admin.organization_unit'
  )
}

function edit(department) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units/${department._id}`,
      method: 'PATCH',
      data: department
    },
    true,
    true,
    'super_admin.organization_unit'
  )
}

function destroy(departmentId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units/${departmentId}`,
      method: 'DELETE'
    },
    true,
    true,
    'super_admin.organization_unit'
  )
}

function importDepartment(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units/import`,
      method: 'POST',
      data
    },
    true,
    true,
    'super_admin.organization_unit'
  )
}

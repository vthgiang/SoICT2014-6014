import { sendRequest } from '../../../../helpers/requestHelper'

function get(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services`,
      method: 'GET',
      params
    },
    false,
    true,
    'super_admin.service'
  )
}

function edit(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'super_admin.service'
  )
}

function create(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services`,
      method: 'POST',
      data
    },
    true,
    true,
    'super_admin.service'
  )
}

function destroy(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'super_admin.service'
  )
}

function importServices(data, params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services/import`,
      method: 'POST',
      params,
      data
    },
    true,
    true,
    'super_admin.service'
  )
}

function sendEmailResetPasswordService(email) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/service/services/send-email-reset-password`,
      method: 'PATCH',
      data: { email }
    },
    true,
    true,
    'super_admin.service'
  )
}

export const ServiceServices = {
  get,
  edit,
  create,
  destroy,
  importServices,
  sendEmailResetPasswordService
}

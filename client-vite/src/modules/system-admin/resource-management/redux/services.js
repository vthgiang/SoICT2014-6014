import { sendRequest } from '../../../../helpers/requestHelper'

function get(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/resource/resources`,
      method: 'GET',
      params
    },
    false,
    true,
    'super_admin.resource'
  )
}

function show(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/resource/resources/${id}`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.resource'
  )
}

function edit(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/resource/resources/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'super_admin.resource'
  )
}

export const ResourceServices = {
  get,
  show,
  edit
}

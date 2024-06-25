import { sendRequest } from '../../../../helpers/requestHelper'

function get(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/requester/requesters`,
      method: 'GET',
      params
    },
    false,
    true,
    'super_admin.requester'
  )
}

function show(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/requester/requesters/${id}`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.requester'
  )
}

function edit(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/requester/requesters/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'super_admin.requester'
  )
}

export const RequesterServices = {
  get,
  show,
  edit
}

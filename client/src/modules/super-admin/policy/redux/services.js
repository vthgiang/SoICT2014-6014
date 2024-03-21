import { sendRequest } from '../../../../helpers/requestHelper'

export const policyServices = {
  getPolicies,
  deletePolicies,
  createPolicy,
  editPolicy,
  getPolicyById
}

function getPolicies(queryData) {
  console.log('policy')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/policy/policies`,
      method: 'GET',
      params: {
        policyName: queryData?.policyName ? queryData.policyName : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null
      }
    },
    false,
    true,
    'super_admin.policy'
  )
}

function deletePolicies(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/policy/policies`,
      method: 'DELETE',
      data: {
        policyIds: data?.policyIds
      }
    },
    true,
    true,
    'super_admin.policy'
  )
}

function createPolicy(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/policy/policies`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'super_admin.policy'
  )
}

function editPolicy(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/policy/policies/${id}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'super_admin.policy'
  )
}

function getPolicyById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/policy/policies/${id}`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.policy'
  )
}

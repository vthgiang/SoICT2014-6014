import { sendRequest } from '../../../../helpers/requestHelper'

function getPolicies(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/policies`,
      method: 'GET',
      params: {
        name: queryData?.name ? queryData.name : '',
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
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/policies`,
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
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/policies`,
      method: 'POST',
      data
    },
    true,
    true,
    'super_admin.policy'
  )
}

function editPolicy(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/policies/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'super_admin.policy'
  )
}

function getPolicyById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/policies/${id}`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.policy'
  )
}

function getDetailedPolicyById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/policy/detail/${id}`,
      method: 'GET'
    },
    false,
    true,
    'super_admin.policy'
  )
}

export const policyServices = {
  getPolicies,
  deletePolicies,
  createPolicy,
  editPolicy,
  getPolicyById,
  getDetailedPolicyById
}

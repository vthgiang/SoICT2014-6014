import { sendRequest } from '../../../../helpers/requestHelper'

const POLICY_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/external-policies`

function getExternalPolicies(params) {
  return sendRequest(
    {
      url: `${POLICY_BASE_API_URL}/external-policies`,
      method: 'GET',
      params: {
        name: params?.name,
        page: params?.page,
        perPage: params?.perPage
      }
    },
    false,
    true,
    'system_admin.external_policy'
  )
}

function createExternalPolicy(data) {
  return sendRequest(
    {
      url: `${POLICY_BASE_API_URL}/external-policies`,
      method: 'POST',
      data
    },
    true,
    true,
    'system_admin.external_policy'
  )
}

function editExternalPolicy(policyId, data) {
  return sendRequest(
    {
      url: `${POLICY_BASE_API_URL}/external-policies/${policyId}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'system_admin.external_policy'
  )
}

function deleteExternalPolicy(policyId) {
  return sendRequest(
    {
      url: `${POLICY_BASE_API_URL}/external-policies/${policyId}`,
      method: 'DELETE'
    },
    true,
    true,
    'system_admin.external_policy'
  )
}

export const ExternalPolicyServices = {
  getExternalPolicies,
  createExternalPolicy,
  editExternalPolicy,
  deleteExternalPolicy
}

import { sendRequest } from '../../../../helpers/requestHelper'

const SERVICE_IDENTITY_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/internal-service-identities`

function getInternalServiceIdentities(params) {
  const { name, apiPrefix, clientId, page = 0, perPage = 5 } = params

  return sendRequest(
    {
      url: `${SERVICE_IDENTITY_BASE_API_URL}/internal-service-identities`,
      method: 'GET',
      params: {
        name,
        apiPrefix,
        clientId,
        page,
        perPage
      }
    },
    false,
    true,
    'system_admin.internal_service_identity'
  )
}

function createInternalServiceIdentity(data) {
  return sendRequest(
    {
      url: `${SERVICE_IDENTITY_BASE_API_URL}/internal-service-identities`,
      method: 'POST',
      data
    },
    true,
    true,
    'system_admin.internal_service_identity'
  )
}

function editInternalServiceIdentity(serviceIdentityId, data) {
  return sendRequest(
    {
      url: `${SERVICE_IDENTITY_BASE_API_URL}/internal-service-identities/${serviceIdentityId}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'system_admin.internal_service_identity'
  )
}

function deleteInternalServiceIdentity(serviceIdentityId) {
  return sendRequest(
    {
      url: `${SERVICE_IDENTITY_BASE_API_URL}/internal-service-identities/${serviceIdentityId}`,
      method: 'DELETE'
    },
    true,
    true,
    'system_admin.internal_service_identity'
  )
}

export const InternalServiceIdentityServices = {
  getInternalServiceIdentities,
  createInternalServiceIdentity,
  editInternalServiceIdentity,
  deleteInternalServiceIdentity
}

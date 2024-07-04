import { sendRequest } from '../../../../helpers/requestHelper'

const AUTHORIZATION_LOGGING_BASE_API_URL = `${process.env.REACT_APP_SERVER}/authorization/logging`

function getAuthorizationLogging(params) {
  return sendRequest(
    {
      url: `${AUTHORIZATION_LOGGING_BASE_API_URL}`,
      method: 'GET',
      params: {
        ...params
      }
    },
    false,
    true,
    'system_admin.authorization_logging'
  )
}

export const AuthorizationLoggingServices = {
  getAuthorizationLogging
}

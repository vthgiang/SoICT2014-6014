import { sendRequest } from '../../../../helpers/requestHelper'

const SERVICE_LOGGING_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/logging`

function getServiceLogging(params) {
  return sendRequest(
    {
      url: `${SERVICE_LOGGING_BASE_API_URL}`,
      method: 'GET',
      params: {
        type: params?.type,
        target: params?.target,
        page: params?.page,
        perPage: params?.perPage
      }
    },
    false,
    true,
    'system_admin.service_logging'
  )
}

export const ServiceLoggingServices = {
  getServiceLogging
}

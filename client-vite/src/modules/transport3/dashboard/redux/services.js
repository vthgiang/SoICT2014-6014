import { sendRequest } from '@helpers/requestHelper'

const getOntimeDeliveryRate = (query) => {
    return sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/transport3/ontimeRate`,
        method: 'GET',
        params: query
      },
      false,
      true,
      'transport3.ontime'
    )
  }

  export const DashboardService = {
    getOntimeDeliveryRate
  }
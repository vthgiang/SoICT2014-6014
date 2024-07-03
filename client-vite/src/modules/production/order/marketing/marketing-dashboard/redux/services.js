import { sendRequest } from '../../../../../helpers/requestHelper'

function createMarketingCampaign(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/marketing-campaign`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.payment'
  )
}


export const MarketingCampaignServices = {
  createMarketingCampaign,
}

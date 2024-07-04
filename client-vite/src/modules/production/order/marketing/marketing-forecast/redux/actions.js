import { MarketingCampaignConstants } from './constants';
import { MarketingCampaignServices } from './services';

function createMarketingCampaign (data) {
    return (dispatch) => {
           ({
            type: MarketingCampaignConstants.CREATE_PAYMENT_REQUEST
        });

        MarketingCampaignServices.createPayment(data)
        .then((res) => {
            dispatch({
                type: MarketingCampaignConstants.CREATE_PAYMENT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: MarketingCampaignConstants.CREATE_PAYMENT_FAILURE,
                error
            })
        })
    }
}

export const MarketingCampaignActions = {
    createMarketingCampaign,
}

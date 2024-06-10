import { MarketingCampaignConstants } from './constants';
import { MarketingCampaignServices } from './services';

export const MarketingCampaignActions = {
    createMarketingCampaign,
    getAllPayments,
    getPaymentDetail,
    getPaymentForOrder
}

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

function getAllPayments (queryData) {
    return (dispatch) => {
        dispatch({
            type: MarketingCampaignConstants.GET_ALL_PAYMENTS_REQUEST
        })

        MarketingCampaignServices.getAllPayments(queryData)
        .then((res) => {
            dispatch({
                type: MarketingCampaignConstants.GET_ALL_PAYMENTS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: MarketingCampaignConstants.GET_ALL_PAYMENTS_FAILURE
            })
        })
    }
}

function getPaymentDetail (id) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.GET_PAYMENT_DETAIL_REQUEST
        })

        MarketingCampaignServices.getPaymentDetail(id)
        .then((res) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_DETAIL_FAILURE
            })
        })
    }
}

function getPaymentForOrder({ orderId, orderType }) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.GET_PAYMENT_FOR_ORDER_REQUEST
        })

        MarketingCampaignServices.getPaymentForOrder({ orderId, orderType })
        .then((res) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_FOR_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
            .catch((error) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_FOR_ORDER_FAILURE
            })
        })
    }
}

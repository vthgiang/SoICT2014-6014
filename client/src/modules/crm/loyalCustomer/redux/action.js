import { CrmLoyalCustomerServices } from "./services";
import { CrmLoyalCustomerConstants } from "./constants";

export const CrmLoyalCustomerActions = {
    getLoyalCustomers
};

function getLoyalCustomers(data) {
    return dispatch => {
        dispatch({ type: CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_REQUEST });
        CrmLoyalCustomerServices.getLoyalCustomers(data)
            .then(res => {
                dispatch({
                    type: CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_FAILE }) })
    }
}

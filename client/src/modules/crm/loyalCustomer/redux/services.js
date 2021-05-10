import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmLoyalCustomerServices = {
    getLoyalCustomers,
    
};

function getLoyalCustomers(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/loyalCustomers`,
        method: 'GET',
        params,
    }, false, true, 'crm.loyalCustomer');
}

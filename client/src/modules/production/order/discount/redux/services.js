import { sendRequest } from '../../../../../helpers/requestHelper';

export const DiscountServices = {
    createNewDiscount,
    getAllDiscounts,
}

function createNewDiscount(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/discount`,
        method: 'POST',
        data
    }, true, true, 'manage_order.discount');
}

function getAllDiscounts(queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/discount`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.tax")
}
import { sendRequest } from '../../../../helpers/requestHelper';

export const GoodServices = {
    getGoodsByType,
}

function getGoodsByType(params){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/goods`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.good_management');
}

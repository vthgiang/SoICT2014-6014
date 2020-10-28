import { sendRequest } from '../../../../../helpers/requestHelper';
export const LotServices = {
    getAllLots
}

function getAllLots(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/lot`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.inventory_management')
}
import { sendRequest } from "../../../../../helpers/requestHelper";

export const SuppliesDashboardService = {
    getSuppliesDashboard,
};

function getSuppliesDashboard(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/supplies/dashboard-supplies`,
        method: 'GET',
        params: {
            time : data,
        },
    },
    false,
    true,
    'supplies.supplies_management');
}
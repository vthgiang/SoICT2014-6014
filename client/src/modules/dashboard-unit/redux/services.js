import {
    sendRequest
} from '../../../helpers/requestHelper';

export const DashboardUnitServices = {
    getAllUnitDashboardData,
};

function getAllUnitDashboardData(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/dashboard-unit/all-unit-dashboard-data`,
        method: 'GET',
        params: data
    }, false, true, 'dashboard_unit');
}
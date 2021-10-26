import { sendRequest } from '../../../../helpers/requestHelper';

export const getEmployeeDashboardDataServices = {
    getEmployeeDashboardData
}

function getEmployeeDashboardData(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/get-employee-dashboard-data`,
            method: "GET",
            params: {
                organizationalUnits: data?.organizationalUnits,
                defaultParams: data?.defaultParams,
                searchChart: data?.searchChart
            }
        },
        false,
        true,
        "human-resource.get-employee-dashboard-chart"
    );
}

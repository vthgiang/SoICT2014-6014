import { getStorage } from "../../../../../config";
import externalTransportSystem from "../../../../../helpers/requestExternalServerHelpers";
import { sendRequest } from '../../../../../helpers/requestHelper';

export const DeliveryServices = {
    getDeliveries,
    saveSolution,
    changeOrderToJourney,
    getOptimalDepot,
    getDeliveryPlanFromExternalServer,
    createDeliveryPlan,
    getAllDeliveries,
    getAllJourney
}

function getDeliveries(search) {
    return externalTransportSystem.post(`routes/search-solution`, search);
}

function saveSolution(solution) {
    return externalTransportSystem.post(`routes/save-solution`, solution);
}

function changeOrderToJourney(data) {
    return externalTransportSystem.post(`routes/change-order-journey`, data);
}

function getOptimalDepot(data) {
    return externalTransportSystem.post('customers/get-clustering-for-order', data);
}

function getDeliveryPlanFromExternalServer(data) {
    return externalTransportSystem.post('/routes/dx-request-get-solutions', data);
}

function createDeliveryPlan(data) {
    let userId = getStorage("userId");
    data.creatorId = userId;
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/journeys/create`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.delivery.save_plan"
    )
}

function getAllDeliveries(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/delivery-plan`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_transportation.delivery.get_plans"
    );
}

function getAllJourney(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/delivery-plan/all-journeys`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_transportation.delivery.get_plans"
    );
}
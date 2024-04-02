import { sendRequest } from '../../../../helpers/requestHelper';

export const TransportationCostManagementServices = {
    getAllVehicleCosts,
    getFormula,
    createVehicleCost,
    createOrUpdateVehicleCostFormula,
    deleteVehicleCost,
    updateVehicleCost,
    createOrUpdateShipperCost,
    getAllShipperCosts
}

function getAllVehicleCosts(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/get/vehicle-cost`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_transportation.vehicle_management"
    );
}

function getAllShipperCosts(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/get/shipper-cost`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null
            }
        },
        false,
        true,
        "manage_transportation.vehicle_management"
    );
}

function createVehicleCost(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/create/vehicle-cost`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    );
}

function createOrUpdateShipperCost(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/create/shipper-cost`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.shipper_management"
    );
}

function getFormula() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/cost-formula`,
            method: "GET",
            params: {

            }
        },
        false,
        true,
        "manage_transportation.formula"
    );
}

function createOrUpdateVehicleCostFormula(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/cost-formula`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.formula"
    );
}
function deleteVehicleCost(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/vehicle/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    )
}

function updateVehicleCost(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/costs/vehicle/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    )
}
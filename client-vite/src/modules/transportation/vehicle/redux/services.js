import externalService from '../../../../helpers/requestExternalServerHelpers';
import { sendRequest } from '../../../../helpers/requestHelper';

export const vehicleServices = {
    getAllVehicle,
    deleteVehicles,
    createVehicle,
    editVehicle,
    getVehicleDetail,
    createVehicleExternalSystem,
    getAllVehicleWithCondition,
    getAllFreeVehicleSchedule,
    calculateVehiclesCost,
    getAllVehicleWithCostList,
    editVehicleSyncExternalSystem
}

function getAllVehicle(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle`,
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

function getAllVehicleWithCondition(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/available`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.vehicle_management'
    )
}

function deleteVehicles(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle`,
            method: "DELETE",
            data: {
                vehicleIds: data?.vehicleIds
            }
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    )
}

function createVehicle(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    )
}

function editVehicle(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transportation.vehicle_management"
    )
}

function editVehicleSyncExternalSystem(data) {
    return externalService.put('/vehicles/update-cost', data);
}

function getVehicleDetail(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/${id}`,
        method: "GET"
    },
        false,
        true,
        "manage_transportation.vehicle_management"
    )
}

function createVehicleExternalSystem(data) {
    return externalService.post('/vehicles', data);
}

function getAllFreeVehicleSchedule(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/all-free-vehicles`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.vehicle_management'
    )
}

function calculateVehiclesCost(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/calculate-cost`,
            method: "POST",
            data: data
        },
        true,
        true,
        'manage_transportation.vehicle_management'
    )
}

function getAllVehicleWithCostList() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/vehicle/with-cost`,
            method: "get",
            data: {vehicle: "all"}
        },
        false,
        true,
        'manage_transportation.vehicle_management'
    )
}
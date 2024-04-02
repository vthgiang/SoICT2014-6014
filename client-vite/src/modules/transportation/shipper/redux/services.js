import externalService from '../../../../helpers/requestExternalServerHelpers';
import { sendRequest } from '../../../../helpers/requestHelper';

export const ShipperServices = {
    editDriverInfo,
    getAllShipperWithCondition,
    getAllFreeShipperSchedule,
    getTasksForShipper,
    createShipper,
    getAllShipperAvailableForJourney,
    getAllDriversNotConfirm,
    calculateShipperSalary,
    saveShippersSalary,
    getAllShipperSalaryByCondition
}

function createShipper(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.shipper_management"
    )
}

function saveShippersSalary(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/save-salary`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transportation.shipper_management"
    )
}

function getTasksForShipper(queryData) {
    const role = localStorage.getItem('currentRole');
    const userId = localStorage.getItem('userId');
    const searchingDate = queryData?.searchingDate;
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/shippers/tasks`,
            method: "GET",
            params: {
                page: queryData?.page ? queryData.page : null,
                perPage: queryData?.perPage ? queryData.perPage : null,
                role: role,
                userId: userId,
                searchingDate: searchingDate ? searchingDate : null,
                status: queryData.status ? queryData.status : null
            }
        },
        false,
        true,
        "manage_transportation.shipper_management"
    );
}

function getAllShipperWithCondition(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/get-all`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}

function getAllShipperSalaryByCondition(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/all-salary`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}

function calculateShipperSalary(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/calculate-salary`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}

function getAllDriversNotConfirm(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/get-all-not-confirm`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}

function editDriverInfo(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/${id}`,
        method: "PATCH",
        data: data
    },
        true,
        true,
        "manage_transportation.shipper_management"
    )
}

function getAllFreeShipperSchedule(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/all-free-schedule`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}
function getAllShipperAvailableForJourney(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transportation/manage-shipper/all-free-for-journey`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manage_transportation.shipper_management'
    )
}
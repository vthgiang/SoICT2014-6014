import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportPlanServices = {
    getAllTransportPlans,
    createTransportPlan,
    getDetailTransportPlan,
    getDetailTransportPlan2,
    editTransportPlan,
    addTransportRequirementToPlan,
    addTransportVehicleToPlan,
}

function getAllTransportPlans(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan`,
            method: "GET",
            params: {
                // page: queryData !== undefined ? queryData.page : null,
                // limit: queryData !== undefined ? queryData.limit : null
                page: 1,
                limit: 100
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "transport.plans"
    );
}

function createTransportPlan(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan`,
            method: "POST",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function getDetailTransportPlan(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
            method: "GET"
        },
        false,
        true,
        'transport.plan'
    )
}

function getDetailTransportPlan2(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
            method: "GET"
        },
        false,
        true,
        'transport.plan'
    )
}

function editTransportPlan(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function addTransportRequirementToPlan(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan/add-transport-requirement/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function addTransportVehicleToPlan(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-plan/add-transport-vehicle/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}
import { sendRequest } from '../../../../../helpers/requestHelper';
export const transportScheduleServices = {
    editTransportScheduleByPlanId,
    getTransportScheduleByPlanId,
    changeTransportRequirementProcess,
    driverSendMessage,
}

function getTransportScheduleByPlanId(planId) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-schedule/get-by-plan-id/${planId}`,
            method: "GET"
        },
        false,
        true,
        'manage_transport'
    )
}

function editTransportScheduleByPlanId(planId, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-schedule/edit-by-plan-id/${planId}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}


/**
 * data = {planId: , vehicleId, status, description}
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
function changeTransportRequirementProcess(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-schedule/change-transport-requirement-process`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_transport"
    )
}

function deleteTransportRequirement(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-requirement/${id}`,
            method: "DELETE"
        },
        true,
        true,
        "manage_transport"
    )
}

function driverSendMessage(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/transport-schedule/driver-send-message`,
            method: "POST",
            data: data
        },
        false,
        true,
        "manage_transport"
    )  
}
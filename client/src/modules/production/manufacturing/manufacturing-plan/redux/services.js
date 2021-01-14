import { sendRequest } from "../../../../../helpers/requestHelper"

export const manufacturingPlanServices = {
    getAllManufacturingPlans,
    getAllApproversOfPlan,
    createManufacturingPlan,
    getDetailManufacturingPlan
}

function getAllManufacturingPlans(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-plan`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.plan'
    )
}

function getAllApproversOfPlan(currentRole) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/get-approvers-of-plan/${currentRole}`,
            method: "GET"
        },
        false,
        true,
        'manufacturing.plan'
    )
}

function createManufacturingPlan(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-plan`,
            method: "POST",
            data
        },
        true,
        true,
        "manufacturing.plan")
}

function getDetailManufacturingPlan(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/${id}`,
            method: "GET",
        },
        false,
        true,
        "manufacturing.plan")
}
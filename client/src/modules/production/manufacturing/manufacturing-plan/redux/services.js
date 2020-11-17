import { sendRequest } from "../../../../../helpers/requestHelper"

export const manufacturingPlanServices = {
    getAllManufacturingPlans,
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
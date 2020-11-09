import { sendRequest } from "../../../../../helpers/requestHelper"

export const workScheduleSevices = {
    getAllWorkSchedules,
    createWorkSchedule,
}

function getAllWorkSchedules(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/work-schedule`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.work_schedule'
    )
}


function createWorkSchedule(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/work-schedule`,
            method: "POST",
            data
        },
        true,
        true,
        'manufacturing.work_schedule'
    )
}


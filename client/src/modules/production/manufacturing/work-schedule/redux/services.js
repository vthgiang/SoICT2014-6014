import { sendRequest } from "../../../../../helpers/requestHelper"

export const workScheduleSevices = {
    getAllWorkSchedules,
    createWorkSchedule,
    getAllWorkSchedulesByMillId,
    getAllWorkSchedulesOfManufacturingWork,
    getAllWorkerByArrayWorkSchedules
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

function getAllWorkSchedulesByMillId(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/work-schedule/manufacturingMill/${id}`,
            method: "GET",
        },
        false,
        true,
        'manufacturing.work_schedule'
    )
}

function getAllWorkSchedulesOfManufacturingWork(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/work-schedule/manufacturingMills`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.work_schedule'
    )
}

function getAllWorkerByArrayWorkSchedules(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/work-schedule/worker/array-schedules`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.work_schedule'
    )
}


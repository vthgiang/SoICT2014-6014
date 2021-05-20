import { sendRequest } from "../../../../helpers/requestHelper";

export const StatisticServices = {
    getListTasksEvalDispatchAPI,
}

function getListTasksEvalDispatchAPI(id, evalMonth) {
    console.log('evalMonth', evalMonth)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/${id}/getListTasksEval/${evalMonth}`,
            method: "GET",
            params: {
                id,
                evalMonth,
            },
        },
        false,
        true,
        "project"
    );
}
import { sendRequest } from "../../../../helpers/requestHelper"

export const issueReportService = {
    getReportIssueById,
    getAllReportIssue,
    createIssueReport,
    editReportIssue,
    deleteReportIssue
}

function getReportIssueById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/report-issue/${id}`,
        method: "GET",
    },
        true,
        true,
        "report-issue"
    )
}

function getAllReportIssue(queryData) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/report-issue`,
        method: "GET",
        params: {
            issueName: queryData !== undefined ? queryData.issueName : "",
            page: queryData !== undefined ? queryData.page : null,
            perPage: queryData !== undefined ? queryData.perPage : null,
        }
    },
        false,
        true,
        "report-issue"
    );
}

function createIssueReport(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/report-issue`,
        method: "POST",
        data: data,
    },
        true,
        true,
        "report-issue"
    )
}

function editReportIssue(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/report-issue/${id}`,
        method: "PATCH",
        data: data,
    },
        true,
        true,
        "report-issue"
    )
}

function deleteReportIssue(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/report-issue/${id}`,
        method: "DELETE",
    },
        true,
        true,
        "report-issue"
    )
}
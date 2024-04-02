import { issueReportService } from './services';
import { issueReportConstants } from './constants';

export const IssueReportAction = {
    getReportIssueById,
    getAllIssueReport,
    createReportIssue,
    editReportIssue,
    deleteReportIssue
}

function getReportIssueById(id) {
    return (dispatch) => {
        dispatch({
            type: issueReportConstants.GET_ISSUE_BY_ID_REQUEST
        });
        issueReportService.getReportIssueById(id).then((response) => {
            dispatch({
                type: issueReportConstants.GET_ISSUE_BY_ID_SUCCESS,
                payload: response.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: issueReportConstants.GET_ISSUE_BY_ID_FAILURE,
                error
            })
        })
    }
}

function getAllIssueReport(queryData) {
    return (dispatch) => {
        dispatch({
            type: issueReportConstants.GET_ALL_ISSUES_REQUEST
        });

        issueReportService.getAllReportIssue(queryData)
            .then(response => {
                dispatch({
                    type: issueReportConstants.GET_ALL_ISSUES_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: issueReportConstants.GET_ALL_ISSUES_FAILURE,
                    error
                })
            });
    }
}

export function createReportIssue(data) {
    return (dispatch) => {
        dispatch({
            type: issueReportConstants.CREATE_ISSUE_REPORT_REQUEST
        });

        issueReportService.createIssueReport(data)
            .then((response) => {
                dispatch({
                    type: issueReportConstants.CREATE_ISSUE_REPORT_SUCCESS,
                    payload: response.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: issueReportConstants.CREATE_ISSUE_REPORT_FAILURE,
                    error
                })
            });
    }
}

export function editReportIssue(id, data) {
    return (dispatch) => {
        dispatch({
            type: issueReportConstants.EDIT_ISSUE_REPORT_REQUEST,
        });
        issueReportService.editReportIssue(id, data)
            .then((response) => {
                dispatch({
                    type: issueReportConstants.EDIT_ISSUE_REPORT_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: issueReportConstants.EDIT_ISSUE_REPORT_FAILURE,
                    error
                })
            })
    }
}

export function deleteReportIssue(id) {
    return (dispatch) => {
        dispatch({
            type: issueReportConstants.DELETE_ISSUE_REPORT_REQUEST
        });
        issueReportService.deleteReportIssue(id)
            .then((response) => {
                dispatch({
                    type: issueReportConstants.DELETE_ISSUE_REPORT_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: issueReportConstants.DELETE_ISSUE_REPORT_FAILURE,
                    error
                })
            });
    }
}
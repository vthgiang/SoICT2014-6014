import { issueReportConstants } from './constants'

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    listIssue: [],
    isLoading: false,
    error: null,
    issueReport: undefined,
    totalList: 0
}

export function issueReport(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case issueReportConstants.GET_ALL_ISSUES_REQUEST:
        case issueReportConstants.GET_ISSUE_BY_ID_REQUEST:
        case issueReportConstants.CREATE_ISSUE_REPORT_REQUEST:
        case issueReportConstants.EDIT_ISSUE_REPORT_REQUEST:
        case issueReportConstants.DELETE_ISSUE_REPORT_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case issueReportConstants.GET_ALL_ISSUES_FAILURE:
        case issueReportConstants.GET_ISSUE_BY_ID_FAILURE:
        case issueReportConstants.CREATE_ISSUE_REPORT_FAILURE:
        case issueReportConstants.EDIT_ISSUE_REPORT_FAILURE:
        case issueReportConstants.DELETE_ISSUE_REPORT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case issueReportConstants.GET_ALL_ISSUES_SUCCESS:
            return {
                ...state,
                listIssue: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case issueReportConstants.GET_ISSUE_BY_ID_SUCCESS:
            return {
                ...state,
                issueReport: action.payload,
                isLoading: false
            }
        case issueReportConstants.CREATE_ISSUE_REPORT_SUCCESS:
            return {
                ...state,
                listIssue: [
                    ...state.list,
                    action.payload
                ],
                isLoading: false,
            }
        case issueReportConstants.EDIT_ISSUE_REPORT_SUCCESS:
            index = findIndex(state.listIssue, action.payload._id);
            if (index !== -1) {
                state.listIssue[index] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            }
        case issueReportConstants.DELETE_ISSUE_REPORT_SUCCESS:
            return {
                ...state,
                listIssue: state.listIssue.filter((issue) => (issue?._id !== action.payload?._id)),
                isLoading: false
            }
        default:
            return state
    }
}
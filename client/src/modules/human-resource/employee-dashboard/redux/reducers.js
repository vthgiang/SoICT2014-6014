import { getEmployeeDashboardDataConstant } from './constants';

const initialState = {
    isLoading: false,
    agePyramidChartData: {},
    humanResourceChartBySalaryData: {},
    humanResourceIncreaseAndDecreaseChartData: {},
    trendOfOvertimeChartData: {},
    salaryOfOrganizationalUnitsChartData: {},
    highestSalaryChartData: [],
    qualificationChartData: {},
    annualLeaveChartAndTableData: {},
    error: null,
}

export function employeeDashboardData(state = initialState, action) {
    switch (action.type) {
        case getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_REQUEST:
            return {
                ...state,
            }
        case getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                agePyramidChartData: action.payload.agePyramidChartData ? action.payload.agePyramidChartData : state.agePyramidChartData,
                humanResourceChartBySalaryData: action.payload.humanResourceChartBySalaryData ? action.payload.humanResourceChartBySalaryData : state.humanResourceChartBySalaryData,
                humanResourceIncreaseAndDecreaseChartData: action.payload.humanResourceIncreaseAndDecreaseChartData ? action.payload.humanResourceIncreaseAndDecreaseChartData : state.getHumanResourceIncreaseAndDecreaseChartData,
                trendOfOvertimeChartData: action.payload.trendOfOvertimeChartData ? action.payload.trendOfOvertimeChartData : state.trendOfOvertimeChartData,
                salaryOfOrganizationalUnitsChartData: action.payload.salaryOfOrganizationalUnitsChartData ? action.payload.salaryOfOrganizationalUnitsChartData : state.salaryOfOrganizationalUnitsChartData,
                highestSalaryChartData: action.payload.highestSalaryChartData ? action.payload.highestSalaryChartData : state.highestSalaryChartData,
                qualificationChartData: action.payload.qualificationChartData ? action.payload.qualificationChartData : state.qualificationChartData,
                annualLeaveChartAndTableData: action.payload.annualLeaveChartAndTableData ? action.payload.annualLeaveChartAndTableData : state.annualLeaveChartAndTableData,
                isLoading: false
            }
        case getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        default:
            return state
    }
}
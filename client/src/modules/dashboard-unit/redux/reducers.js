import { DashboardUnitConstants } from "./constants";

const initState = {
    isLoading : false,
    allUnitDashboard : {}
}

export function dashboardUnit(state = initState, action) {
    switch (action.type) {
        case DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_REQUEST:
            if (action.chartNameArr) {
                if (action.chartNameArr.length === 2) {
                    let charts = state?.allUnitDashboard;
                    for (const i of action.chartNameArr) {
                        if (i !== "common-params") {
                            for (const j of Object.keys(charts)) {
                                if (i === j) {
                                    charts = { ...charts, [i]: { ...state.allUnitDashboard?.[i], isLoading: true } }
                                }
                            }

                            return {
                                ...state,
                                allUnitDashboard: charts,
                                isLoading: true
                            }
                        }
                    }
                }
                else {
                    let charts = {}
                    for (const i of action?.chartNameArr) {
                        charts = { ...charts, [i]: { isLoading: true } }
                    }

                    return {
                        ...state,
                        allUnitDashboard: charts,
                        isLoading: true
                    }
    
                }
            }

        case DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_SUCCESS:
            let result = action.payload;
            if (Object.keys(result).length === 1) {
                const data = Object.values(result)[0];
                let charts = state.allUnitDashboard
                for (const i of Object.keys(charts)) {
                    if (i === Object.keys(result)[0]) {
                        charts = { ...charts, [i]: { ...data, isLoading: false } }
                    }
                }
                return {
                    ...state,
                    allUnitDashboard: charts,
                    isLoading: false
                }
            }
            else {
                for (const i of Object.keys(result)) {
                    result = { ...result, [i]: { ...result[i], isLoading: false } }
                }
                return {
                    ...state,
                    allUnitDashboard: result,
                    isLoading: false
                }
            }
    
        case DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
            
        default:
            return state;
    }
}
import { manufacturingPlanConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}


const initState = {
    isLoading: false,
    listPlans: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listApprovers: []
}

export function manufacturingPlan(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_REQUEST:
        case manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_REQUEST:
        case manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_REQUEST:
        case manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_REQUEST:
        case manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_REQUEST:
        case manufacturingPlanConstants.GET_NUMBER_PLAN_REQUEST:
        case manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_FAILURE:
        case manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_FAILURE:
        case manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_FAILURE:
        case manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_FAILURE:
        case manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_FAILURE:
        case manufacturingPlanConstants.GET_NUMBER_PLAN_FAILURE:
        case manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPlans: action.payload.manufacturingPlans.docs,
                totalDocs: action.payload.manufacturingPlans.totalDocs,
                limit: action.payload.manufacturingPlans.limit,
                totalPages: action.payload.manufacturingPlans.totalPages,
                page: action.payload.manufacturingPlans.page,
                pagingCounter: action.payload.manufacturingPlans.pagingCounter,
                hasPrevPage: action.payload.manufacturingPlans.hasPrevPage,
                hasNextPage: action.payload.manufacturingPlans.hasNextPage,
                prevPage: action.payload.manufacturingPlans.prevPage,
                nextPage: action.payload.manufacturingPlans.nextPage,
            }
        case manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listApprovers: action.payload.users
            }
        case manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPlans: [
                    ...state.listPlans,
                    action.payload.manufacturingPlan
                ]
            }
        case manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentPlan: action.payload.manufacturingPlan
            }
        case manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_SUCCESS:
            index = findIndex(state.listPlans, action.payload.manufacturingPlan._id);
            if (index !== -1) {
                state.listPlans[index] = action.payload.manufacturingPlan
            }
            return {
                ...state,
                isLoading: false
            }
        case manufacturingPlanConstants.GET_NUMBER_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                planNumber: action.payload
            }
        case manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                planNumberStatus: action.payload
            }
        default:
            return state
    }
}
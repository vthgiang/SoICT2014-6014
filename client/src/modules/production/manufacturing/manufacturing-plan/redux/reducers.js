import { manufacturingPlanConstants } from "./constants";


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
    switch (action.type) {
        case manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_REQUEST:
        case manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_FAILURE:
        case manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_FAILURE:
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
        default:
            return state
    }
}
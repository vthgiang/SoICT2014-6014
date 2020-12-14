import { SLAConstants } from './constants';

var findIndex = (array, code) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value.code === code) {
            result = index;
        }
    });
    return result;
}

const initState = {
    isLoading: false,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listSLAs: [],
    availabledSLACode: false,
    listSLAsByCode: [],
}

export function serviceLevelAgreements(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case SLAConstants.GET_ALL_SLAS_REQUEST:
        case SLAConstants.CREATE_SLA_REQUEST:
        case SLAConstants.GET_DETAIL_SLA_REQUEST:
        case SLAConstants.UPDATE_SLA_REQUEST:
        case SLAConstants.DISABLE_SLA_REQUEST:
        case SLAConstants.CHECK_SLA_CODE_REQUEST:
        case SLAConstants.GET_SLA_BY_CODE_REQUEST:
        case SLAConstants.DELETE_SLA_BY_CODE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case SLAConstants.GET_ALL_SLAS_FAILURE:
        case SLAConstants.CREATE_SLA_FAILURE:
        case SLAConstants.GET_DETAIL_SLA_FAILURE:
        case SLAConstants.UPDATE_SLA_FAILURE:
        case SLAConstants.DISABLE_SLA_FAILURE:
        case SLAConstants.CHECK_SLA_CODE_FAILURE:
        case SLAConstants.GET_SLA_BY_CODE_FAILURE:
        case SLAConstants.DELETE_SLA_BY_CODE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case SLAConstants.GET_ALL_SLAS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listSLAs: action.payload.allSLAs.docs,
                totalDocs: action.payload.allSLAs.totalDocs,
                limit: action.payload.allSLAs.limit,
                totalPages: action.payload.allSLAs.totalPages,
                page: action.payload.allSLAs.page,
                pagingCounter: action.payload.allSLAs.pagingCounter,
                hasPrevPage: action.payload.allSLAs.hasPrevPage,
                hasNextPage: action.payload.allSLAs.hasNextPage,
                prevPage: action.payload.allSLAs.prevPage,
                nextPage: action.payload.allSLAs.nextPage
            }
        case SLAConstants.CREATE_SLA_SUCCESS:
            return {
                ...state,
                listSLAs: [
                    ...state.listSLAs,
                    action.payload.sla
                ],
                isLoading: false
            }
        case SLAConstants.GET_DETAIL_SLA_SUCCESS:
            return {
                ...state,
                currentSLA: action.payload.sla,
                isLoading: false
            }
        case SLAConstants.UPDATE_SLA_SUCCESS:
            index = findIndex(state.listSLAs, action.payload.sla.code);
            if (index !== -1) {
                state.listSLAs[index] = action.payload.sla
            }
            return {
                ...state,
                isLoading: false
            }
        case SLAConstants.DISABLE_SLA_SUCCESS:
            index = findIndex(state.listSLAs, action.payload.sla.code);

            if(index !== -1){
                state.listSLAs[index] = action.payload.sla;
            }
            return {
                ...state,
                isLoading: false
        }
        case SLAConstants.DELETE_SLA_BY_CODE_SUCCESS:
            index = findIndex(state.listSLAs, action.payload[0].code);

            if(index !== -1){
                state.listSLAs.splice(index, 1);
            }
            return {
                ...state,
                isLoading: false
            }
        case SLAConstants.CHECK_SLA_CODE_SUCCESS:
            return {
                ...state,
                availabledSLACode: action.payload.checked,
                isLoading: false
            }
        case SLAConstants.GET_SLA_BY_CODE_SUCCESS:
            return {
                ...state,
                listSLAsByCode: action.payload.sla,
                isLoading: false
            }
        default:
            return state
    }
}
import { worksConstants } from './constants';

const initState = {
    isLoading: false,
    listWorks: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    detailWorks: {}
}

export function manufacturingWorks(state = initState, action) {
    switch (action.type) {
        case worksConstants.GET_ALL_WORKS_REQUEST:
        case worksConstants.CREATE_WORKS_REQUEST:
        case worksConstants.GET_DETAIL_WORKS_REQUEST:
            return {
                ...state,
                isLoading: false
            }
        case worksConstants.GET_ALL_WORKS_FAILURE:
        case worksConstants.CREATE_WORKS_FAILURE:
        case worksConstants.GET_DETAIL_WORKS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case worksConstants.GET_ALL_WORKS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listWorks: action.payload.allManufacturingWorks.docs,
                totalDocs: action.payload.allManufacturingWorks.totalDocs,
                limit: action.payload.allManufacturingWorks.limit,
                totalPages: action.payload.allManufacturingWorks.totalPages,
                page: action.payload.allManufacturingWorks.page,
                pagingCounter: action.payload.allManufacturingWorks.pagingCounter,
                hasPrevPage: action.payload.allManufacturingWorks.hasPrevPage,
                hasNextPage: action.payload.allManufacturingWorks.hasNextPage,
                prevPage: action.payload.allManufacturingWorks.prevPage,
                nextPage: action.payload.allManufacturingWorks.nextPage

            }
        case worksConstants.CREATE_WORKS_SUCCESS:
            return {
                ...state,
                listWorks: [
                    ...state.listWorks,
                    action.payload.manufacturingWorks
                ],
                isLoading: false
            }
        case worksConstants.GET_DETAIL_WORKS_SUCCESS:
            return {
                ...state,
                currentWorks: action.payload.manufacturingWorks,
                isLoading: false
            }
        default:
            return state

    }
}
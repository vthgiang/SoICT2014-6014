import { LotConstants } from './constants';

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
    listLots: [],
    lotDetail: "",
    listLotsByGood: [],
    listPaginate: [],
    listCreateOrEdit: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    type: ''
}

export function lots(state = initState, action){
    var index = -1;
    var indexPaginate = -1;

    switch(action.type){

        case LotConstants.GET_LOT_REQUEST:
        case LotConstants.GET_LOT_PAGINATE_REQUEST:
        case LotConstants.GET_LOT_DETAIL_REQUEST:
        case LotConstants.EDIT_LOT_REQUEST:
        case LotConstants.GET_LOT_BY_GOOD_REQUEST:
        case LotConstants.CREATE_OR_EDIT_LOT_REQUEST:
        case LotConstants.DELETE_LOT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case LotConstants.GET_LOT_SUCCESS:
            return {
                ...state,
                listLots: action.payload,
                isLoading: false
            }

        case LotConstants.GET_LOT_PAGINATE_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            }

        case LotConstants.GET_LOT_DETAIL_SUCCESS:
            return {
                ...state,
                lotDetail: action.payload,
                isLoading: false
            }
        
        case LotConstants.EDIT_LOT_SUCCESS:
            index = findIndex(state.listLots, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id)

            if(index !== -1){
                state.listLots[index] = action.payload
            }

            if(indexPaginate !== -1) {
                state.listPaginate[indexPaginate] = action.payload
            }

            return {
                ...state,
                isLoading: false
            }

        case LotConstants.GET_LOT_BY_GOOD_SUCCESS:
            return {
                ...state,
                listLotsByGood: action.payload,
                isLoading: false
            }

        case LotConstants.CREATE_OR_EDIT_LOT_SUCCESS:
            return {
                ...state,
                listCreateOrEdit: action.payload,
                isLoading: false
            }

        case LotConstants.DELETE_LOT_SUCCESS:
            return {
                ...state,
                isLoading: false
            }

        case LotConstants.GET_LOT_FAILURE:
        case LotConstants.GET_LOT_PAGINATE_FAILURE:
        case LotConstants.GET_LOT_DETAIL_FAILURE:
        case LotConstants.GET_LOT_DETAIL_FAILURE:
        case LotConstants.GET_LOT_BY_GOOD_FAILURE:
        case LotConstants.CREATE_OR_EDIT_LOT_FAILURE:
        case LotConstants.DELETE_LOT_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
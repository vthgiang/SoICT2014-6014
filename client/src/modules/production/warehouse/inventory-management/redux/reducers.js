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
    listPaginate: [],
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
        case LotConstants.GET_PAGINATE_LOT_REQUEST:
            return {
                ...state,
                isLoading: false
            }

        case LotConstants.GET_LOT_SUCCESS:
            return {
                ...state,
                listLots: action.payload,
                isLoading: false
            }

        case LotConstants.GET_PAGINATE_LOT_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload,
                isLoading: false
            }
        
        case LotConstants.GET_LOT_FAILURE:
        case LotConstants.GET_PAGINATE_LOT_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
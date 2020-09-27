import { GoodConstants, GoodContants } from './constants';

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
    listGoods: [],
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

export function goods(state = initState, action) {

    var index = -1;
    var indexPaginate = -1;

    switch (action.type) {
        case GoodConstants.GETALL_GOOD_BY_TYPE_REQUEST:
        case GoodConstants.PAGINATE_GOOD_BY_TYPE_REQUEST:
            return {
                ...state,
                isLoading: false
            };
        
        case GoodConstants.GETALL_GOOD_BY_TYPE_FAILURE:
        case GoodConstants.PAGINATE_GOOD_BY_TYPE_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        
        case GoodConstants.GETALL_GOOD_BY_TYPE_SUCCESS:
            return {
                ...state,
                listGoods: action.payload,
                isLoading: false
            };

        case GoodConstants.PAGINATE_GOOD_BY_TYPE_SUCCESS:
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
            };

        default:
            return state;
    }
}
import { BillConstants } from './constants';

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
    listBills: [],
    billDetail: {},
    listBillByGood: [],
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

export function bills(state = initState, action) {

    var index = -1;
    var indexPaginate = -1;

    switch(action.type){

        case BillConstants.GET_BILL_BY_TYPE_REQUEST:
        case BillConstants.GET_PAGINATE_REQUEST:
        case BillConstants.GET_BILL_BY_GOOD_REQUEST:
        case BillConstants.GET_BILL_DETAIL_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case BillConstants.GET_BILL_BY_TYPE_SUCCESS:
            return {
                ...state,
                listBills: action.payload,
                isLoading: false
            }

        case BillConstants.GET_BILL_DETAIL_SUCCESS:
            return {
                ...state,
                billDetail: action.payload,
                isLoading: false
            }

        case BillConstants.GET_PAGINATE_SUCCESS:
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

        case BillConstants.GET_BILL_BY_GOOD_SUCCESS:
            return {
                ...state,
                listBillByGood: action.payload.docs,
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

        case BillConstants.GET_BILL_BY_TYPE_FAILURE:
        case BillConstants.GET_PAGINATE_FAILURE:
        case BillConstants.GET_BILL_BY_GOOD_FAILURE:
        case BillConstants.GET_BILL_DETAIL_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
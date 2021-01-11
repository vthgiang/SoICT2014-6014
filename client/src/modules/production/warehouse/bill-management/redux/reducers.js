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
    billDetail: '',
    numberBills: null,
    listBillByGood: [],
    listBillByStatus: [],
    listBillByCommand: [],
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

    switch (action.type) {

        case BillConstants.GET_BILL_BY_TYPE_REQUEST:
        case BillConstants.GET_PAGINATE_REQUEST:
        case BillConstants.GET_BILL_BY_GOOD_REQUEST:
        case BillConstants.GET_BILL_DETAIL_REQUEST:
        case BillConstants.CREATE_BILL_REQUEST:
        case BillConstants.UPDATE_BILL_REQUEST:
        case BillConstants.GET_BILL_BY_STATUS_REQUEST:
        case BillConstants.GET_BILL_BY_COMMAND_REQUEST:
        case BillConstants.CREATE_MANY_PRODUCT_BILL_REQUEST:
        case BillConstants.GET_NUMBER_BILL_REQUEST:
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

        case BillConstants.CREATE_BILL_SUCCESS:
            return {
                ...state,
                listBills: [...state.listBills, action.payload],
                listPaginate: [...state.listPaginate, action.payload],
                isLoading: false
            }

        case BillConstants.UPDATE_BILL_SUCCESS:
            index = findIndex(state.listBills, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);

            if (index !== -1) {
                state.listBills[index] = action.payload;
            }

            if (indexPaginate !== -1) {
                state.listPaginate[indexPaginate] = action.payload;
            }

            return {
                ...state,
                isLoading: false
            }

        case BillConstants.GET_BILL_BY_STATUS_SUCCESS:
            return {
                ...state,
                listBillByStatus: action.payload,
                isLoading: false
            }

        case BillConstants.GET_BILL_BY_COMMAND_SUCCESS:
            return {
                ...state,
                listBillByCommand: action.payload,
                isLoading: false
            }
        case BillConstants.CREATE_MANY_PRODUCT_BILL_SUCCESS:
            return {
                ...state,
                isLoading: false
            }
        case BillConstants.GET_NUMBER_BILL_SUCCESS:
            return {
                ...state,
                numberBills: action.payload,
                isLoading: false
            }
        case BillConstants.GET_BILL_BY_TYPE_FAILURE:
        case BillConstants.GET_PAGINATE_FAILURE:
        case BillConstants.GET_BILL_BY_GOOD_FAILURE:
        case BillConstants.GET_BILL_DETAIL_FAILURE:
        case BillConstants.CREATE_BILL_FAILURE:
        case BillConstants.UPDATE_BILL_FAILURE:
        case BillConstants.GET_BILL_BY_STATUS_FAILURE:
        case BillConstants.GET_BILL_BY_COMMAND_FAILURE:
        case BillConstants.CREATE_MANY_PRODUCT_BILL_FAILURE:
        case BillConstants.GET_NUMBER_BILL_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}
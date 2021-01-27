import { QuoteConstants } from './constants';

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
    listQuotes: [],
    quoteDetail: {},
    quotesToMakeOrder: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
}

export function quotes(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case QuoteConstants.GET_ALL_QUOTES_REQUEST:
        case QuoteConstants.CREATE_QUOTE_REQUEST:
        case QuoteConstants.EDIT_QUOTE_REQUEST:
        case QuoteConstants.DELETE_QUOTE_REQUEST:
        case QuoteConstants.APPROVE_QUOTE_REQUEST:
        case QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_REQUEST:
        case QuoteConstants.GET_QUOTE_DETAIL_REQUEST:
        case QuoteConstants.COUNT_QUOTE_REQUEST:
        case QuoteConstants.GET_TOP_GOODS_CARE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case QuoteConstants.GET_ALL_QUOTES_FAILURE:
        case QuoteConstants.CREATE_QUOTE_FAILURE:
        case QuoteConstants.EDIT_QUOTE_FAILURE:
        case QuoteConstants.DELETE_QUOTE_FAILURE:
        case QuoteConstants.APPROVE_QUOTE_FAILURE:
        case QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_FAILURE:
        case QuoteConstants.GET_QUOTE_DETAIL_FAILURE:
        case QuoteConstants.COUNT_QUOTE_FAILURE:
        case QuoteConstants.GET_TOP_GOODS_CARE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    error: action.error
                }
        case QuoteConstants.GET_ALL_QUOTES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listQuotes: action.payload.allQuotes.docs,
                totalDocs: action.payload.allQuotes.totalDocs,
                limit: action.payload.allQuotes.limit,
                totalPages: action.payload.allQuotes.totalPages,
                page: action.payload.allQuotes.page,
                pagingCounter: action.payload.allQuotes.pagingCounter,
                hasPrevPage: action.payload.allQuotes.hasPrevPage,
                hasNextPage: action.payload.allQuotes.hasNextPage,
                prevPage: action.payload.allQuotes.prevPage,
                nextPage: action.payload.allQuotes.nextPage
            }
        case QuoteConstants.CREATE_QUOTE_SUCCESS:
            return {
                ...state,
                listQuotes: [
                    ...state.listQuotes,
                    action.payload.quote
                ],
                isLoading: false
            }
        
        case QuoteConstants.EDIT_QUOTE_SUCCESS:
            index = findIndex(state.listQuotes, action.payload.quote._id);
            if (index !== -1) {
                state.listQuotes[index] = action.payload.quote
            }
            return {
                ...state,
                isLoading: false
            }
        case QuoteConstants.APPROVE_QUOTE_SUCCESS:
            index = findIndex(state.listQuotes, action.payload.quote._id);
            if (index !== -1) {
                state.listQuotes[index] = action.payload.quote
            }
            return {
                ...state,
                isLoading: false
            }
            
        case QuoteConstants.DELETE_QUOTE_SUCCESS:
                index = findIndex(state.listQuotes, action.payload.quote._id);

                if(index !== -1){
                    state.listQuotes.splice(index, 1);
                }
                return {
                    ...state,
                    isLoading: false
            }
        
        case QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                quotesToMakeOrder: action.payload.quotes,
            }
        
        case QuoteConstants.GET_QUOTE_DETAIL_SUCCESS:
            return {
                ...state,
                quoteDetail: action.payload.quote,
                isLoading: false
            }
        
        case QuoteConstants.COUNT_QUOTE_SUCCESS:
            return {
                ...state,
                quoteCounter: action.payload.quoteCounter,
                isLoading: false
            }
        case QuoteConstants.GET_TOP_GOODS_CARE_SUCCESS:
            return {
                ...state,
                topGoodsCare: action.payload.topGoodsCare,
                isLoading: false
        }
        
        default:
        return state
    
    }
}
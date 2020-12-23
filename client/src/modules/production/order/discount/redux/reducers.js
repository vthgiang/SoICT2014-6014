import { DiscountConstants } from './constants';

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
    listDiscounts: [],
    listDiscountsByOrderValue: []
}

export function discounts(state = initState, action) { 
    let index = -1;
    switch (action.type) {
        case DiscountConstants.CREATE_DISCOUNT_REQUEST:
        case DiscountConstants.GET_ALL_DISCOUNTS_REQUEST:
        case DiscountConstants.EDIT_DISCOUNT_REQUEST:
        case DiscountConstants.CHANGE_DISCOUNT_STATUS_REQUEST:
        case DiscountConstants.DELETE_DISCOUNT_REQUEST:
        case DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case DiscountConstants.CREATE_DISCOUNT_FAILURE:
        case DiscountConstants.GET_ALL_DISCOUNTS_FAILURE:
        case DiscountConstants.EDIT_DISCOUNT_FAILURE:
        case DiscountConstants.CHANGE_DISCOUNT_STATUS_FAILURE:
        case DiscountConstants.DELETE_DISCOUNT_FAILURE:
        case DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        
        case DiscountConstants.GET_ALL_DISCOUNTS_SUCCESS: 
            return {
                ...state,
                isLoading: false,
                listDiscounts: action.payload.allDiscounts.docs,
                totalDocs: action.payload.allDiscounts.totalDocs,
                limit: action.payload.allDiscounts.limit,
                totalPages: action.payload.allDiscounts.totalPages,
                page: action.payload.allDiscounts.page,
                pagingCounter: action.payload.allDiscounts.pagingCounter,
                hasPrevPage: action.payload.allDiscounts.hasPrevPage,
                hasNextPage: action.payload.allDiscounts.hasNextPage,
                prevPage: action.payload.allDiscounts.prevPage,
                nextPage: action.payload.allDiscounts.nextPage
            }
        
        case DiscountConstants.CREATE_DISCOUNT_SUCCESS:
            return {
                ...state,
                listDiscounts: [
                    ...state.listDiscounts,
                    action.payload.discount
                ],
                isLoading: false
            }
        case DiscountConstants.EDIT_DISCOUNT_SUCCESS:
            console.log("action.payload", action.payload.discount);
            index = findIndex(state.listDiscounts, action.payload.discount.code);
                if (index !== -1) {
                    state.listDiscounts[index] = action.payload.discount
                }
                return {
                    ...state,
                    isLoading: false
            }
        case DiscountConstants.CHANGE_DISCOUNT_STATUS_SUCCESS:
            index = findIndex(state.listDiscounts, action.payload.code);

            if(index !== -1){
                state.listDiscounts.splice(index, 1);
            }
            return {
                ...state,
                isLoading: false
            }
        case DiscountConstants.DELETE_DISCOUNT_SUCCESS:
            console.log("action.payload", action.payload[0]);
            index = findIndex(state.listDiscounts, action.payload[0].code);
            console.log(" state.listDiscounts",  state.listDiscounts);
            console.log("index", index);

            if(index !== -1){
                state.listDiscounts.splice(index, 1);
            }
            return {
                ...state,
                isLoading: false
            }
        case DiscountConstants.GET_DISCOUNT_BY_ORDER_VALUE_SUCCESS:
            return {
                ...state,
                listDiscountsByOrderValue: action.payload.discounts,
                isLoading: false
            }
        default:
            return state
    }
}
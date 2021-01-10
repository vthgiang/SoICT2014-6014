import { BankAccountConstants } from './constants';

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
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listBankAccounts: [],
}

export function bankAccounts(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case BankAccountConstants.CREATE_BANK_ACCOUNT_REQUEST:
        case BankAccountConstants.UPDATE_BANK_ACCOUNT_REQUEST:
        case BankAccountConstants.GET_ALL_BANK_ACCOUNTS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case BankAccountConstants.CREATE_BANK_ACCOUNT_FAILURE:
        case BankAccountConstants.UPDATE_BANK_ACCOUNT_FAILURE:
        case BankAccountConstants.GET_ALL_BANK_ACCOUNTS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case BankAccountConstants.GET_ALL_BANK_ACCOUNTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBankAccounts: action.payload.allBankAccounts.docs,
                totalDocs: action.payload.allBankAccounts.totalDocs,
                limit: action.payload.allBankAccounts.limit,
                totalPages: action.payload.allBankAccounts.totalPages,
                page: action.payload.allBankAccounts.page,
                pagingCounter: action.payload.allBankAccounts.pagingCounter,
                hasPrevPage: action.payload.allBankAccounts.hasPrevPage,
                hasNextPage: action.payload.allBankAccounts.hasNextPage,
                prevPage: action.payload.allBankAccounts.prevPage,
                nextPage: action.payload.allBankAccounts.nextPage
            }
        case BankAccountConstants.CREATE_BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                listBankAccounts: [
                    ...state.listBankAccounts,
                    action.payload.bankAccount
                ],
                isLoading: false
            }
        case BankAccountConstants.UPDATE_BANK_ACCOUNT_SUCCESS:
            index = findIndex(state.listBankAccounts, action.payload.bankAccount._id);
            if (index !== -1) {
                state.listBankAccounts[index] = action.payload.bankAccount
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}
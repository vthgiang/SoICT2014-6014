import { BankAccountConstants } from './constants';
import { BankAccountServices } from './services';

export const BankAccountActions = {
    createBankAccount,
    getAllBankAccounts,
    updateBankAccount,
}

function createBankAccount (data) {
    return (dispatch) => {
        dispatch({
            type: BankAccountConstants.CREATE_BANK_ACCOUNT_REQUEST
        });

        BankAccountServices.createBankAccount(data)
        .then((res) => {
            dispatch({
                type: BankAccountConstants.CREATE_BANK_ACCOUNT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: BankAccountConstants.CREATE_BANK_ACCOUNT_FAILURE,
                error
            })
        })
    }
}

function getAllBankAccounts (queryData) {
    return (dispatch) => {
        dispatch({
            type: BankAccountConstants.GET_ALL_BANK_ACCOUNTS_REQUEST
        })

        BankAccountServices.getAllBankAccounts(queryData)
        .then((res) => {
            dispatch({
                type: BankAccountConstants.GET_ALL_BANK_ACCOUNTS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: BankAccountConstants.GET_ALL_BANK_ACCOUNTS_FAILURE
            })
        })
    }
}

function updateBankAccount (id, data) {
    return (dispatch) => {
        dispatch({
            type: BankAccountConstants.UPDATE_BANK_ACCOUNT_REQUEST
        })

        BankAccountServices.updateBankAccount(id, data)
        .then((res) => {
            dispatch({
                type: BankAccountConstants.UPDATE_BANK_ACCOUNT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: BankAccountConstants.UPDATE_BANK_ACCOUNT_FAILURE,
                error
            })
        })
    }
}
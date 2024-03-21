import { sendRequest } from '../../../../../helpers/requestHelper'

export const BankAccountServices = {
  createBankAccount,
  getAllBankAccounts,
  updateBankAccount
}

function createBankAccount(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bank-account`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.bank_account'
  )
}

function getAllBankAccounts(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bank-account`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.bank_account'
  )
}

function updateBankAccount(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bank-account/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.bank_account'
  )
}

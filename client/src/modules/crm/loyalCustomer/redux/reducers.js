import { CrmLoyalCustomerConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  list: [],
  totalDocs: 0,
  isLoading: true
}

export function loyalCustomers(state = initState, action) {
  switch (action.type) {
    case CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_FAILE:
      return {
        ...state,
        isLoading: false
      }

    case CrmLoyalCustomerConstants.GET_CRM_LOYALCUSTOMERS_SUCCESS:
      console.log('payload', action.payload)
      return {
        ...state,
        totalDocs: action.payload.listDocsTotal,
        list: action.payload.loyalCustomers,
        isLoading: false
      }

    default:
      return state
  }
}

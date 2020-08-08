import { CustomerServices } from "./services";
import { CustomerConstants } from "./constants";

export const CustomerActions = {
    // Customer
    getCustomers,
    createCustomer,

    // Customer Group
    getCustomerGroups,
};

function getCustomers(data=undefined){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: CustomerConstants.PAGINATE_CUSTOMERS_REQUEST});
            CustomerServices.getCustomers(data)
            .then(res => {
                dispatch({
                    type: CustomerConstants.PAGINATE_CUSTOMERS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err=>{ dispatch({ type: CustomerConstants.PAGINATE_CUSTOMERS_FAILE })})
        }
    }
    return dispatch => {
        dispatch({ type: CustomerConstants.GET_CUSTOMERS_REQUEST});
        CustomerServices.getCustomers()
        .then(res => {
            dispatch({
                type: CustomerConstants.GET_CUSTOMERS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CustomerConstants.GET_CUSTOMERS_FAILE })})
    }
}

function createCustomer(data){
    return dispatch => {
        dispatch({ type: CustomerConstants.CREATE_CUSTOMER_REQUEST});
        CustomerServices.createCustomer(data)
        .then(res => {
            dispatch({
                type: CustomerConstants.CREATE_CUSTOMER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CustomerConstants.CREATE_CUSTOMER_FAILE })})
    }
}

function getCustomerGroups(data=undefined){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: CustomerConstants.PAGINATE_CUSTOMER_GROUPS_REQUEST});
            CustomerServices.getCustomerGroups(data)
            .then(res => {
                dispatch({
                    type: CustomerConstants.PAGINATE_CUSTOMER_GROUPS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err=>{ dispatch({ type: CustomerConstants.PAGINATE_CUSTOMER_GROUPS_FAILE })})
        }
    }
    return dispatch => {
        dispatch({ type: CustomerConstants.GET_CUSTOMER_GROUPS_REQUEST});
        CustomerServices.getCustomerGroups()
        .then(res => {
            dispatch({
                type: CustomerConstants.GET_CUSTOMER_GROUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CustomerConstants.GET_CUSTOMER_GROUPS_FAILE })})
    }
}

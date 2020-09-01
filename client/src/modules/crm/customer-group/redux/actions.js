import { CustomerServices } from "./services";
import { CustomerConstants } from "./constants";

export const CustomerActions = {
    getCustomerGroups,
    getLocations
};

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

function getLocations(){
    return dispatch => {
        dispatch({ type: CustomerConstants.GET_LOCATIONS_REQUEST});
        CustomerServices.getLocations()
        .then(res => {
            dispatch({
                type: CustomerConstants.GET_LOCATIONS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CustomerConstants.GET_LOCATIONS_FAILE })})
    }
}
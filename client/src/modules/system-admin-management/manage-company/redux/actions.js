import { companyServices } from "./services";
import { companyConstants } from "./constants";

export const get = () => {
    return dispatch => {
        dispatch({ type: companyConstants.GET_COMPANIES_REQUEST});
        companyServices.get()
            .then(res => {
                dispatch({
                    type: companyConstants.GET_COMPANIES_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (company) => {
    return dispatch => {
        dispatch({ type: companyConstants.CREATE_COMPANY_REQUEST});
        companyServices.create(company)
            .then(res => {
                dispatch({
                    type: companyConstants.CREATE_COMPANY_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err.response.data);
            })
    }
}
import { companyServices } from "./services";
import { companyConstants } from "./constants";

export const get = () => {
    return dispatch => {
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
    console.log("Company req: ",company);
    return dispatch => {
        companyServices.create(company)
            .then(res => {
                dispatch({
                    type: companyConstants.CREATE_COMPANIE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err.response.data);
            })
    }
}
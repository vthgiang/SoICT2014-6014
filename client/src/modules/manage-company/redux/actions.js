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
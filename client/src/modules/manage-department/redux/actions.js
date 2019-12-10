import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const get = () => {
    return dispatch => {
        DepartmentServices.get()
            .then(res => {
                dispatch({
                    type: DepartmentConstants.GET_DEPARTMENTS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}
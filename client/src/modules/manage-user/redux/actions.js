import { UserServices } from "./services";
import { UserConstants } from "./constants";

export const get = () => {
    return dispatch => {
        UserServices.get()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_USERS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}
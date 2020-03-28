import { RoleDefaultServices } from "./services";
import { RoleDefaultConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const RoleDefaultActions = {
    get
}

function get(){
    return dispatch => {
        dispatch({ type: RoleDefaultConstants.GET_ROLES_DEFAULT_REQUEST});
        RoleDefaultServices.get()
            .then(res => {
                dispatch({
                    type: RoleDefaultConstants.GET_ROLES_DEFAULT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err.response);
                AlertActions.handleAlert(dispatch, err);
            })
    }
}
import { RoleDefaultServices } from "./services";
import { RoleDefaultConstants } from "./constants";

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
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: RoleDefaultConstants.GET_ROLES_DEFAULT_FAILE});
            })
    }
}
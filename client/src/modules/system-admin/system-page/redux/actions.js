import { SystemPageServices } from "./services";
import { SystemPageConstants } from "./constants";

const getPageApis = (data) => {
    return dispatch => {
        dispatch({ type: SystemPageConstants.GET_SYSTEM_PAGE_APIS });

        SystemPageServices.getPageApis(data)
            .then(res => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_PAGE_APIS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_PAGE_APIS_FAILURE,
                    payload: error
                });

            })
    }
}

export const SystemPageActions = {
    getPageApis,
}
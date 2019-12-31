import { ComponentServices } from "./services";
import { ComponentConstants } from "./constants";

export const get = () => {
    return dispatch => {
        dispatch({ type: ComponentConstants.GET_COMPONENTS_REQUEST});
        ComponentServices.get()
            .then(res => {
                dispatch({
                    type: ComponentConstants.GET_COMPONENTS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const show = (id) => {
    return dispatch => {
        dispatch({ type: ComponentConstants.SHOW_COMPONENT_REQUEST});
        ComponentServices.show(id)
            .then(res => {
                dispatch({
                    type: ComponentConstants.SHOW_COMPONENT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (component) => {
    return dispatch => {
        dispatch({ type: ComponentConstants.CREATE_COMPONENT_REQUEST});
        ComponentServices.create(component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.CREATE_COMPONENT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const edit = (id, component) => {
    return dispatch => {
        dispatch({ type: ComponentConstants.EDIT_COMPONENT_REQUEST});
        ComponentServices.edit(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.EDIT_COMPONENT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const destroy = (id, component) => {
    return dispatch => {
        dispatch({ type: ComponentConstants.DELETE_COMPONENT_REQUEST});
        ComponentServices.destroy(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.DELETE_COMPONENT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}



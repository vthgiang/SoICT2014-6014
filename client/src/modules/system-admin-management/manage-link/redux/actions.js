import { LinkServices } from "./services";
import { LinkConstants } from "./constants";

export const get = () => {
    return dispatch => {
        dispatch({ type: LinkConstants.GET_LINKS_REQUEST});
        LinkServices.get()
            .then(res => {
                dispatch({
                    type: LinkConstants.GET_LINKS_SUCCESS,
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
        dispatch({ type: LinkConstants.SHOW_LINK_REQUEST});
        LinkServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (link) => {
    return dispatch => {
        dispatch({ type: LinkConstants.CREATE_LINK_REQUEST});
        LinkServices.create(link)
            .then(res => {
                dispatch({
                    type: LinkConstants.CREATE_LINK_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const edit = (id, link) => {
    return dispatch => {
        dispatch({ type: LinkConstants.EDIT_LINK_REQUEST});
        LinkServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.EDIT_LINK_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const destroy = (id, link) => {
    return dispatch => {
        dispatch({ type: LinkConstants.DELETE_LINK_REQUEST});
        LinkServices.destroy(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.DELETE_LINK_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}



import { LinkServices } from "./services";
import { LinkConstants } from "./constants";

export const get = () => {
    return dispatch => {
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
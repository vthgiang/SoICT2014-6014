import { LinkServices } from "./services";
import { LinkConstants } from "./constants";

export const LinkActions = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get(){
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

function getPaginate(data){
    return dispatch => {
        dispatch({ type: LinkConstants.GET_LINKS_PAGINATE_REQUEST});
        LinkServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: LinkConstants.GET_LINKS_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

function show(id){
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

function create(link){
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

function edit(id, link){
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

function destroy(id, link){
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



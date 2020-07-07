import { LinkServices } from "./services";
import { LinkConstants } from "./constants";

export const LinkActions = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(data){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: LinkConstants.GET_LINKS_PAGINATE_REQUEST});
            LinkServices.get(data)
                .then(res => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
        }
    }
    return dispatch => {
        return dispatch => {
            dispatch({ type: LinkConstants.GET_LINKS_REQUEST});
            LinkServices.get()
                .then(res => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_SUCCESS,
                        payload: res.data.content
                    })
                })
        }
    }
}

function show(id){
    return dispatch => {
        dispatch({ type: LinkConstants.SHOW_LINK_REQUEST});
        LinkServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_SUCCESS,
                    payload: res.data.content
                })
            })
    }
}

function create(link){
    return dispatch => {
        dispatch({ type: LinkConstants.CREATE_LINK_REQUEST});
        LinkServices
                .create(link)
                .then(res => {
                    dispatch({
                        type: LinkConstants.CREATE_LINK_SUCCESS,
                        payload: res.data.content
                    });
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
                    payload: res.data.content
                })
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
    }
}



import { LinkDefaultServices } from "./services";
import { LinkDefaultConstants } from "./constants";

export const LinkDefaultActions = {
    get,
    getCategories,
    show,
    create,
    edit,
    destroy
};

function get(data){
    if(data === undefined){
        return dispatch => {
            dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_REQUEST});
            LinkDefaultServices.get()
                .then(res => {
                    dispatch({
                        type: LinkDefaultConstants.GET_LINKS_DEFAULT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_FAILE});
                })
        }
    }else{
        return dispatch => {
            dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_REQUEST});
            LinkDefaultServices.get(data)
                .then(res => {
                    dispatch({
                        type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_FAILE});
                })
        }
    }
}

function getCategories(){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_CATEGORIES_REQUEST});
        LinkDefaultServices.getCategories()
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.GET_LINKS_DEFAULT_CATEGORIES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_CATEGORIES_FAILE});
            })
    }
}

function show(id){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.SHOW_LINK_DEFAULT_REQUEST});
        LinkDefaultServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.SHOW_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.SHOW_LINK_DEFAULT_FAILE});
            })
    }
}

function create(link){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.CREATE_LINK_DEFAULT_REQUEST});
        LinkDefaultServices
            .create(link)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.CREATE_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.CREATE_LINK_DEFAULT_FAILE});
            })
    }
}

function edit(id, link){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.EDIT_LINK_DEFAULT_REQUEST});
        LinkDefaultServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.EDIT_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.EDIT_LINK_DEFAULT_FAILE});
            })
    }
}

function destroy(id, link){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.DELETE_LINK_DEFAULT_REQUEST});
        LinkDefaultServices.destroy(id, link)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.DELETE_LINK_DEFAULT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.DELETE_LINK_DEFAULT_FAILE});
            })
    }
}

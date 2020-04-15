import { LinkDefaultServices } from "./services";
import { LinkDefaultConstants } from "./constants";
import { AlertActions} from '../../../alert/redux/actions';

export const LinkDefaultActions = {
    get,
    getCategories,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get(){
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
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
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
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_REQUEST});
        LinkDefaultServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.GET_LINKS_DEFAULT_PAGINATE_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
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
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function create(link){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.CREATE_LINK_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            LinkDefaultServices
                .create(link)
                .then(res => {
                    dispatch({
                        type: LinkDefaultConstants.CREATE_LINK_DEFAULT_SUCCESS,
                        payload: res.data.content
                    });
                    resolve(res);
                })
                .catch(err => {
                    dispatch({ type: LinkDefaultConstants.CREATE_LINK_DEFAULT_FAILE});
                    AlertActions.handleAlert(dispatch, err);
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function edit(id, link){
    return dispatch => {
        dispatch({ type: LinkDefaultConstants.EDIT_LINK_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            LinkDefaultServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkDefaultConstants.EDIT_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: LinkDefaultConstants.EDIT_LINK_DEFAULT_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
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
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err.response.data);
            })
    }
}



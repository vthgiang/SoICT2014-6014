import { LinkServices } from "./services";
import { LinkConstants } from "./constants";
import { AlertActions} from '../../../alert/redux/actions';

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
        dispatch({ type: LinkConstants.GET_LINKS_DEFAULT_REQUEST});
        LinkServices.get()
            .then(res => {
                dispatch({
                    type: LinkConstants.GET_LINKS_DEFAULT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: LinkConstants.GET_LINKS_DEFAULT_PAGINATE_REQUEST});
        LinkServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: LinkConstants.GET_LINKS_DEFAULT_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function show(id){
    return dispatch => {
        dispatch({ type: LinkConstants.SHOW_LINK_DEFAULT_REQUEST});
        LinkServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_DEFAULT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function create(link){
    return dispatch => {
        dispatch({ type: LinkConstants.CREATE_LINK_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            LinkServices
                .create(link)
                .then(res => {
                    dispatch({
                        type: LinkConstants.CREATE_LINK_DEFAULT_SUCCESS,
                        payload: res.data
                    });
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: err.response.data.msg
                    })
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function edit(id, link){
    return dispatch => {
        dispatch({ type: LinkConstants.EDIT_LINK_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            LinkServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.EDIT_LINK_DEFAULT_SUCCESS,
                    payload: res.data
                })
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        })
    }
}

function destroy(id, link){
    return dispatch => {
        dispatch({ type: LinkConstants.DELETE_LINK_DEFAULT_REQUEST});
        LinkServices.destroy(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.DELETE_LINK_DEFAULT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}



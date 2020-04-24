import { ComponentDefaultServices } from "./services";
import { ComponentDefaultConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const ComponentDefaultActions = {
    get,
    getPaginate,
    edit,
    create,
    show,
    destroy
}


function get(){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_REQUEST});
        ComponentDefaultServices.get()
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_REQUEST});
        ComponentDefaultServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function show(id){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.SHOW_COMPONENT_DEFAULT_REQUEST});
        ComponentDefaultServices.show(id)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.SHOW_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: ComponentDefaultConstants.SHOW_COMPONENT_DEFAULT_FAILE});
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function create(component){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            ComponentDefaultServices.create(component)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                dispatch({ type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_FAILE});
                reject(err);
            })
        })
        
    }
}

function edit(id, component){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_REQUEST});
        return new Promise((resolve, reject) => {
            ComponentDefaultServices.edit(id, component)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                dispatch({ type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_FAILE});
                reject(err);
            })
        })
    }
}

function destroy(id, component){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_REQUEST});
        ComponentDefaultServices.destroy(id, component)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                dispatch({ type: ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_FAILE});
            })
    }
}



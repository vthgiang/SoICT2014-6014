import { ComponentDefaultServices } from "./services";
import { ComponentDefaultConstants } from "./constants";

export const ComponentDefaultActions = {
    get,
    edit,
    create,
    show,
    destroy
}


function get(data){
    if(data === undefined){
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
                    
                })
        }
    }else{
        return dispatch => {
            dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_REQUEST});
            ComponentDefaultServices.get(data)
                .then(res => {
                    dispatch({
                        type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_FAILE});
                    
                })
        }
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
                
            })
    }
}

function create(component){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_REQUEST});
        ComponentDefaultServices.create(component)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_FAILE});
            })
        
    }
}

function edit(id, component){
    return dispatch => {
        dispatch({ type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_REQUEST});
        ComponentDefaultServices.edit(id, component)
            .then(res => {
                dispatch({
                    type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_FAILE});
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
                dispatch({ type: ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_FAILE});
            })
    }
}



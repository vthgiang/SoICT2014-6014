import { UserServices } from "./services";
import { UserConstants } from "./constants";

export const UserActions = {
    get,
    getPaginate,
    edit,
    create,
    destroy
};

function get(){
    return dispatch => {
        dispatch({ type: UserConstants.GET_USERS_REQUEST});
        UserServices.get()
        .then(res => {
            dispatch({
                type: UserConstants.GET_USERS_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error: ", err.response);
        })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: UserConstants.GET_USERS_PAGINATE_REQUEST});
        UserServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: UserConstants.GET_USERS_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

function edit(data){
    return dispatch => {
        dispatch({ type: UserConstants.EDIT_USER_REQUEST});
        UserServices.edit(data)
            .then(res => {
                dispatch({
                    type: UserConstants.EDIT_USER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: UserConstants.CREATE_USER_REQUEST});
        UserServices.create(data)
            .then(res => {
                dispatch({
                    type: UserConstants.CREATE_USER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

function destroy(id){
    return dispatch => {
        dispatch({ type: UserConstants.DELETE_USER_REQUEST});
        UserServices.destroy(id)
            .then(res => {
                dispatch({
                    type: UserConstants.DELETE_USER_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}
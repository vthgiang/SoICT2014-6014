import { UserServices } from "./services";
import { UserConstants } from "./constants";

export const UserActions = {
    get,
    getPaginate,
    edit,
    create,
    destroy,
    getRoleSameDepartment,
    getAllUserOfCompany,
    getAllUserOfDepartment,
    getAllUserSameDepartment
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
            dispatch({
                type: UserConstants.GET_USERS_FAILE
            })
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
                dispatch({
                    type: UserConstants.GET_USERS_PAGINATE_FAILE
                })
                console.log("Error: ", err);
            })
    }
}

function edit(id, data){
    return dispatch => {
        dispatch({ type: UserConstants.EDIT_USER_REQUEST});
        return new Promise((resolve, reject) => {
            UserServices.edit(id, data)
            .then(res => {
                dispatch({
                    type: UserConstants.EDIT_USER_SUCCESS,
                    payload: res.data
                });
                resolve(res.data);
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.EDIT_USER_FAILE
                })
                console.log("Error: ", err);
                reject(err);
            })
        })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: UserConstants.CREATE_USER_REQUEST});
        return new Promise((resolve, reject) => {
            UserServices.create(data)
                .then(res => {
                    dispatch({
                        type: UserConstants.CREATE_USER_SUCCESS,
                        payload: res.data
                    })
                    resolve(res.data);
                })
                .catch(err => {
                    dispatch({
                        type: UserConstants.CREATE_USER_FAILE
                    })
                    console.log("Error: ", err);
                    reject(err);
                })
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
                dispatch({
                    type: UserConstants.DELETE_USER_FAILE
                })
                console.log("Error: ", err);
            })
    }
}

export const getRoles = () => {
    return dispatch => {
        UserServices.getRoles()
            .then(res => {
                let roles = [];
                res.data.forEach(data => {
                    roles.push({
                        id: data.id_role._id,
                        name: data.id_role.name
                    })
                });
                dispatch({
                    type: UserConstants.GET_USER_ROLES_SUCCESS,
                    payload: roles
                })
            })
            .catch(err => {
                console.log("ERROR ROLES");
            })
    }
}

export const getLinkOfRole = () => {
    return dispatch => {
        UserServices.getLinkOfRole()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_LINK_OF_ROLE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("ERROR ROLES");
            })
    }
}

function getRoleSameDepartment(currentRole) {
    return dispatch => {
        dispatch(request(currentRole));

        UserServices.getRoleSameDepartmentOfUser(currentRole)
            .then(
                roleDepartment => dispatch(success(roleDepartment)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(currentRole) { return { type: UserConstants.GETROLE_SAMEDEPARTMENT_REQUEST, currentRole } }
    function success(roleDepartment) { return { type: UserConstants.GETROLE_SAMEDEPARTMENT_SUCCESS, roleDepartment } }
    function failure(error) { return { type: UserConstants.GETROLE_SAMEDEPARTMENT_FAILURE, error } }
}

function getAllUserOfCompany() {
    return dispatch => {
        UserServices.getAllUserOfCompany()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };
    function success(users) { return { type: UserConstants.GETALLUSER_OFCOMPANY_SUCCESS, users } }
    function failure(error) { return { type: UserConstants.GETALLUSER_OFCOMPANY_FAILURE, error } }
}

function getAllUserOfDepartment(id) {
    return dispatch => {
        dispatch(request(id));
        UserServices.getAllUserOfDepartment(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request(id) { return { type: UserConstants.GETALLUSER_OFDEPARTMENT_REQUEST, id } }
    function success(users) { return { type: UserConstants.GETALLUSER_OFDEPARTMENT_SUCCESS, users } }
    function failure(error) { return { type: UserConstants.GETALLUSER_OFDEPARTMENT_FAILURE, error } }
}

function getAllUserSameDepartment(currentRole) {
    return dispatch => {
        dispatch(request(currentRole));
        UserServices.getAllUserSameDepartment(currentRole)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request(id) { return { type: UserConstants.GETALLUSER_SAMEDEPARTMENT_REQUEST, id } }
    function success(users) { return { type: UserConstants.GETALLUSER_SAMEDEPARTMENT_SUCCESS, users } }
    function failure(error) { return { type: UserConstants.GETALLUSER_SAMEDEPARTMENT_FAILURE, error } }
}
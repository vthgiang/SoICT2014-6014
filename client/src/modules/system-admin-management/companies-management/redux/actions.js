import { CompanyServices } from "./services";
import { CompanyConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const CompanyActions = {
    get,
    getPaginate,
    create,
    edit,
    addNewLink,
    deleteLink
};

function get(){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPANIES_REQUEST});
        CompanyServices.get()
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPANIES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                dispatch({ type: CompanyConstants.GET_COMPANIES_FAILE});
                console.log("Error: ", err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPANIES_PAGINATE_REQUEST});
        CompanyServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPANIES_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_COMPANIES_PAGINATE_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function create(company){
    return dispatch => {
        dispatch({ type: CompanyConstants.CREATE_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.create(company)
            .then(res => {
                dispatch({
                    type: CompanyConstants.CREATE_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.CREATE_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        });
        
    }
}

function edit(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.EDIT_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.edit(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.EDIT_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.EDIT_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        });
        
    }
}

function addNewLink(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.addNewLink(id, data)
            .then(res => {
                console.log("add new link: ",res);
                dispatch({
                    type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS,
                    payload: {
                        companyId: id,
                        link: res.data.content
                    }
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        });
        
    }
}

function deleteLink(companyId, linkId){
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.deleteLink(companyId, linkId)
            .then(res => {
                console.log("delete link: ",res);
                dispatch({
                    type: CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        });
        
    }
}
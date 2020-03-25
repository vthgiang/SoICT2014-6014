import { CompanyServices } from "./services";
import { CompanyConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const CompanyActions = {
    get,
    getPaginate,
    create,
    edit
};

function get(){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPANIES_REQUEST});
        CompanyServices.get()
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPANIES_SUCCESS,
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
        dispatch({ type: CompanyConstants.GET_COMPANIES_PAGINATE_REQUEST});
        CompanyServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPANIES_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
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
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
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
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        });
        
    }
}
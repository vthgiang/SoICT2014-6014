import { CompanyServices } from "./services";
import { CompanyConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const CompanyActions = {
    get,
    getPaginate,
    create,
    edit,
    addNewLink,
    addNewComponent,
    deleteLink,
    deleteComponent,
    linksList,
    linksPaginate,
    componentsList,
    componentsPaginate
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
                dispatch({
                    type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
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
                dispatch({
                    type: CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function addNewComponent(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.addNewComponent(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function deleteComponent(companyId, componentId){
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.deleteComponent(companyId, componentId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function linksList(companyId){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.linksList(companyId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function linksPaginate(companyId, page, limit, data={}){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.linksPaginate(companyId, page, limit, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function componentsList(companyId){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.componentsList(companyId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}

function componentsPaginate(companyId, page, limit, data={}){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_REQUEST});
        return new Promise((resolve, reject) => {
            CompanyServices.componentsPaginate(companyId, page, limit, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_FAILE});
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        });
        
    }
}
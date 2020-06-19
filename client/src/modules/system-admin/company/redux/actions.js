import { CompanyServices } from "./services";
import { CompanyConstants } from "./constants";

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
    componentsPaginate,

    getImportConfiguration,
    createImportConfiguration,
    editImportConfiguration,
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
                
            })
    }
}

function create(company){
    return dispatch => {
        dispatch({ type: CompanyConstants.CREATE_COMPANY_REQUEST});
        CompanyServices.create(company)
            .then(res => {
                dispatch({
                    type: CompanyConstants.CREATE_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.CREATE_COMPANY_FAILE});
            })
        
    }
}

function edit(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.EDIT_COMPANY_REQUEST});
        CompanyServices.edit(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.EDIT_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.EDIT_COMPANY_FAILE});
            })
        
    }
}

function addNewLink(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_REQUEST});
        CompanyServices.addNewLink(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILE});
            })
        
    }
}

function deleteLink(companyId, linkId){
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_REQUEST});
        CompanyServices.deleteLink(companyId, linkId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILE});
            })
        
    }
}

function addNewComponent(id, data){
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_REQUEST});
        CompanyServices.addNewComponent(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_FAILE});
            })
    }
}

function deleteComponent(companyId, componentId){
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_REQUEST});
        CompanyServices.deleteComponent(companyId, componentId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_FAILE});;
            })
        
    }
}

function linksList(companyId){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_REQUEST});
        CompanyServices.linksList(companyId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_FAILE});
            })
    }
}

function linksPaginate(companyId, page, limit, data={}){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_REQUEST});
        CompanyServices.linksPaginate(companyId, page, limit, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_FAILE});
            })
        
    }
}

function componentsList(companyId){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_REQUEST});
        CompanyServices.componentsList(companyId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_FAILE});
            })
        
    }
}

function componentsPaginate(companyId, page, limit, data={}){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_REQUEST});
        CompanyServices.componentsPaginate(companyId, page, limit, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_FAILE});
            })
    }
}

function getImportConfiguration(data){
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_IMPORT_CONFIGURATION_REQUEST});
        CompanyServices.getImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ 
                    type: CompanyConstants.GET_IMPORT_CONFIGURATION_FAILE,
                    error: err
                });
            })
    }
}

function createImportConfiguration(data){
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_IMPORT_CONFIGURATION_REQUEST});
        CompanyServices.createImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ 
                    type: CompanyConstants.ADD_IMPORT_CONFIGURATION_FAILE,
                    error: err
                });
            })
    }
}

function editImportConfiguration(data){
    return dispatch => {
        dispatch({ type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_REQUEST});
        CompanyServices.editImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ 
                    type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_FAILE,
                    error: err
                });
            })
    }
}
import { CompanyServices } from "./services";
import { CompanyConstants } from "./constants";

export const CompanyActions = {
    get,
    create,
    edit,
    addNewLink,
    addNewComponent,
    deleteLink,
    deleteComponent,
    linksList,
    componentsList,

    getImportConfiguration,
    createImportConfiguration,
    editImportConfiguration,
};

/**
 * Lấy danh sách tất cả các công ty
 */
function get(data) {
    if (data === undefined) {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_COMPANIES_REQUEST });

            CompanyServices.get()
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_COMPANIES_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_COMPANIES_FAILE,
                        payload: error
                    });
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_COMPANIES_PAGINATE_REQUEST });

            CompanyServices.get(data)
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_COMPANIES_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_COMPANIES_PAGINATE_FAILE,
                        payload: error
                    });
                    
                })
        }
    }
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @company dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
function create(company) {
    return dispatch => {
        dispatch({ type: CompanyConstants.CREATE_COMPANY_REQUEST });

        CompanyServices.create(company)
            .then(res => {
                dispatch({
                    type: CompanyConstants.CREATE_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.CREATE_COMPANY_FAILE,
                    payload: error
                });
            })
        
    }
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
function edit(id, data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.EDIT_COMPANY_REQUEST });

        CompanyServices.edit(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.EDIT_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.EDIT_COMPANY_FAILE,
                    payload: error
                });
            })
        
    }
}

/**
 * Thêm link mới cho công ty
 * @id id của công ty
 * @data
    * @linkUrl đường dẫn cho link muốn tạo
    * @linkDescription mô tả về link
 */
function addNewLink(id, data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_REQUEST });

        CompanyServices.addNewLink(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILE,
                    payload: error
                });
            })
        
    }
}

/**
 * Xóa 1 link của công ty
 * @companyId id của công ty
 * @linkId id của link muốn xóa
 */
function deleteLink(companyId, linkId) {
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_REQUEST });

        CompanyServices.deleteLink(companyId, linkId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILE,
                    payload: error
                });
            })
        
    }
}

/**
 * Thêm mới 1 component cho công ty
 * @id id của công ty
 * @data
    * @componentname tên của component
    * @componentDescription mô tả về component
    * @linkId id của link được chứa component này
 */
function addNewComponent(id, data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_REQUEST });

        CompanyServices.addNewComponent(id, data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_FAILE,
                    payload: error
                });
            })
    }
}

/**
 * Xóa một của component của công ty
 * @companyId id của công ty
 * @componentId id của component muốn xóa
 */
function deleteComponent(companyId, componentId) {
    return dispatch => {
        dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_REQUEST });

        CompanyServices.deleteComponent(companyId, componentId)
            .then(res => {
                dispatch({
                    type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_FAILE,
                    payload: error
                });;
            })
        
    }
}

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
function linksList(companyId, data) {
    if(data === undefined) {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_REQUEST });

            CompanyServices.linksList(companyId)
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_SUCCESS,
                        payload: res.data.content
                    });
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_FAILE,
                        payload: error
                    });
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_REQUEST });

            CompanyServices.linksList(companyId, data)
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_SUCCESS,
                        payload: res.data.content
                    });
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_FAILE,
                        payload: error
                    });
                })
        }
    }
}

/**
 * Lấy danh sách các component của công ty
 * @companyId id của công ty
 */
function componentsList(companyId, data) {
    if(data === undefined) {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_REQUEST });

            CompanyServices.componentsList(companyId)
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_SUCCESS,
                        payload: res.data.content
                    });
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_FAILE,
                        payload: error
                    });
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_REQUEST });

            CompanyServices.componentsList(companyId, data)
                .then(res => {
                    dispatch({
                        type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_SUCCESS,
                        payload: res.data.content
                    });
                })
                .catch(error => {
                    dispatch({ 
                        type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_FAILE,
                        payload: error
                    });
                })
        }
    }
}

/**
 * Lấy thông tin cấu hình file import
 * @data
    * @type Thể loại file cấu hình(salary, taskTemplate);
 */
function getImportConfiguration(data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.GET_IMPORT_CONFIGURATION_REQUEST });

        CompanyServices.getImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.GET_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.GET_IMPORT_CONFIGURATION_FAILE,
                    payload: error
                });
            })
    }
}

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 */
function createImportConfiguration(data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.ADD_IMPORT_CONFIGURATION_REQUEST });

        CompanyServices.createImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.ADD_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.ADD_IMPORT_CONFIGURATION_FAILE,
                    payload: error
                });
            })
    }
}

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @data Dữ liệu chinhe sửa file cấu hình
 */
function editImportConfiguration(data) {
    return dispatch => {
        dispatch({ type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_REQUEST });

        CompanyServices.editImportConfiguration(data)
            .then(res => {
                dispatch({
                    type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ 
                    type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_FAILE,
                    payload: error
                });
            })
    }
}
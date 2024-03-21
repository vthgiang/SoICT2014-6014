import { CompanyServices } from './services'
import { CompanyConstants } from './constants'

export const CompanyActions = {
  getAllCompanies,
  createCompany,
  editCompany,
  addCompanyLink,
  deleteCompanyLink,
  addCompanyComponent,
  deleteCompanyComponent,
  getCompanyLinks,
  getCompanyComponents,

  getImportConfiguration,
  createImportConfiguration,
  editImportConfiguration,

  updateCompanyLinks,
  updateCompanyComponents,
  uploadOrganizationalUnitImage,
  getCompanyInformation,
  requestService
}

/**
 * Lấy danh sách tất cả các công ty
 */
function getAllCompanies(data) {
  if (!data) {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_COMPANIES_REQUEST })

      CompanyServices.getAllCompanies()
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_COMPANIES_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_COMPANIES_FAILURE,
            payload: error
          })
        })
    }
  } else {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_COMPANIES_PAGINATE_REQUEST })

      CompanyServices.getAllCompanies(data)
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_COMPANIES_PAGINATE_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_COMPANIES_PAGINATE_FAILURE,
            payload: error
          })
        })
    }
  }
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @company dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
function createCompany(company) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.CREATE_COMPANY_REQUEST })

    CompanyServices.createCompany(company)
      .then((res) => {
        dispatch({
          type: CompanyConstants.CREATE_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.CREATE_COMPANY_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
function editCompany(id, data) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.EDIT_COMPANY_REQUEST })

    CompanyServices.editCompany(id, data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.EDIT_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.EDIT_COMPANY_FAILURE,
          payload: error
        })
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
function addCompanyLink(id, data) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_REQUEST })

    CompanyServices.addCompanyLink(id, data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Xóa 1 link của công ty
 * @companyId id của công ty
 * @linkId id của link muốn xóa
 */
function deleteCompanyLink(companyId, linkId) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.DELETE_LINK_FOR_COMPANY_REQUEST })

    CompanyServices.deleteCompanyLink(companyId, linkId)
      .then((res) => {
        dispatch({
          type: CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILURE,
          payload: error
        })
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
function addCompanyComponent(id, data) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_REQUEST })

    CompanyServices.addCompanyComponent(id, data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Xóa một của component của công ty
 * @companyId id của công ty
 * @componentId id của component muốn xóa
 */
function deleteCompanyComponent(companyId, componentId) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_REQUEST })

    CompanyServices.deleteCompanyComponent(companyId, componentId)
      .then((res) => {
        dispatch({
          type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
function getCompanyLinks(params) {
  if (params.page === undefined && params.limit === undefined) {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_REQUEST })

      CompanyServices.getCompanyLinks(params)
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_LINKS_LIST_OF_COMPANY_FAILURE,
            payload: error
          })
        })
    }
  } else {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_REQUEST })

      CompanyServices.getCompanyLinks(params)
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_FAILURE,
            payload: error
          })
        })
    }
  }
}

/**
 * Lấy danh sách các component của công ty
 * @companyId id của công ty
 */
function getCompanyComponents(params) {
  if (params.page === undefined && params.limit === undefined) {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_REQUEST })

      CompanyServices.getCompanyComponents(params)
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_FAILURE,
            payload: error
          })
        })
    }
  } else {
    return (dispatch) => {
      dispatch({ type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_REQUEST })

      CompanyServices.getCompanyComponents(params)
        .then((res) => {
          dispatch({
            type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_SUCCESS,
            payload: res.data.content
          })
        })
        .catch((error) => {
          dispatch({
            type: CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_FAILURE,
            payload: error
          })
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
  return (dispatch) => {
    dispatch({ type: CompanyConstants.GET_IMPORT_CONFIGURATION_REQUEST })

    CompanyServices.getImportConfiguration(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.GET_IMPORT_CONFIGURATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.GET_IMPORT_CONFIGURATION_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 */
function createImportConfiguration(data) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.ADD_IMPORT_CONFIGURATION_REQUEST })

    CompanyServices.createImportConfiguration(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.ADD_IMPORT_CONFIGURATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.ADD_IMPORT_CONFIGURATION_FAILURE,
          payload: error
        })
      })
  }
}

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @data Dữ liệu chinhe sửa file cấu hình
 */
function editImportConfiguration(data) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_REQUEST })

    CompanyServices.editImportConfiguration(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.EDIT_IMPORT_CONFIGURATION_FAILURE,
          payload: error
        })
      })
  }
}

function updateCompanyLinks(data, params) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.UPDATE_COMPANY_LINKS_REQUEST })

    CompanyServices.updateCompanyLinks(data, params)
      .then((res) => {
        dispatch({
          type: CompanyConstants.UPDATE_COMPANY_LINKS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.UPDATE_COMPANY_LINKS_FAILURE,
          payload: error
        })
      })
  }
}

function updateCompanyComponents(data, params) {
  return (dispatch) => {
    dispatch({ type: CompanyConstants.UPDATE_COMPANY_COMPONENTS_REQUEST })

    CompanyServices.updateCompanyComponents(data, params)
      .then((res) => {
        dispatch({
          type: CompanyConstants.UPDATE_COMPANY_COMPONENTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: CompanyConstants.UPDATE_COMPANY_COMPONENTS_FAILURE,
          payload: error
        })
      })
  }
}

function uploadOrganizationalUnitImage(data) {
  return (dispatch) => {
    dispatch({
      type: CompanyConstants.UPLOAD_ORGANIZATIONAL_UNIT_REQUEST
    })
    CompanyServices.uploadOrganizationalUnitImage(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.UPLOAD_ORGANIZATIONAL_UNIT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CompanyConstants.UPLOAD_ORGANIZATIONAL_UNIT_FAILURE,
          payload: err
        })
      })
  }
}

function getCompanyInformation(data) {
  return (dispatch) => {
    dispatch({
      type: CompanyConstants.GET_COMPANY_INFOMATION_REQUES
    })
    CompanyServices.getCompanyInformation(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.GET_COMPANY_INFOMATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CompanyConstants.GET_COMPANY_INFOMATION_FAILURE,
          payload: err
        })
      })
  }
}

function requestService(data) {
  return (dispatch) => {
    dispatch({
      type: CompanyConstants.REQUEST_SERVICE_REQUEST
    })
    CompanyServices.requestService(data)
      .then((res) => {
        dispatch({
          type: CompanyConstants.REQUEST_SERVICE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: CompanyConstants.REQUEST_SERVICE_FAILURE,
          payload: err
        })
      })
  }
}

import { CrmCustomerServices } from './services'
import { CrmCustomerConstants } from './constants'
import { convertTimeStringToInt } from "../../../transportation/utilities"

export const CrmCustomerActions = {
  getCustomers,
  createCustomer,
  importCustomers,
  getCustomer,
  editCustomer,
  deleteCustomer,
  getCustomerPoint,
  editCustomerPoint,
  addPromotion,
  getCustomerPromotions,
  editPromotion,
  deletePromotion,
  usePromotion
}

function getCustomers(data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMERS_REQUEST })
    CrmCustomerServices.getCustomers(data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.GET_CRM_CUSTOMERS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMERS_FAILE })
      })
  }
}

function createCustomer(data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_REQUEST })
    CrmCustomerServices.createCustomer(data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_SUCCESS,
          payload: res.data.content
        });
        const resData = res.data.content;
        const dataToSync = {
          dxCode: resData._id,
          name: resData.name,
          startTime: convertTimeStringToInt(resData.startWorkingTime),
          endTime: convertTimeStringToInt(resData.endWorkingTime),
          penaltyCost: resData.latePenaltyCost,
          address: resData.address,
        }
        CrmCustomerServices.syncCreateCustomer(dataToSync)
          .then((res) => {
            console.log("Add to transport system success!");
          })
          .catch((error) => {
            console.log("Add to transport system failure", error);
          })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_FAILE })
      })
  }
}

function importCustomers(data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.IMPORT_CRM_CUSTOMER_REQUEST })
    CrmCustomerServices.importCustomers(data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.IMPORT_CRM_CUSTOMER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.IMPORT_CRM_CUSTOMER_FAILE })
      })
  }
}

function getCustomer(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_REQUEST })
    CrmCustomerServices.getCustomer(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.GET_CRM_CUSTOMER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_FAILE })
      })
  }
}

function editCustomer(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_REQUEST })
    CrmCustomerServices.editCustomer(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_FAILE })
      })
  }
}

function deleteCustomer(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_REQUEST })
    CrmCustomerServices.deleteCustomer(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_FAILE })
      })
  }
}

function getCustomerPoint(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_REQUEST })
    CrmCustomerServices.getCustomerPoint(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_POINT_FAILE })
      })
  }
}

function editCustomerPoint(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_REQUEST })
    CrmCustomerServices.editCustomerPoint(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_POINT_FAILE })
      })
  }
}
function addPromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_REQUEST })
    CrmCustomerServices.addPromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.ADD_CRM_CUSTOMER_PROMOTION_FAILE })
      })
  }
}

function getCustomerPromotions(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_REQUEST })
    CrmCustomerServices.getCustomerPromotions(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_PROMOTIONS_FAILE })
      })
  }
}

function editPromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_REQUEST })
    CrmCustomerServices.editPromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_PROMOTION_FAILE })
      })
  }
}
function usePromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_REQUEST })
    CrmCustomerServices.usePromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.USE_CRM_CUSTOMER_PROMOTION_FAILE })
      })
  }
}
function deletePromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_REQUEST })
    CrmCustomerServices.deletePromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_PROMOTION_FAILE })
      })
  }
}

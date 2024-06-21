import { PaymentConstants, TaxConstants } from './constants';
import { PaymentServices } from './services';

const createPayment = (data) => {
  return (dispatch) => {
    dispatch({ type: PaymentConstants.CREATE_PAYMENT_REQUEST });
    PaymentServices.createPayment(data)
      .then((res) => {
        dispatch({
          type: PaymentConstants.CREATE_PAYMENT_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: PaymentConstants.CREATE_PAYMENT_FAILURE,
          error
        });
      });
  };
};

const getAllPayments = (queryData) => {
  return (dispatch) => {
    dispatch({ type: PaymentConstants.GET_ALL_PAYMENTS_REQUEST });
    PaymentServices.getAllPayments(queryData)
      .then((res) => {
        dispatch({
          type: PaymentConstants.GET_ALL_PAYMENTS_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: PaymentConstants.GET_ALL_PAYMENTS_FAILURE,
          error
        });
      });
  };
};

const getPaymentDetail = (id) => {
  return (dispatch) => {
    dispatch({ type: PaymentConstants.GET_PAYMENT_DETAIL_REQUEST });
    PaymentServices.getPaymentDetail(id)
      .then((res) => {
        dispatch({
          type: PaymentConstants.GET_PAYMENT_DETAIL_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: PaymentConstants.GET_PAYMENT_DETAIL_FAILURE,
          error
        });
      });
  };
};

const getPaymentForOrder = ({ orderId, orderType }) => {
  return (dispatch) => {
    dispatch({ type: PaymentConstants.GET_PAYMENT_FOR_ORDER_REQUEST });
    PaymentServices.getPaymentForOrder({ orderId, orderType })
      .then((res) => {
        dispatch({
          type: PaymentConstants.GET_PAYMENT_FOR_ORDER_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: PaymentConstants.GET_PAYMENT_FOR_ORDER_FAILURE,
          error
        });
      });
  };
};

const createNewTax = (data) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.CREATE_TAX_REQUEST });
    PaymentServices.createNewTax(data)
      .then((res) => {
        dispatch({
          type: TaxConstants.CREATE_TAX_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.CREATE_TAX_FAILURE,
          error
        });
      });
  };
};

const getAllTaxs = (queryData) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.GET_ALL_TAXS_REQUEST });
    PaymentServices.getAllTaxs(queryData)
      .then((res) => {
        dispatch({
          type: TaxConstants.GET_ALL_TAXS_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.GET_ALL_TAXS_FAILURE,
          error
        });
      });
  };
};

const getTaxById = (id) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.GET_DETAIL_TAX_REQUEST });
    PaymentServices.getTaxById(id)
      .then((res) => {
        dispatch({
          type: TaxConstants.GET_DETAIL_TAX_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.GET_DETAIL_TAX_FAILURE,
          error
        });
      });
  };
};

const updateTax = (id, data) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.UPDATE_TAX_REQUEST });
    PaymentServices.updateTax(id, data)
      .then((res) => {
        dispatch({
          type: TaxConstants.UPDATE_TAX_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.UPDATE_TAX_FAILURE,
          error
        });
      });
  };
};

const disableTax = (id) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.DISABLE_TAX_REQUEST });
    PaymentServices.disableTax(id)
      .then((res) => {
        dispatch({
          type: TaxConstants.DISABLE_TAX_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.DISABLE_TAX_FAILURE,
          error
        });
      });
  };
};

const checkTaxCode = (code) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.CHECK_TAX_CODE_REQUEST });
    PaymentServices.checkTaxCode(code)
      .then((res) => {
        dispatch({
          type: TaxConstants.CHECK_TAX_CODE_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.CHECK_TAX_CODE_FAILURE,
          error
        });
      });
  };
};

const getTaxByCode = (code) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.GET_TAX_BY_CODE_REQUEST });
    PaymentServices.getTaxByCode(code)
      .then((res) => {
        dispatch({
          type: TaxConstants.GET_TAX_BY_CODE_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.GET_TAX_BY_CODE_FAILURE,
          error
        });
      });
  };
};

const deleteTax = (code) => {
  return (dispatch) => {
    dispatch({ type: TaxConstants.DELETE_TAX_BY_CODE_REQUEST });
    PaymentServices.deleteTax(code)
      .then((res) => {
        dispatch({
          type: TaxConstants.DELETE_TAX_BY_CODE_SUCCESS,
          payload: res.data.content
        });
      })
      .catch((error) => {
        dispatch({
          type: TaxConstants.DELETE_TAX_BY_CODE_FAILURE,
          error
        });
      });
  };
};

// Export all action creators at the end
export const PaymentActions = {
  createPayment,
  getAllPayments,
  getPaymentDetail,
  getPaymentForOrder,
  createNewTax,
  getAllTaxs,
  getTaxById,
  updateTax,
  disableTax,
  checkTaxCode,
  getTaxByCode,
  deleteTax
};

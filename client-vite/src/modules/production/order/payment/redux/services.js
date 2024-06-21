import { sendRequest } from '../../../../../helpers/requestHelper';

// Payment services
const createPayment = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.payment'
  );
};

const getAllPayments = (queryData) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.payment'
  );
};

const getPaymentDetail = (id) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.payment'
  );
};

const getPaymentForOrder = ({ orderId, orderType }) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment/get-for-order`,
      method: 'GET',
      params: { orderId, orderType }
    },
    false,
    true,
    'manage_order.payment'
  );
};

// Tax services
const createNewTax = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.tax'
  );
};

const getAllTaxs = (queryData) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.tax'
  );
};

const getTaxById = (id) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.tax'
  );
};

const updateTax = (id, data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.tax'
  );
};

const disableTax = (id) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/disable/${id}`,
      method: 'PATCH'
    },
    true,
    true,
    'manage_order.tax'
  );
};

const checkTaxCode = (code) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/check-code`,
      method: 'GET',
      params: { code }
    },
    false,
    true,
    'manage_order.tax'
  );
};

const getTaxByCode = (code) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/get-by-code`,
      method: 'GET',
      params: { code }
    },
    false,
    true,
    'manage_order.tax'
  );
};

const deleteTax = (code) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax`,
      method: 'DELETE',
      params: { code }
    },
    true,
    true,
    'manage_order.tax'
  );
};

// Export all services at the end
export const PaymentServices = {
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

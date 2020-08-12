import { orderConstants } from "./constants";
import { orderServices } from "./services";
import { dispatch } from "d3";

export const orderActions = {
  getAllOrders,
  createNewOrder,
  editOrder,
  deleteOrder,
};

function getAllOrders(queryData) {
  return (dispatch) => {
    dispatch({ type: orderConstants.CREATE_ORDER_REQUEST });

    orderServices
      .getAllOrders(queryData)
      .then((res) => {
        dispatch({
          type: orderConstants.GET_ALL_ORDER_SUCCESS,
          payload: res.data.content,
        });
      })
      .catch((error) => {
        dispatch({
          type: orderConstants.GET_ALL_ORDER_FAILURE,
          error,
        });
      });
  };
}

function createNewOrder(data) {
  return (dispatch) => {
    dispatch({ type: orderConstants.CREATE_ORDER_REQUEST });

    orderServices
      .createNewOrder(data)
      .then((res) => {
        console.log("res data:", res.data);
        dispatch(
          getAllOrders({
            code: "",
            quantity: null,
            amount: null,
            page: 0,
            limit: 5,
          })
        );
        dispatch({
          type: orderConstants.CREATE_ORDER_SUCCESS,
          payload: res.data.content,
        });
      })
      .catch((error) => {
        dispatch({
          type: orderConstants.CREATE_ORDER_FAILURE,
          error,
        });
      });
  };
}

function editOrder(id, dataEdit) {
  return (dispatch) => {
    dispatch({
      type: orderConstants.UPDATE_ORDER_REQUEST,
    });

    orderServices
      .editOrder(id, dataEdit)
      .then((res) => {
        dispatch(
          getAllOrders({
            code: "",
            quantity: null,
            amount: null,
            page: 0,
            limit: 5,
          })
        );

        dispatch({
          type: orderConstants.UPDATE_ORDER_SUCCESS,
          payload: res.data.content,
        });
      })
      .catch((error) => {
        dispatch({
          type: orderConstants.UPDATE_ORDER_FAILURE,
          error,
        });
      });
  };
}

function deleteOrder(id) {
  return (dispatch) => {
    dispatch({
      type: orderConstants.DELETE_ORDER_REQUEST,
    });
    orderServices
      .deleteOrder(id)
      .then((res) => {
        dispatch(
          getAllOrders({
            code: "",
            quantity: null,
            amount: null,
            page: 0,
            limit: 5,
          })
        );

        dispatch({
          type: orderConstants.DELETE_ORDER_SUCCESS,
          payload: res.data.content,
        });
      })
      .catch((error) => {
        dispatch({
          type: orderConstants.DELETE_ORDER_FAILURE,
          error,
        });
      });
  };
}

import { requestConstants } from './constants'
import { requestServices } from './services'

export const RequestActions = {
  getAllRequestByCondition,
  createRequest,
  getDetailRequest,
  editRequest,
  getNumberStatus,
  getAllStockWithBinLocation,
  updateRealTimeStatus,
  editTransportationRequest
}

function getAllRequestByCondition(query = {}) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_ALL_REQUEST_REQUEST
    })
    requestServices
      .getAllRequestByCondition(query)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_ALL_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_ALL_REQUEST_FAILURE,
          error
        })
      })
  }
}

function createRequest(data) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.CREATE_REQUEST_REQUEST
    })
    requestServices
      .createRequest(data)
      .then((res) => {
        dispatch({
          type: requestConstants.CREATE_REQUEST_SUCCESS,
          payload: res.data.content
        });
        const resData = res.data.content.request;
        let capacity = 0;
        let weight = 0;
        let orderValue = 0;
        let orderItems = resData.goods.map((good) => {
          capacity += good.good.volume * good.quantity;
          weight += good.good.weight * good.quantity;
          orderValue += (good.good.pricePerBaseUnit - good.good.salesPriceVariance ? good.good.salesPriceVariance : 0) * good.quantity;
          return {
            productDxCodeToSearch: good.good._id,
            quantity: good.quantity
          }
        })
        const dataToSync = {
          dxCode: resData._id,
          orderCustomerDxCode: resData.supplier._id,
          capacity: capacity,
          weight: weight,
          orderValue: orderValue,
          deliveryMode: "STANDARD",
          timeService: 300,
          timeLoading: 300,
          orderItems: orderItems
        }
        console.log("ra data roi", dataToSync);
        requestServices.syncCreateRequestTransport(dataToSync)
          .then((res) => {
            console.log("Add order to transport system ok!", res);
          })
          .catch((error) => {
            console.log("Add order to transport system failure", error);
          })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.CREATE_REQUEST_FAILURE,
          error
        })
      })
  }
}

function getDetailRequest(id) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_DETAIL_REQUEST_REQUEST
    })
    requestServices
      .getDetailRequest(id)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_DETAIL_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_DETAIL_REQUEST_FAILURE,
          error
        })
      })
  }
}

function editRequest(id, data) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.UPDATE_REQUEST_REQUEST
    })
    requestServices
      .editRequest(id, data)
      .then((res) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_FAILURE,
          error
        })
      })
  }
}

function editTransportationRequest(id, data) {
  return dispatch => {
    dispatch({
      type: requestConstants.UPDATE_REQUEST_REQUEST
    });
    requestServices.editTransportationRequest(id, data)
      .then((res) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_SUCCESS,
          payload: res.data.content
        });
      }).catch((error) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_FAILURE,
          error
        });
      });
  }
}

function getNumberStatus(query) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_NUMBER_REQUEST_REQUEST
    })
    requestServices
      .getNumberStatus(query)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_NUMBER_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_NUMBER_REQUEST_FAILURE,
          error
        })
      })
  }
}

function getAllStockWithBinLocation(query = {}) {
  return dispatch => {
    dispatch({
      type: requestConstants.GET_ALL_STOCK_WITH_BIN_LOCATION_REQUEST
    });
    requestServices.getAllStockWithBinLocation(query)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_ALL_STOCK_WITH_BIN_LOCATION_SUCCESS,
          payload: res.data.content
        });
      }).catch((error) => {
        dispatch({
          type: requestConstants.GET_ALL_STOCK_WITH_BIN_LOCATION_FAILURE,
          error
        });
      });
  }
}

function updateRealTimeStatus(data) {
  return dispatch => {
    dispatch({
      type: requestConstants.UPDATE_REALTIME_STATUS,
      payload: data
    });
  }
}

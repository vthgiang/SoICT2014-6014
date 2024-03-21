import { SLAConstants } from './constants'
import { SLAServices } from './services'

export const SlaActions = {
  createNewSLA,
  getAllSLAs,
  getSLAById,
  updateSLA,
  disableSLA,
  checkSLACode,
  getSLAByCode,
  deleteSLA
}

function createNewSLA(data) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.CREATE_SLA_REQUEST
    })

    SLAServices.createNewSLA(data)
      .then((res) => {
        dispatch({
          type: SLAConstants.CREATE_SLA_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.CREATE_SLA_FAILURE,
          error
        })
      })
  }
}

function getAllSLAs(queryData) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.GET_ALL_SLAS_REQUEST
    })

    SLAServices.getAllSLAs(queryData)
      .then((res) => {
        dispatch({
          type: SLAConstants.GET_ALL_SLAS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.GET_ALL_SLAS_FAILURE,
          error
        })
      })
  }
}

function getSLAById(id) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.GET_DETAIL_SLA_REQUEST
    })

    SLAServices.getSLAById(id)
      .then((res) => {
        dispatch({
          type: SLAConstants.GET_DETAIL_SLA_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.GET_DETAIL_SLA_FAILURE,
          error
        })
      })
  }
}

function updateSLA(id, data) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.UPDATE_SLA_REQUEST
    })

    SLAServices.updateSLA(id, data)
      .then((res) => {
        dispatch({
          type: SLAConstants.UPDATE_SLA_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.UPDATE_SLA_FAILURE,
          error
        })
      })
  }
}

function disableSLA(id) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.DISABLE_SLA_REQUEST
    })

    SLAServices.disableSLA(id)
      .then((res) => {
        dispatch({
          type: SLAConstants.DISABLE_SLA_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.DISABLE_SLA_FAILURE,
          error
        })
      })
  }
}

function checkSLACode(code) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.CHECK_SLA_CODE_REQUEST
    })

    SLAServices.checkSLACode(code)
      .then((res) => {
        dispatch({
          type: SLAConstants.CHECK_SLA_CODE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.CHECK_SLA_CODE_FAILURE,
          error
        })
      })
  }
}

function getSLAByCode(code) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.GET_SLA_BY_CODE_REQUEST
    })

    SLAServices.getSLAByCode(code)
      .then((res) => {
        dispatch({
          type: SLAConstants.GET_SLA_BY_CODE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.GET_SLA_BY_CODE_FAILURE,
          error
        })
      })
  }
}

function deleteSLA(code) {
  return (dispatch) => {
    dispatch({
      type: SLAConstants.DELETE_SLA_BY_CODE_REQUEST
    })

    SLAServices.deleteSLA(code)
      .then((res) => {
        dispatch({
          type: SLAConstants.DELETE_SLA_BY_CODE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SLAConstants.DELETE_SLA_BY_CODE_FAILURE,
          error
        })
      })
  }
}

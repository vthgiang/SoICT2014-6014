import { exampleConstants } from './constants'
import { exampleServices } from './services'

export const exampleActions = {
  getExamples,
  deleteExamples,
  createExample,
  editExample
}

function getExamples(queryData) {
  return (dispatch) => {
    dispatch({
      type: exampleConstants.GET_ALL_EXAMPLES_REQUEST
    })

    exampleServices
      .getExamples(queryData)
      .then((res) => {
        dispatch({
          type: exampleConstants.GET_ALL_EXAMPLES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: exampleConstants.GET_ALL_EXAMPLES_FAILURE,
          error
        })
      })
  }
}

function deleteExamples(data) {
  return (dispatch) => {
    dispatch({
      type: exampleConstants.DELETE_EXAMPLE_REQUEST
    })

    exampleServices
      .deleteExamples(data)
      .then((res) => {
        dispatch({
          type: exampleConstants.DELETE_EXAMPLE_SUCCESS,
          payload: res.data.content,
          exampleIds: data.exampleIds
        })
      })
      .catch((error) => {
        dispatch({
          type: exampleConstants.DELETE_EXAMPLE_FAILURE,
          error
        })
      })
  }
}

function createExample(data) {
  return (dispatch) => {
    dispatch({
      type: exampleConstants.CREATE_EXAMPLE_REQUEST
    })
    exampleServices
      .createExample(data)
      .then((res) => {
        dispatch({
          type: exampleConstants.CREATE_EXAMPLE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: exampleConstants.CREATE_EXAMPLE_FAILURE,
          error
        })
      })
  }
}

function editExample(id, data) {
  return (dispatch) => {
    dispatch({
      type: exampleConstants.EDIT_EXAMPLE_REQUEST
    })
    exampleServices
      .editExample(id, data)
      .then((res) => {
        dispatch({
          type: exampleConstants.EDIT_EXAMPLE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: exampleConstants.EDIT_EXAMPLE_FAILURE,
          error
        })
      })
  }
}

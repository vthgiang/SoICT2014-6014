import { homeConstants } from './constants'
import { homeServices } from './services'

export const homeActions = {
  getNewsfeed,
  receiveNewsFeed,

  createComment,
  editComment,
  deleteComment,
  deleteFileComment
}

/** Lấy tập KPI cá nhân hiện tại */
function getNewsfeed(data) {
  return (dispatch) => {
    dispatch({ type: homeConstants.GET_NEWSFEED_REQUEST })

    homeServices
      .getNewsfeed(data)
      .then((res) => {
        dispatch({
          type: homeConstants.GET_NEWSFEED_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: homeConstants.GET_NEWSFEED_FAILURE,
          payload: error
        })
      })
  }
}

/** Lấy dữ liệu realtime */
function receiveNewsFeed(data) {
  return (dispatch) =>
    dispatch({
      type: homeConstants.RECEIVE_NEWSFEED_SUCCESS,
      payload: data
    })
}

function createComment(newsFeedId, data) {
  return (dispatch) => {
    dispatch({ type: homeConstants.CREATE_COMMENT_REQUEST })

    homeServices
      .createComment(newsFeedId, data)
      .then((res) => {
        dispatch({
          type: homeConstants.CREATE_COMMENT_SUCCESS,
          newsFeedId: newsFeedId,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: homeConstants.CREATE_COMMENT_FAILURE,
          payload: error
        })
      })
  }
}

function editComment(newsFeedId, commentId, data) {
  return (dispatch) => {
    dispatch({ type: homeConstants.EDIT_COMMENT_REQUEST })

    homeServices
      .editComment(newsFeedId, commentId, data)
      .then((res) => {
        dispatch({
          type: homeConstants.EDIT_COMMENT_SUCCESS,
          newsFeedId: newsFeedId,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: homeConstants.EDIT_COMMENT_FAILURE,
          payload: error
        })
      })
  }
}
function deleteComment(newsFeedId, commentId) {
  return (dispatch) => {
    dispatch({ type: homeConstants.DELETE_COMMENT_REQUEST })

    homeServices
      .deleteComment(newsFeedId, commentId)
      .then((res) => {
        dispatch({
          type: homeConstants.DELETE_COMMENT_SUCCESS,
          newsFeedId: newsFeedId,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: homeConstants.DELETE_COMMENT_FAILURE,
          payload: error
        })
      })
  }
}

function deleteFileComment(fileId, commentId, newsFeedId) {
  return (dispatch) => {
    dispatch({ type: homeConstants.DELETE_FILE_COMMENT_REQUEST })

    homeServices
      .deleteFileComment(fileId, commentId, newsFeedId)
      .then((res) => {
        dispatch({
          type: homeConstants.DELETE_FILE_COMMENT_SUCCESS,
          newsFeedId: newsFeedId,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: homeConstants.DELETE_FILE_COMMENT_FAILURE,
          payload: error
        })
      })
  }
}

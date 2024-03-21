import { sendRequest } from '../../../helpers/requestHelper'

export const homeServices = {
  getNewsfeed,

  createComment,
  editComment,
  deleteComment,
  deleteFileComment
}

/** Lấy tập KPI cá nhân hiện tại */
function getNewsfeed(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds`,
      method: 'GET',
      params: {
        currentNewsfeed: data?.currentNewsfeed
      }
    },
    false,
    true
  )
}

/**
 * Tạo comment cho kpi set
 */
function createComment(newsFeedId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds/${newsFeedId}/comments`,
      method: 'POST',
      data: data
    },
    false,
    true
  )
}

/**
 * Edit comment cho kpi set
 */
function editComment(newsFeedId, commentId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds/${newsFeedId}/comments/${commentId}`,
      method: 'PATCH',
      data: data
    },
    false,
    true
  )
}
/**
 * Delete comment
 */
function deleteComment(newsFeedId, commentId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds/${newsFeedId}/comments/${commentId}`,
      method: 'DELETE'
    },
    false,
    true
  )
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId, commentId, newsFeedId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/news-feed/news-feeds/${newsFeedId}/comments/${commentId}/files/${fileId}`,
      method: 'DELETE'
    },
    false,
    true
  )
}

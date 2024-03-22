import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'
import dayjs from 'dayjs'
import 'dayjs/locale/en-nz'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'

import { ToolTip, SlimScroll, Comment } from '../../../common-components'
import { getStorage } from '../../../config'

import { homeActions } from '../redux/actions'
import { AuthActions } from '../../auth/redux/actions'

import './newsFeed.css'

function NewsFeed(props) {
  const { translate, newsFeeds } = props
  const [lang, setLang] = useState(getStorage('lang'))
  const [time, setTime] = useState(new Date())
  const [state, setState] = useState({
    loadMore: false,
    showDescription: {},
    showComments: {}
  })
  const { loadMore, showDescription, showComments } = state

  const activeSlimScroll = () => {
    window.$('#newsfeed-body').ready(function () {
      SlimScroll.removeVerticalScrollStyleCSS('newsfeed-body')
      SlimScroll.addVerticalScrollStyleCSS('newsfeed-body', 800, true)
    })
  }

  useEffect(() => {
    dayjs.extend(relativeTime)
    dayjs.locale(lang === 'en' ? 'en-nz' : 'vi')

    const list = document.getElementById('newsfeed-body')

    // list has fixed height
    list.addEventListener('scroll', (e) => {
      const el = e.target
      if (el.scrollTop + el.clientHeight === el.scrollHeight) {
        setState({
          ...state,
          loadMore: true
        })
      }
    })

    props.socket.io.on('news feed', (data) => {
      props.receiveNewsFeed(data)
    })

    const timer = setInterval(() => setTime(new Date()), 120000)

    return () => {
      props.socket.io.off('news feed')
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    activeSlimScroll()
  })

  useEffect(() => {
    props.getNewsfeed({
      currentNewsfeed: newsFeeds?.newsFeed ? newsFeeds.newsFeed.map((item) => item?._id) : []
    })
    setState({
      ...state,
      loadMore: false
    })
  }, [loadMore])

  const handleShowDetail = (id) => {
    const showDescriptionTemp = showDescription
    showDescriptionTemp[id] = !showDescription[id]

    setState({
      ...state,
      showDescription: showDescriptionTemp
    })
  }

  const handleShowComments = (id) => {
    const showCommentsTemp = showComments
    showCommentsTemp[id] = !showComments[id]

    setState({
      ...state,
      showComments: showCommentsTemp
    })
  }

  return (
    <div className='box' id='newsfeed'>
      <div className='box-header with-border'>
        <div className='box-title'>{translate('news_feed.news_feed')}</div>
      </div>
      <div id='newsfeed-body' className='newsfeed-body'>
        {newsFeeds?.newsFeed?.length > 0 &&
          newsFeeds?.newsFeed?.map((newsfeed, index) => (
            <div className='description-box newsfeed-box' key={newsfeed?._id + index}>
              <img
                className='user-img-level1'
                src={process.env.REACT_APP_SERVER + newsfeed?.content?.[0]?.creator?.avatar}
                alt='User Image'
              />
              <div className='newsfeed-content-level1'>
                <a style={{ cursor: 'pointer' }}>{newsfeed?.content?.[0]?.creator?.name} </a>
                <div style={{ fontSize: '13px' }}>{dayjs(newsfeed?.updatedAt).fromNow()}</div>
              </div>

              {/* Nội dung */}
              <div>
                <div>
                  <strong>{newsfeed?.content?.[0]?.title && parse(newsfeed?.content?.[0]?.title)}</strong>
                </div>
                {newsfeed?.associatedDataObject?.dataType === 1 && (
                  <div>
                    <strong>{translate('task.task_management.detail_link')}:</strong>{' '}
                    <a href={`/task?taskId=${newsfeed?.associatedDataObject?.value?._id}`} target='_blank'>
                      {newsfeed?.associatedDataObject?.value?.name}
                    </a>
                  </div>
                )}
                {showDescription[newsfeed?._id] && (
                  <ToolTip
                    dataTooltip={[newsfeed?.content?.[0]?.description && parse(newsfeed?.content?.[0]?.description)]}
                    type='latest_history'
                    title={false}
                  />
                )}
              </div>

              {/* Hành động */}
              <ul className='list-inline tool-level1'>
                <li>
                  <a style={{ cursor: 'pointer' }} className='link-black text-sm' onClick={() => handleShowComments(newsfeed?._id)}>
                    <i className='fa fa-comments-o margin-r-5' />{' '}
                    {!showComments[newsfeed?._id] ? translate('task.task_perform.comment') : 'Ẩn bình luận'}
                  </a>
                </li>
                <li>
                  <a style={{ cursor: 'pointer' }} className='link-black text-sm' onClick={() => handleShowDetail(newsfeed?._id)}>
                    {showDescription[newsfeed?._id] ? 'Ẩn chi tiết' : 'Chi tiết'}
                  </a>
                </li>
              </ul>

              {showComments[newsfeed?._id] && (
                <div className='row newsfeed-comments'>
                  <div className='col-xs-12'>
                    <Comment
                      commentId={newsfeed?._id}
                      data={newsfeed}
                      comments={newsfeed.comments}
                      childrenComments={false}
                      createComment={(dataId, data) => props.createComment(dataId, data)}
                      editComment={(dataId, commentId, data) => props.editComment(dataId, commentId, data)}
                      deleteComment={(dataId, commentId) => props.deleteComment(dataId, commentId)}
                      deleteFileComment={(fileId, commentId, dataId) => props.deleteFileComment(fileId, commentId, dataId)}
                      downloadFile={(path, fileName) => props.downloadFile(path, fileName)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        {newsFeeds?.newsfeedLoading && <div style={{ margin: '10px 10%' }}>Đang tải dữ liệu ...</div>}
      </div>
    </div>
  )
}

function mapState(state) {
  const { newsFeeds, socket } = state
  return { newsFeeds, socket }
}
const actions = {
  getNewsfeed: homeActions.getNewsfeed,
  receiveNewsFeed: homeActions.receiveNewsFeed,

  createComment: homeActions.createComment,
  editComment: homeActions.editComment,
  deleteComment: homeActions.deleteComment,
  deleteFileComment: homeActions.deleteFileComment,

  downloadFile: AuthActions.downloadFile
}

const connectedNewsFeed = connect(mapState, actions)(withTranslate(NewsFeed))
export { connectedNewsFeed as NewsFeed }

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'

import { ApiImage, Comment } from '../../../../common-components'

import { AuthActions } from '../../../auth/redux/actions'
import { performTaskAction } from '../redux/actions'
import { TaskOutputDetail } from './modalDetailOutput'

function IncomingDataTab(props) {
  const { translate, performtasks } = props
  const [state, setState] = useState({
    showComment: ''
  })
  const [taskOutput, setTaskOutput] = useState()
  const { showComment } = state

  useEffect(() => {
    props.getAllPreceedingTasks(props.taskId)
  }, [])

  const handleShowComment = async (taskId) => {
    if (state.showComment === taskId) {
      setState({ showComment: '' })
    } else {
      setState({ showComment: taskId })
    }
  }
  const isImage = (src) => {
    let string = src.toLowerCase().split('.')
    let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
      return true
    } else {
      return false
    }
  }
  const requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    props.downloadFile(path, fileName)
  }

  const showDetailTaskOutput = (item) => {
    window.$(`#modal-detail-task-output-${item._id}`).modal('show')
  }

  let listTask = []
  if (performtasks?.preceedingTasks) {
    performtasks.preceedingTasks.forEach((item) => {
      if (item.task) listTask.push(item.task)
    })
  }
  return (
    <React.Fragment>
      <TaskOutputDetail taskOutput={taskOutput} />
      {listTask &&
        listTask.length > 0 &&
        listTask.map((task, index) => (
          <React.Fragment>
            <div key={task._id + index} className='description-box incoming-content'>
              <h4>{task.name}</h4>
              {/** Danh sách thông tin */}
              <strong>{translate('task.task_process.information')}:</strong>
              {task.taskInformations && task.taskInformations.length !== 0 ? (
                task.taskInformations.map(
                  (info, index) =>
                    info.isOutput && (
                      <ul key={info._id + index}>
                        <li>
                          <strong>{info.name}:</strong>
                          <span>{info.value}</span>
                        </li>
                      </ul>
                    )
                )
              ) : (
                <span>{translate('task.task_process.not_have_info')}</span>
              )}

              {/** Danh sách tài liệu */}
              <div></div>
              <strong>{translate('task.task_process.document')}:</strong>
              {task.documents && task.documents.length !== 0 ? (
                task.documents.map(
                  (document, index) =>
                    document.isOutput && (
                      <ul key={document._id}>
                        <li>
                          <strong>
                            {parse(document.description)} ({document.files.length} tài liệu)
                          </strong>
                        </li>
                        {document.files &&
                          document.files.length !== 0 &&
                          document.files.map((file, index) => (
                            <div key={file._id}>
                              {isImage(file.name) ? (
                                <ApiImage
                                  className='attachment-img files-attach'
                                  style={{ marginTop: '5px' }}
                                  src={file.url}
                                  file={file}
                                  requestDownloadFile={requestDownloadFile}
                                />
                              ) : (
                                <a
                                  style={{ cursor: 'pointer' }}
                                  style={{ marginTop: '2px' }}
                                  onClick={(e) => requestDownloadFile(e, file.url, file.name)}
                                >
                                  {' '}
                                  {file.name}{' '}
                                </a>
                              )}
                            </div>
                          ))}
                      </ul>
                    )
                )
              ) : (
                <span>{translate('task.task_process.not_have_doc')}</span>
              )}
              <div>
                <strong>Kết quả giao nộp:</strong>
              </div>
              {task?.taskOutputs && task.taskOutputs.length !== 0 ? (
                task.taskOutputs.map((taskOutput, index) => {
                  if (taskOutput.isOutput) {
                    return (
                      <ul key={taskOutput._id}>
                        <li>
                          {taskOutput.title}{' '}
                          <a
                            style={{ cursor: 'pointer', marginLeft: '5px' }}
                            onClick={async () => {
                              await setTaskOutput(taskOutput)
                              showDetailTaskOutput(taskOutput)
                            }}
                          >
                            (Xem chi tiết)
                          </a>
                        </li>
                      </ul>
                    )
                  }
                  return <div></div>
                })
              ) : (
                <span></span>
              )}

              {/* Comment */}
              <div style={{ marginTop: 10 }}>
                <a style={{ cursor: 'pointer' }} onClick={() => handleShowComment(task?._id)}>
                  <b>Trao đổi </b>
                  {showComment === '' ? <i className='fa fa-angle-double-down'></i> : <i className='fa fa-angle-double-up'></i>}
                </a>
              </div>
              {showComment === task._id && (
                <div className='comment-process' style={{ marginTop: 10 }}>
                  <Comment
                    data={task}
                    comments={task.commentsInProcess}
                    currentTask={performtasks?.task?._id}
                    type='incoming'
                    createComment={(dataId, data, type) => props.createComment(dataId, data, type)}
                    editComment={(dataId, commentId, data, type) => props.editComment(dataId, commentId, data, type)}
                    deleteComment={(dataId, commentId, type) => props.deleteComment(dataId, commentId, type)}
                    createChildComment={(dataId, commentId, data, type) => props.createChildComment(dataId, commentId, data, type)}
                    editChildComment={(dataId, commentId, childCommentId, data, type) =>
                      props.editChildComment(dataId, commentId, childCommentId, data, type)
                    }
                    deleteChildComment={(dataId, commentId, childCommentId, type) =>
                      props.deleteChildComment(dataId, commentId, childCommentId, type)
                    }
                    deleteFileComment={(fileId, commentId, dataId, type) => props.deleteFileComment(fileId, commentId, dataId, type)}
                    deleteFileChildComment={(fileId, commentId, childCommentId, dataId, type) =>
                      props.deleteFileChildComment(fileId, commentId, childCommentId, dataId, type)
                    }
                    downloadFile={(path, fileName) => props.downloadFile(path, fileName)}
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
    </React.Fragment>
  )
}

function mapState(state) {
  const { performtasks, translate } = state
  return { performtasks, translate }
}
const actions = {
  downloadFile: AuthActions.downloadFile,
  createComment: performTaskAction.createComment,
  editComment: performTaskAction.editComment,
  deleteComment: performTaskAction.deleteComment,
  createChildComment: performTaskAction.createChildComment,
  editChildComment: performTaskAction.editChildComment,
  deleteChildComment: performTaskAction.deleteChildComment,
  deleteFileComment: performTaskAction.deleteFileComment,
  deleteFileChildComment: performTaskAction.deleteFileChildComment,
  getAllPreceedingTasks: performTaskAction.getAllPreceedingTasks,
}

const connectIncomingDataTab = connect(mapState, actions)(withTranslate(IncomingDataTab))
export { connectIncomingDataTab as IncomingDataTab }

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'
import { ApiImage, DateTimeConverter, DialogModal } from '../../../../common-components'
import { getStorage } from '../../../../config'

const isImage = (src) => {
  const string = src.toLowerCase().split('.')
  const image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
  if (image.indexOf(string[string.length - 1]) !== -1) {
    return true
  }
  return false
}

const formatTypeInfo = (value) => {
  switch (value) {
    case 0:
      return 'Văn bản'
    case 1:
      return 'Tập tin'
    default:
      return ''
  }
}

const formatActionAccountable = (value) => {
  switch (value) {
    case 'approve':
      return 'Đồng ý'
    case 'reject':
      return 'Từ chối'
    default:
      return 'Chưa phê duyệt'
  }
}

const checkTypeFile = (data) => {
  if (typeof data === 'string' || data instanceof String) {
    const index = data.lastIndexOf('.')
    const typeFile = data.substring(index + 1, data.length)
    if (typeFile === 'pdf') {
      return true
    }
    return false
  }
  return false
}

const reverseArr = (arr) => {
  return [].concat(arr).reverse()
}

function TaskOutputDetail(props) {
  const { taskOutput } = props
  const idUser = getStorage('userId')
  const [state, setState] = useState({
    currentFilepri: null,
    version: null,
    versionIdx: null,
    comment: [],
    showFile: []
  })

  useEffect(() => {
    if (taskOutput) {
      setState({
        ...state,
        version: {
          ...taskOutput.submissionResults,
          accountableEmployees: taskOutput.accountableEmployees
        },
        content: taskOutput.submissionResults._id,
        comments: taskOutput.comments
      })
    }
  }, [taskOutput?._id])

  const handleShowFile = (id) => {
    let a
    const { showFile } = state
    if (showFile.some((obj) => obj === id)) {
      a = showFile.filter((x) => x !== id)
      setState({
        ...state,
        showFile: a
      })
    } else {
      setState({
        ...state,
        showFile: [...state.showFile, id]
      })
    }
  }
  const showFilePreview = (data) => {
    setState({
      ...state,
      currentFilepri: data
    })
    window.$('#modal-file-preview').modal('show')
  }

  const handleChangeContentVersion = async (item, index) => {
    await setState({
      ...state,
      version: item,
      content: item._id,
      versionIdx: index + 1,
      comments: taskOutput.comments.filter((comment) => comment.version == index + 1)
    })
  }

  const handleTaskOutput = async (item) => {
    await setState({
      ...state,
      version: {
        ...item?.submissionResults,
        accountableEmployees: item.accountableEmployees
      },
      content: item?.submissionResults._id,
      comments: taskOutput.comments,
      versionIdx: null
    })
  }

  const requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    props.downloadFile(path, fileName)
  }

  const { version, versionIdx, comments, showFile, content } = state

  return (
    <DialogModal
      modalID={`modal-detail-task-output-${taskOutput?._id}`}
      title={`Chi tiết ${taskOutput?.title}`}
      formID={`modal-detail-task-outputt-${taskOutput?._id}`}
      size={75}
      maxWidth={600}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='col-xs-12 col-sm-4'>
        <div className='box box-solid' style={{ border: '1px solid #ecf0f6', borderBottom: 'none' }}>
          <div id={taskOutput?._id} className='box-body no-padding'>
            <ul className='nav nav-pills nav-stacked'>
              <li className={state.content === taskOutput?.submissionResults._id ? 'active' : undefined}>
                <a href='#abc' onClick={() => handleTaskOutput(taskOutput)}>
                  Thông tin chi tiết (
                  <DateTimeConverter dateTime={taskOutput?.updatedAt} />)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='box box-solid' style={{ border: '1px solid #ecf0f6', borderBottom: 'none' }}>
          <div className='box-header with-border'>
            <h3 className='box-title' style={{ fontWeight: 800 }}>
              Các phiên bản thay đổi
            </h3>
          </div>
          <div id={taskOutput?._id} className='box-body no-padding'>
            <ul className='nav nav-pills nav-stacked'>
              {taskOutput?.versions?.map((item, index) => (
                <li key={index} className={state.content === item._id ? 'active' : undefined}>
                  <a href='#abc' onClick={() => handleChangeContentVersion(item, index)}>
                    Lần {index + 1} (
                    <DateTimeConverter dateTime={item.createdAt} />)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {version && (
        <div className='col-xs-12 col-sm-8'>
          {versionIdx && <h4>Kết quả giao nộp lần {versionIdx}</h4>}
          {content === taskOutput?.submissionResults._id && (
            <div>
              <div>
                <strong style={{ fontWeight: 600 }}>Yêu cầu:</strong>
                <div>
                  {taskOutput?.description?.split('\n')?.map((elem, idx) => (
                    <div key={idx}>{parse(elem)}</div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '6px 0px 6px 0px' }}>
                <strong style={{ fontWeight: 600 }}>Kiểu dữ liệu: </strong>
                {formatTypeInfo(taskOutput?.type)}
              </div>
            </div>
          )}
          {version.description ? (
            <div style={{ padding: '6px 0px 6px 0px' }}>
              <strong style={{ fontWeight: 600 }}>Kết quả giao nộp</strong>
              <div>
                {version.description?.split('\n')?.map((elem, idx) => (
                  <div key={idx}>{parse(elem)}</div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '6px 0px 6px 0px' }}>
              <strong>Chưa giao nộp kết quả</strong>
            </div>
          )}

          {version.files.length > 0 && (
            <div style={{ cursor: 'pointer' }}>
              <div>
                <strong style={{ fontWeight: 600 }}>Tập tin đính kèm:</strong>
              </div>
              <ul>
                {version.files.map((elem, index) => {
                  const listImage = version.files?.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                  return (
                    <li key={index}>
                      {isImage(elem.name) ? (
                        <ApiImage
                          listImage={listImage}
                          className='attachment-img files-attach'
                          style={{ marginTop: '5px' }}
                          src={elem.url}
                          file={elem}
                          requestDownloadFile={requestDownloadFile}
                        />
                      ) : (
                        <div>
                          <a style={{ marginTop: '2px' }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}>
                            {' '}
                            {elem.name}
                          </a>
                          &nbsp;&nbsp;&nbsp;
                          <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                            <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye fa-1' /> : ''}</u>
                          </a>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {version.accountableEmployees.map((item, idx) => {
            return (
              <div key={idx}>
                <b> {item.accountableEmployee?.name} </b>
                <span style={{ fontSize: 10, marginRight: 10 }} className='text-green'>
                  [ Người phê duyệt ]
                </span>
                {formatActionAccountable(item.action)}
                &ensp;
                {item.action === 'approve' || (item.action === 'reject' && <DateTimeConverter dateTime={item.updatedAt} />)}
              </div>
            )
          })}
          {comments?.length > 0 && (
            <div>
              <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                <strong style={{ fontWeight: 600 }}>Trao đổi:</strong>
              </div>
              {reverseArr(comments).map((child) => {
                const listImage = child.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                return (
                  <div key={child._id}>
                    <img className='user-img-level1' src={process.env.REACT_APP_SERVER + child.creator?.avatar} alt='User Image' />

                    <div>
                      <div className='content-level1'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <a style={{ cursor: 'pointer', fontWeight: 'bold' }}>{child.creator?.name} </a>
                        </div>

                        {child.description.split('\n').map((taskOutput, idx) => {
                          return <span key={idx}>{parse(taskOutput)}</span>
                        })}
                      </div>
                      <ul className='list-inline tool-level1'>
                        <li>
                          <span className='text-sm'>
                            <DateTimeConverter dateTime={child.createdAt} />
                          </span>
                        </li>
                        {child.files.length > 0 && (
                          <>
                            <li style={{ display: 'inline-table' }}>
                              <div>
                                <a style={{ cursor: 'pointer' }} className='link-black text-sm' onClick={() => handleShowFile(child._id)}>
                                  <b>
                                    <i className='fa fa-paperclip' aria-hidden='true'>
                                      {' '}
                                      Tập tin đính kèm ({child.files && child.files.length})
                                    </i>
                                  </b>
                                </a>
                              </div>
                            </li>
                            {showFile.some((obj) => obj === child._id) && (
                              <li style={{ display: 'inline-table' }}>
                                {child.files.map((elem, index) => {
                                  return (
                                    <div key={index} className='show-files-task'>
                                      {isImage(elem.name) ? (
                                        <ApiImage
                                          listImage={listImage}
                                          className='attachment-img files-attach'
                                          style={{ marginTop: '5px' }}
                                          src={elem.url}
                                          file={elem}
                                          requestDownloadFile={requestDownloadFile}
                                        />
                                      ) : (
                                        <div style={{ marginTop: '2px' }}>
                                          <a style={{ cursor: 'pointer' }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}>
                                            {' '}
                                            {elem.name}
                                          </a>
                                          <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                            <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye' /> : ''}</u>
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </DialogModal>
  )
}

function mapState(state) {
  const { performtasks, tasks, auth } = state
  return { performtasks, tasks, auth }
}

const actionCreators = {}

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputDetail))

export { connectedTaskOutputs as TaskOutputDetail }

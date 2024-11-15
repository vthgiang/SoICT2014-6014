import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import moment from 'moment'
import Swal from 'sweetalert2'
import { ContentMaker, DialogModal, ApiImage } from '../../../../common-components'

import { getStorage } from '../../../../config'

import { AuthActions } from '../../../auth/redux/actions'
import { performTaskAction } from '../redux/actions'
import './commentInProcess.css'

class CommentInProcess extends Component {
  constructor(props) {
    const idUser = getStorage('userId')
    super(props)
    this.state = {
      editComment: '',
      currentUser: idUser,
      showChildComment: '',
      editChildComment: '',
      showfile: [],
      deleteFile: '',
      showModalDelete: '',
      comment: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newComment: {
        description: '',
        descriptionDefault: ''
      },
      childComment: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newCommentEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newChildCommentEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      }
    }
    this.newComment = []
    this.newChildComment = []
  }

  handleEditTaskComment = (id) => {
    this.setState((state) => {
      return {
        ...state,
        editTaskComment: id
      }
    })
  }

  handleShowChildComment = async (id) => {
    const { showChildComment } = this.state
    if (showChildComment === id) {
      await this.setState((state) => {
        return {
          ...state,
          showChildComment: ''
        }
      })
    } else {
      await this.setState((state) => {
        return {
          ...state,
          showChildComment: id
        }
      })
    }
  }

  handleShowFile = (id) => {
    let a
    if (this.state.showfile.some((obj) => obj === id)) {
      a = this.state.showfile.filter((x) => x !== id)
      this.setState((state) => {
        return {
          ...state,
          showfile: a
        }
      })
    } else {
      this.setState((state) => {
        return {
          ...state,
          showfile: [...this.state.showfile, id]
        }
      })
    }
  }

  handleEditComment = async (comment) => {
    await this.setState((state) => {
      return {
        ...state,
        editComment: comment._id,
        newCommentEdited: {
          ...state.newCommentEdited,
          descriptionDefault: comment.description
        }
      }
    })
  }

  handleEditChildComment = async (childComment) => {
    await this.setState((state) => {
      return {
        ...state,
        editChildComment: childComment._id,
        newChildCommentEdited: {
          ...state.newChildCommentEdited,
          descriptionDefault: childComment.description
        }
      }
    })
  }

  onFilesChange = (files) => {
    this.setState((state) => {
      return {
        ...state,
        comment: {
          ...state.comment,
          files
        }
      }
    })
  }

  onCommentFilesChange = (files) => {
    this.setState((state) => {
      return {
        ...state,
        childComment: {
          ...state.childComment,
          files
        }
      }
    })
  }

  onFilesError = (error, file) => {}

  editComment = async (e, description, commentId, taskId) => {
    e.preventDefault()
    const { performtasks } = this.props
    const { newCommentEdited } = this.state
    const data = new FormData()
    newCommentEdited.files.forEach((x) => {
      data.append('files', x)
    })
    data.append('currentTask', performtasks?.task?._id)
    data.append('creator', newCommentEdited.creator)
    data.append('type', 'edit')
    if (newCommentEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newCommentEdited.description)
    }
    if (newCommentEdited.description) {
      this.props.editComment(taskId, commentId, data)
    }
    if (newCommentEdited.description || newCommentEdited.files) {
      this.props.editComment(taskId, commentId, data)
    }
    await this.setState((state) => {
      return {
        ...state,
        editComment: '',
        newCommentEdited: {
          ...state.newCommentEdited,
          files: [],
          description: '',
          descriptionDefault: null
        }
      }
    })
  }

  editChildComment = async (e, description, childCommentId, commentId, taskId) => {
    e.preventDefault()
    const { performtasks } = this.props
    const { newChildCommentEdited } = this.state
    const data = new FormData()
    data.append('currentTask', performtasks?.task?._id)
    newChildCommentEdited.files.forEach((x) => {
      data.append('files', x)
    })
    if (newChildCommentEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newChildCommentEdited.description)
    }
    data.append('creator', newChildCommentEdited.creator)
    if (newChildCommentEdited.description || newChildCommentEdited.files) {
      this.props.editChildComment(taskId, commentId, childCommentId, data)
    }
    await this.setState((state) => {
      return {
        ...state,
        newChildCommentEdited: {
          ...state.newChildCommentEdited,
          description: '',
          files: [],
          descriptionDefault: null
        },
        editChildComment: ''
      }
    })
  }

  submitComment = async (taskId) => {
    const { comment } = this.state
    const { performtasks } = this.props
    console.log(performtasks?.task?._id)
    const data = new FormData()
    data.append('currentTask', performtasks?.task?._id)
    data.append('creator', comment.creator)
    data.append('description', comment.description)
    comment.files &&
      comment.files.forEach((x) => {
        data.append('files', x)
      })
    if (comment.creator && comment.description) {
      this.props.createComment(taskId, data)
    }
    // Reset state cho việc thêm mới action
    await this.setState((state) => {
      return {
        ...state,
        comment: {
          ...state.comment,
          description: '',
          files: [],
          descriptionDefault: ''
        }
      }
    })
  }

  submitChildComment = async (taskId, commentId) => {
    const { childComment } = this.state
    const { performtasks } = this.props
    const data = new FormData()
    data.append('currentTask', performtasks?.task?._id)
    data.append('creator', childComment.creator)
    data.append('description', childComment.description)
    childComment.files &&
      childComment.files.forEach((x) => {
        data.append('files', x)
      })
    if (childComment.creator && childComment.description) {
      this.props.createChildComment(taskId, commentId, data)
    }
    // Reset state cho việc thêm mới comment
    await this.setState((state) => {
      return {
        ...state,
        childComment: {
          ...state.childComment,
          description: '',
          files: [],
          descriptionDefault: ''
        }
      }
    })
  }

  requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    this.props.downloadFile(path, fileName)
  }

  handleDeleteFile = async (fileId, fileName, childCommentId, commentId, taskId, type) => {
    const { translate } = this.props
    await this.setState((state) => {
      return {
        ...state,
        showModalDelete: commentId,
        deleteFile: {
          fileId,
          commentId,
          fileName,
          type,
          taskId,
          childCommentId
        }
      }
    })
    Swal.fire({
      html: `<div style="max-width: 100%; max-height: 100%" >${translate('task.task_perform.question_delete_file')} ${fileName} ? <div>`,
      showCancelButton: true,
      cancelButtonText: `Hủy bỏ`,
      confirmButtonText: `Đồng ý`
    }).then((result) => {
      if (result.isConfirmed) {
        this.save()
      }
    })
  }

  onEditCommentFilesChange = (files) => {
    this.setState((state) => {
      return {
        ...state,
        newCommentEdited: {
          ...state.newCommentEdited,
          files
        }
      }
    })
  }

  onEditFileChildComment = (files) => {
    this.setState((state) => {
      return {
        ...state,
        newChildCommentEdited: {
          ...state.newChildCommentEdited,
          files
        }
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.task.commentsInProcess !== nextProps.task.commentsInProcess) {
      return true
    }
    return true
  }

  save = () => {
    const { deleteFile } = this.state
    if (deleteFile.type === 'comment') {
      this.props.deleteFileComment(deleteFile.fileId, deleteFile.commentId, deleteFile.taskId)
    } else if (deleteFile.type === 'childComment') {
      this.props.deleteFileChildComment(deleteFile.fileId, deleteFile.childCommentId, deleteFile.commentId, deleteFile.taskId)
    }
  }

  isImage = (src) => {
    const string = src.toLowerCase().split('.')
    const image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
      return true
    }
    return false
  }

  render() {
    let comments
    const minRows = 3
    const maxRows = 20
    const {
      editComment,
      editChildComment,
      showChildComment,
      currentUser,
      newCommentEdited,
      newChildCommentEdited,
      showModalDelete,
      deleteFile,
      childComment,
      showfile
    } = this.state
    const { auth, translate } = this.props
    const { task, inputAvatarCssClass } = this.props
    comments = task?.commentsInProcess
    return (
      <div className='no-line-height'>
        {comments
          ? // Hiển thị bình luận của công việc
            comments.map((item) => {
              const listImage = item.files.map((elem) => (this.isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
              return (
                <div key={item._id}>
                  <img className={inputAvatarCssClass} src={process.env.REACT_APP_SERVER + item.creator?.avatar} alt='User Image' />
                  {editComment !== item._id && ( // Khi đang edit thì ẩn đi
                    <>
                      <div className='content-level1'>
                        <a style={{ cursor: 'pointer' }}>{item.creator?.name} </a>
                        {item.description.split('\n').map((item, idx) => {
                          return (
                            <span key={idx}>
                              {item}
                              <br />
                            </span>
                          )
                        })}
                        {item.creator?._id === currentUser && (
                          <div className='btn-group pull-right'>
                            <span data-toggle='dropdown'>
                              <i className='fa fa-ellipsis-h' />
                            </span>
                            <ul className='dropdown-menu'>
                              <li>
                                <a style={{ cursor: 'pointer' }} onClick={() => this.handleEditComment(item)}>
                                  {translate('task.task_perform.edit_comment')}
                                </a>
                              </li>
                              <li>
                                <a style={{ cursor: 'pointer' }} onClick={() => this.props.deleteComment(task._id, item._id)}>
                                  {translate('task.task_perform.delete_comment')}
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <ul className='list-inline tool-level1'>
                        <li>
                          <span className='text-sm'>{moment(item.createdAt).fromNow()}</span>
                        </li>

                        <li>
                          <a
                            style={{ cursor: 'pointer' }}
                            className='link-black text-sm'
                            onClick={() => this.handleShowChildComment(item._id)}
                          >
                            <i className='fa fa-comments-o margin-r-5' /> {translate('task.task_perform.comment')} ({item.comments.length})
                            &nbsp;
                          </a>
                        </li>
                        {item.files.length > 0 && (
                          <>
                            <li style={{ display: 'inline-table' }}>
                              <div>
                                <a
                                  style={{ cursor: 'pointer' }}
                                  className='link-black text-sm'
                                  onClick={() => this.handleShowFile(item._id)}
                                >
                                  <b>
                                    <i className='fa fa-paperclip' aria-hidden='true'>
                                      {translate('task.task_perform.attach_file')}({item.files && item.files.length})
                                    </i>
                                  </b>
                                </a>{' '}
                              </div>
                            </li>
                            {showfile.some((obj) => obj === item._id) && (
                              <div>
                                {item.files.map((elem, index) => {
                                  return (
                                    <div key={index} className='show-files-task'>
                                      {this.isImage(elem.name) ? (
                                        <ApiImage
                                          listImage={listImage}
                                          className='attachment-img files-attach'
                                          style={{ marginTop: '5px' }}
                                          src={elem.url}
                                          file={elem}
                                          requestDownloadFile={this.requestDownloadFile}
                                        />
                                      ) : (
                                        <a
                                          style={{ cursor: 'pointer', marginTop: '2px' }}
                                          onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}
                                        >
                                          {' '}
                                          {elem.name}{' '}
                                        </a>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </ul>
                    </>
                  )}

                  {/* Chỉnh sửa nội dung trao đổi của công việc */}
                  {editComment === item._id && (
                    <div>
                      <ContentMaker
                        idQuill={`edit-comment-process-${item?._id}-${task?._id}`}
                        inputCssClass='text-input-level1'
                        controlCssClass='tool-level2 row'
                        onFilesChange={this.onEditCommentFilesChange}
                        onFilesError={this.onFilesError}
                        files={newCommentEdited.files}
                        text={newCommentEdited.descriptionDefault}
                        submitButtonText={translate('task.task_perform.save_edit')}
                        cancelButtonText={translate('task.task_perform.cancel')}
                        handleEdit={(e) => this.handleEditComment(e)}
                        onTextChange={(value, imgs) => {
                          this.setState((state) => {
                            return {
                              ...state,
                              newCommentEdited: {
                                ...state.newCommentEdited,
                                description: value
                              }
                            }
                          })
                        }}
                        onSubmit={(e) => {
                          this.editComment(e, item.description, item._id, task._id)
                        }}
                      />
                      {item.files.length > 0 && (
                        <div className='tool-level1' style={{ marginTop: -15 }}>
                          {item.files.length > 0 && (
                            <div className='tool-level1' style={{ marginTop: -15 }}>
                              {item.files.map((file, index) => {
                                return (
                                  <div key={index}>
                                    <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                    <a
                                      style={{ cursor: 'pointer' }}
                                      className='link-black text-sm btn-box-tool'
                                      onClick={() => {
                                        this.handleDeleteFile(file._id, file.name, undefined, item._id, task._id, 'comment')
                                      }}
                                    >
                                      <i className='fa fa-times' />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      {showModalDelete === item._id && (
                        <DialogModal
                          marginTop='20vh'
                          size={50}
                          maxWidth={100}
                          modalID='modal-confirm-deletefile-kpi'
                          formID='from-confirm-deletefile-kpi'
                          isLoading={false}
                          func={() => this.save(task._id)}
                        >
                          {translate('task.task_perform.question_delete_file')} {deleteFile.fileName} ?
                        </DialogModal>
                      )}
                    </div>
                  )}
                  {/* Hiển thị bình luận cho bình luận */}
                  {showChildComment === item._id && (
                    <div className='comment-content-child'>
                      {item.comments.map((child) => {
                        const listImage = child.files.map((elem) => (this.isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                        return (
                          <div key={child._id}>
                            <img className='user-img-level2' src={process.env.REACT_APP_SERVER + child.creator?.avatar} alt='User Image' />

                            {editChildComment !== child._id && ( // Đang edit thì ẩn đi
                              <div>
                                <p className='content-level2'>
                                  <a style={{ cursor: 'pointer' }}>{child.creator?.name} </a>
                                  {child?.description?.split('\n').map((item, idx) => {
                                    return (
                                      <span key={idx}>
                                        {item}
                                        <br />
                                      </span>
                                    )
                                  })}

                                  {child.creator?._id === currentUser && (
                                    <div className='btn-group pull-right'>
                                      <span data-toggle='dropdown'>
                                        <i className='fa fa-ellipsis-h' />
                                      </span>
                                      <ul className='dropdown-menu'>
                                        <li>
                                          <a style={{ cursor: 'pointer' }} onClick={() => this.handleEditChildComment(child)}>
                                            Sửa bình luận
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => this.props.deleteChildComment(task._id, item._id, child._id)}
                                          >
                                            Xóa bình luận
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </p>
                                <ul className='list-inline tool-level2'>
                                  <li>
                                    <span className='text-sm'>{moment(child.createdAt).fromNow()}</span>
                                  </li>
                                  {child.files.length > 0 && (
                                    <>
                                      <li style={{ display: 'inline-table' }}>
                                        <div>
                                          <a
                                            style={{ cursor: 'pointer' }}
                                            className='link-black text-sm'
                                            onClick={() => this.handleShowFile(child._id)}
                                          >
                                            <b>
                                              <i className='fa fa-paperclip' aria-hidden='true'>
                                                {' '}
                                                File đính kèm ({child.files && child.files.length})
                                              </i>
                                            </b>
                                          </a>
                                        </div>
                                      </li>
                                      {this.state.showfile.some((obj) => obj === child._id) && (
                                        <li style={{ display: 'inline-table' }}>
                                          {child.files.map((elem, index) => {
                                            return (
                                              <div key={index} className='show-files-task'>
                                                {this.isImage(elem.name) ? (
                                                  <ApiImage
                                                    listImage={listImage}
                                                    index={index}
                                                    className='attachment-img files-attach'
                                                    style={{ marginTop: '5px' }}
                                                    src={elem.url}
                                                    file={elem}
                                                    requestDownloadFile={this.requestDownloadFile}
                                                  />
                                                ) : (
                                                  <a
                                                    style={{
                                                      cursor: 'pointer'
                                                    }}
                                                    style={{ marginTop: '5px' }}
                                                    onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}
                                                  >
                                                    {' '}
                                                    {elem.name}{' '}
                                                  </a>
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
                            )}

                            {/* Sửa bình luận của bình luận */}
                            {editChildComment === child._id && (
                              <div>
                                <ContentMaker
                                  idQuill={`edit-child-comment-process-${child?._id}-${task?._id}`}
                                  inputCssClass='text-input-level2'
                                  controlCssClass='tool-level2 row'
                                  onFilesChange={this.onEditFileChildComment}
                                  onFilesError={this.onFilesError}
                                  files={newChildCommentEdited.files}
                                  text={newChildCommentEdited.descriptionDefault}
                                  submitButtonText={translate('task.task_perform.save_edit')}
                                  cancelButtonText={translate('task.task_perform.cancel')}
                                  handleEdit={(e) => this.handleEditChildComment(e)}
                                  onTextChange={(value, imgs) => {
                                    this.setState((state) => {
                                      return {
                                        ...state,
                                        newChildCommentEdited: {
                                          ...state.newChildCommentEdited,
                                          description: value
                                        }
                                      }
                                    })
                                  }}
                                  onSubmit={(e) => {
                                    this.editChildComment(e, child.description, child._id, item._id, task._id)
                                  }}
                                />
                                {/* Hiện file đã tải lên */}
                                {child.files.length > 0 && (
                                  <div className='tool-level2' style={{ marginTop: -15 }}>
                                    {child.files.map((file, index) => {
                                      return (
                                        <div key={index}>
                                          <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                          <a
                                            style={{ cursor: 'pointer' }}
                                            className='link-black text-sm btn-box-tool'
                                            onClick={() => {
                                              this.handleDeleteFile(file._id, file.name, child._id, item._id, task._id, 'childComment')
                                            }}
                                          >
                                            <i className='fa fa-times' />
                                          </a>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                {/* modal confirm delete file */}
                                {showModalDelete === item._id && (
                                  <DialogModal
                                    marginTop='20vh'
                                    size={50}
                                    maxWidth={100}
                                    modalID='modal-confirm-deletefile-kpi'
                                    formID='from-confirm-deletefile'
                                    isLoading={false}
                                    func={() => this.save(task._id)}
                                  >
                                    {translate('task.task_perform.question_delete_file')} {deleteFile.fileName}?
                                  </DialogModal>
                                )}
                              </div>
                            )}
                          </div>
                        )
                        return true
                      })}
                      {/* Thêm bình luận cho bình luận */}
                      <div>
                        <img className='user-img-level2' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />

                        <ContentMaker
                          idQuill={`add-child-comment-process-${item?._id}-${task?._id}`}
                          inputCssClass='text-input-level2'
                          controlCssClass='tool-level2'
                          onFilesChange={this.onCommentFilesChange}
                          onFilesError={this.onFilesError}
                          files={childComment.files}
                          text={childComment.descriptionDefault}
                          placeholder={translate('task.task_perform.enter_comment')}
                          submitButtonText={translate('task.task_perform.create_comment')}
                          onTextChange={(value, imgs) => {
                            this.setState((state) => {
                              return {
                                ...state,
                                childComment: {
                                  ...state.childComment,
                                  description: value,
                                  descriptionDefault: null
                                }
                              }
                            })
                          }}
                          onSubmit={() => this.submitChildComment(task._id, item._id)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          : null}
        <img className={inputAvatarCssClass} src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='User Image' />

        <ContentMaker
          idQuill={`add-comment-process-${task?._id}`}
          inputCssClass='text-input-level1'
          controlCssClass='tool-level1'
          onFilesChange={this.onFilesChange}
          onFilesError={this.onFilesError}
          files={this.state.comment.files}
          text={this.state.comment.descriptionDefault}
          placeholder={translate('task.task_perform.enter_comment')}
          submitButtonText={translate('task.task_perform.create_comment')}
          onTextChange={(value, imgs) => {
            this.setState((state) => {
              return {
                ...state,
                comment: {
                  ...state.comment,
                  description: value,
                  descriptionDefault: null
                }
              }
            })
          }}
          onSubmit={(e) => this.submitComment(task._id)}
        />
      </div>
    )
  }
}

function mapState(state) {
  const { auth, performtasks } = state
  return { auth, performtasks }
}
const actionCreators = {
  editComment: performTaskAction.editComment,
  createComment: performTaskAction.createComment,
  deleteComment: performTaskAction.deleteComment,
  downloadFile: AuthActions.downloadFile,
  createChildComment: performTaskAction.createChildComment,
  editChildComment: performTaskAction.editChildComment,
  deleteChildComment: performTaskAction.deleteChildComment,
  deleteFileComment: performTaskAction.deleteFileComment,
  deleteFileChildComment: performTaskAction.deleteFileChildComment
}
const comment = connect(mapState, actionCreators)(withTranslate(CommentInProcess))

export { comment as CommentInProcess }

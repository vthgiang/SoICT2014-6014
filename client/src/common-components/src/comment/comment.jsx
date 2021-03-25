import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2'
import { ContentMaker, DialogModal, ApiImage } from '../../index';
import { getStorage } from '../../../config';
import moment from 'moment';
import { AuthActions } from '../../../modules/auth/redux/actions';
import parse from 'html-react-parser';

class Comment extends Component {
    constructor(props) {
        var idUser = getStorage("userId");
        super(props);
        this.state = {
            editComment: '',
            currentUser: idUser,
            showChildComment: [],
            editChildComment: '',
            showfile: [],
            deleteFile: '',
            comment: {
                creator: idUser,
                description: '',
                files: [],
                descriptionDefault: ""
            },
            newComment: {
                description: '',
                descriptionDefault: ""
            },
            childComment: {
            },
            newCommentEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newChildCommentEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            }
        }
        this.newComment = [];
        this.newChildComment = []
    }

    handleEditTaskComment = (id) => {

        this.setState(state => {
            return {
                ...state,
                editTaskComment: id
            }
        })
    }

    handleShowChildComment = async (id) => {
        let a;
        if (this.state.showChildComment.some(obj => obj === id)) {
            a = this.state.showChildComment.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showChildComment: a
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    showChildComment: [...this.state.showChildComment, id]
                }
            })
        }
        // var showChildComment = this.state.showChildComment;
        // if (showChildComment === id) {
        //     await this.setState(state => {
        //         return {
        //             ...state,
        //             showChildComment: ""
        //         }
        //     })
        // } else {
        //     await this.setState(state => {
        //         return {
        //             ...state,
        //             showChildComment: id
        //         }
        //     })
        // }

    }

    handleShowFile = (id) => {
        var a
        if (this.state.showfile.some(obj => obj === id)) {
            a = this.state.showfile.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showfile: a
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    showfile: [...this.state.showfile, id]
                }
            })
        }
    }


    handleEditComment = (comment) => {
        this.setState(state => {
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

    handleEditChildComment = (childComment) => {
        this.setState(state => {
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
                    files: files,
                }
            }
        })
    }
    onCommentFilesChange = (files, commentId) => {
        this.setState((state) => {
            state.childComment[`${commentId}`] = {
                ...state.childComment[`${commentId}`],
                files: files
            }
            return {
                ...state,
            }
        })
    }
    onFilesError = (error, file) => {
    }


    editComment = async (e, description, commentId, dataId) => {
        e.preventDefault()
        let { newCommentEdited } = this.state;
        let data = new FormData();
        newCommentEdited.files.forEach(x => {
            data.append("files", x)
        })
        data.append("creator", newCommentEdited.creator);
        data.append("type", "edit")
        if (newCommentEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newCommentEdited.description)
        }
        if (newCommentEdited.description) {
            this.props.editComment(dataId, commentId, data, this.props.type)
        }
        if (newCommentEdited.description || newCommentEdited.files) {
            this.props.editComment(dataId, commentId, data, this.props.type);
        }
        await this.setState(state => {
            return {
                ...state,
                editComment: "",
                newCommentEdited: {
                    ...state.newCommentEdited,
                    files: [],
                    description: "",
                    descriptionDefault: null
                }
            }
        })
    }
    editChildComment = async (e, description, childCommentId, commentId, dataId) => {
        e.preventDefault();
        let { newChildCommentEdited } = this.state;
        let data = new FormData();
        newChildCommentEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (newChildCommentEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newChildCommentEdited.description)
        }
        data.append("creator", newChildCommentEdited.creator)
        if (newChildCommentEdited.description || newChildCommentEdited.files) {
            this.props.editChildComment(dataId, commentId, childCommentId, data, this.props.type);
        }
        this.setState(state => {
            return {
                ...state,
                newChildCommentEdited: {
                    ...state.newChildCommentEdited,
                    description: "",
                    files: [],
                    descriptionDefault: ''
                },
                editChildComment: ""
            }
        })
    }
    submitComment = async (dataId) => {
        var { comment } = this.state;
        const data = new FormData();
        data.append("creator", comment.creator);
        data.append("description", comment.description);
        this.props.currentTask && data.append("currentTask", this.props.currentTask)
        comment.files && comment.files.forEach(x => {
            data.append("files", x);
        })
        if (comment.creator && comment.description) {
            this.props.createComment(dataId, data, this.props.type);
        }
        // Reset state cho việc thêm mới action
        await this.setState(state => {
            return {
                ...state,
                comment: {
                    ...state.comment,
                    description: "",
                    files: [],
                    descriptionDefault: ''
                },
            }
        })
    }
    submitChildComment = async (dataId, commentId) => {
        var { childComment } = this.state;
        const data = new FormData();
        data.append("creator", childComment[`${commentId}`].creator);
        data.append("description", childComment[`${commentId}`].description);
        childComment[`${commentId}`].files && childComment[`${commentId}`].files.forEach(x => {
            data.append("files", x);
        })
        if (childComment[`${commentId}`].creator && childComment[`${commentId}`].description) {
            this.props.createChildComment(dataId, commentId, data, this.props.type);
        }
        // Reset state cho việc thêm mới comment
        this.setState(state => {
            state.childComment[`${commentId}`] = {
                description: "",
                files: [],
                descriptionDefault: ''
            }
            return {
                ...state,
            }
        })
    }
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }
    handleDeleteFile = async (fileId, fileName, childCommentId, commentId, dataId, type) => {
        let { translate } = this.props
        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" >${translate("task.task_perform.question_delete_file")} ${fileName} ? <div>`,
            showCancelButton: true,
            cancelButtonText: `Hủy bỏ`,
            confirmButtonText: `Đồng ý`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.save(dataId)
            }
        })
        await this.setState(state => {
            return {
                ...state,
                deleteFile: {
                    fileId: fileId,
                    commentId: commentId,
                    fileName: fileName,
                    type: type,
                    dataId: dataId,
                    childCommentId: childCommentId
                }
            }
        });
    }

    onEditCommentFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newCommentEdited: {
                    ...state.newCommentEdited,
                    files: files,
                }
            }
        })
    }

    onEditFileChildComment = (files) => {
        this.setState(state => {
            return {
                ...state,
                newChildCommentEdited: {
                    ...state.newChildCommentEdited,
                    files: files,
                }
            }
        })
    }
    isImage = (src) => {
        let string = src.split(".")
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    save = () => {
        let { deleteFile } = this.state
        if (deleteFile.type === "comment") {
            this.props.deleteFileComment(deleteFile.fileId, deleteFile.commentId, deleteFile.dataId)
        } else if (deleteFile.type === "childComment") {
            this.props.deleteFileChildComment(deleteFile.fileId, deleteFile.childCommentId, deleteFile.commentId, deleteFile.dataId)
        }
    }
    render() {
        const { editComment, editChildComment, showChildComment, currentUser, newCommentEdited, newChildCommentEdited, childComment, showfile } = this.state
        const { auth, translate } = this.props
        const { data, comments, commentId, childrenComments = true } = this.props;

        return (
            <React.Fragment>
                { comments && comments ?
                    //Hiển thị bình luận của công việc
                    comments.map(item => {
                        return (
                            <div key={item._id + "comment"}>
                                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + item.creator?.avatar)} alt="User Image" />
                                {editComment !== item._id && // Khi đang edit thì ẩn đi
                                    <React.Fragment>
                                        <div className="content-level1">
                                            <a style={{ cursor: "pointer" }}>{item.creator?.name} </a>
                                            {item.description.split('\n').map((x, idx) => {
                                                return (
                                                    <span key={item._id + idx}>
                                                        {parse(x)}
                                                    </span>
                                                );
                                            })
                                            }
                                            {item.creator?._id === currentUser &&
                                                <div className="btn-group pull-right">
                                                    <span data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-h"></i>
                                                    </span>
                                                    <ul className="dropdown-menu">
                                                        <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditComment(item)} >{translate('task.task_perform.edit_comment')}</a></li>
                                                        <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteComment(data._id, item._id, this.props.type)} >{translate('task.task_perform.delete_comment')}</a></li>
                                                    </ul>
                                                </div>}
                                        </div>
                                        <ul className="list-inline tool-level1">
                                            <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>

                                            {childrenComments && <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate('task.task_perform.comment')} ({item?.comments?.length}) &nbsp;</a></li>}
                                            {item?.files?.length > 0 &&
                                                <React.Fragment>
                                                    <li style={{ display: "inline-table" }}>
                                                        <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i className="fa fa-paperclip" aria-hidden="true">{translate('task.task_perform.attach_file')}({item.files && item.files.length})</i></b></a> </div></li>
                                                    {showfile.some(obj => obj === item._id) &&
                                                        <div>
                                                            {item.files.map((elem, index) => {
                                                                return <div key={elem._id} className="show-files-task">
                                                                    {this.isImage(elem.name) ?
                                                                        <ApiImage
                                                                            className="attachment-img files-attach"
                                                                            style={{ marginTop: "5px" }}
                                                                            src={elem.url}
                                                                            file={elem}
                                                                            requestDownloadFile={this.requestDownloadFile}
                                                                        />
                                                                        :
                                                                        <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                    }
                                                                </div>
                                                            })}
                                                        </div>
                                                    }
                                                </React.Fragment>
                                            }
                                        </ul>
                                    </React.Fragment>
                                }

                                {/*Chỉnh sửa nội dung trao đổi của công việc */}
                                {editComment === item._id &&
                                    <React.Fragment>
                                        <div>
                                            <ContentMaker
                                                idQuill={`edit-comment-${item._id}`}
                                                inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                onFilesChange={this.onEditCommentFilesChange}
                                                onFilesError={this.onFilesError}
                                                files={newCommentEdited.files}
                                                text={newCommentEdited.descriptionDefault}
                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                handleEdit={(e) => this.handleEditComment(e)}
                                                onTextChange={(value, imgs) => {
                                                    this.setState(state => {
                                                        return { ...state, newCommentEdited: { ...state.newCommentEdited, description: value } }
                                                    })
                                                }}
                                                onSubmit={(e) => { this.editComment(e, item.description, item._id, data._id) }}
                                            />
                                            {item.files.length > 0 &&
                                                <div className="tool-level1" style={{ marginTop: -15 }}>
                                                    {item?.files?.length > 0 && item.files.map(file => {
                                                        return <div>
                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, "", item._id, data._id, "comment") }}><i className="fa fa-times"></i></a>
                                                        </div>
                                                    })}
                                                </div>}
                                        </div>
                                    </React.Fragment>
                                }
                                {/* Hiển thị bình luận cho bình luận */}
                                {showChildComment.some(obj => obj === item._id) &&
                                    <div className="comment-content-child">
                                        {item?.comments?.length > 0 && item.comments.map(child => {
                                            return <div key={child._id}>
                                                <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + item.creator?.avatar)} alt="User Image" />

                                                {editChildComment !== child._id && // Đang edit thì ẩn đi
                                                    <div>
                                                        <p className="content-level2">
                                                            <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                            {child?.description?.split('\n').map((item, idx) => {
                                                                return (
                                                                    <span key={item._id}>
                                                                        {parse(item)}
                                                                    </span>
                                                                );
                                                            })
                                                            }

                                                            {child.creator?._id === currentUser &&
                                                                <div className="btn-group pull-right">
                                                                    <span data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditChildComment(child)} >Sửa bình luận</a></li>
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteChildComment(data._id, item._id, child._id, this.props.type)} >Xóa bình luận</a></li>
                                                                    </ul>
                                                                </div>}
                                                        </p>
                                                        <ul className="list-inline tool-level2">
                                                            <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                            {child.files.length > 0 &&
                                                                <React.Fragment>
                                                                    <li style={{ display: "inline-table" }}>
                                                                        <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> File đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                                    {showfile.some(obj => obj === child._id) &&
                                                                        <li style={{ display: "inline-table" }}>
                                                                            {child.files.map((elem, index) => {
                                                                                return <div key={elem._id} className="show-files-task">
                                                                                    {this.isImage(elem.name) ?
                                                                                        <ApiImage
                                                                                            className="attachment-img files-attach"
                                                                                            style={{ marginTop: "5px" }}
                                                                                            src={elem.url}
                                                                                            file={elem}
                                                                                            requestDownloadFile={this.requestDownloadFile}
                                                                                        />
                                                                                        :
                                                                                        <a style={{ cursor: "pointer" }} style={{ marginTop: "5px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                                    }
                                                                                </div>
                                                                            })}
                                                                        </li>
                                                                    }
                                                                </React.Fragment>
                                                            }
                                                        </ul>
                                                    </div>
                                                }

                                                {/* Sửa bình luận của bình luận */}
                                                {editChildComment === child._id &&
                                                    <React.Fragment>
                                                        <div>
                                                            <ContentMaker
                                                                idQuill={`edit-child-comment-${child._id}`}
                                                                inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                onFilesChange={this.onEditFileChildComment}
                                                                onFilesError={this.onFilesError}
                                                                files={newChildCommentEdited.files}
                                                                text={newChildCommentEdited.descriptionDefault}
                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                handleEdit={(e) => this.handleEditChildComment(e)}
                                                                onTextChange={(value, imgs) => {
                                                                    this.setState(state => {
                                                                        return { ...state, newChildCommentEdited: { ...state.newChildCommentEdited, description: value, descriptionDefault: null } }
                                                                    })
                                                                }}
                                                                onSubmit={(e) => { this.editChildComment(e, child.description, child._id, item._id, data._id) }}
                                                            />
                                                            {/* Hiện file đã tải lên */}
                                                            {child.files.length > 0 &&
                                                                <div className="tool-level2" style={{ marginTop: "-10px" }}>
                                                                    {child.files.map((file, index) => {
                                                                        return <div key={file._id}>
                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, child._id, item._id, data._id, "childComment") }}><i className="fa fa-times"></i></a>
                                                                        </div>
                                                                    })}
                                                                </div>}
                                                        </div>
                                                    </React.Fragment>
                                                }
                                            </div>;
                                            return true;
                                        })
                                        }
                                        {/*Thêm bình luận cho bình luận */}
                                        <div>
                                            <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                            <ContentMaker
                                                idQuill={`add-child-comment-${item._id}`}
                                                inputCssClass="text-input-level2" controlCssClass="tool-level2"
                                                onFilesChange={(files) => this.onCommentFilesChange(files, item._id)}
                                                onFilesError={this.onFilesError}
                                                files={childComment[`${item._id}`]?.files}
                                                text={childComment[`${item._id}`]?.descriptionDefault}
                                                placeholder={translate('task.task_perform.enter_comment')}
                                                submitButtonText={translate('task.task_perform.create_comment')}
                                                onTextChange={(value, imgs) => {
                                                    this.setState(state => {
                                                        state.childComment[`${item._id}`] = {
                                                            ...state.childComment[`${item._id}`],
                                                            description: value,
                                                            creator: currentUser,
                                                            descriptionDefault: null
                                                        }
                                                        return {
                                                            ...state
                                                        }
                                                    })
                                                }}
                                                onSubmit={() => this.submitChildComment(data._id, item._id)}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }) : null
                }
                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="User Image" />
                <ContentMaker
                    idQuill={`add-comment-${commentId}`}
                    inputCssClass="text-input-level1" controlCssClass="tool-level1"
                    onFilesChange={this.onFilesChange}
                    onFilesError={this.onFilesError}
                    files={this.state.comment.files}
                    text={this.state.comment.descriptionDefault}
                    placeholder={translate('task.task_perform.enter_comment')}
                    submitButtonText={translate('task.task_perform.create_comment')}
                    onTextChange={(value, imgs) => {
                        this.setState(state => {
                            return { ...state, comment: { ...state.comment, description: value, descriptionDefault: null } }
                        })
                    }}
                    onSubmit={(e) => this.submitComment(data?._id)}
                />
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { auth } = state;
    return { auth };
}
const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};
const comment = connect(mapState, actionCreators)(withTranslate(Comment));

export { comment as Comment }
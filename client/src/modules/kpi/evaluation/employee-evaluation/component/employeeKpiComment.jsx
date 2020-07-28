import React, { Component } from 'react';
import { ContentMaker } from '../../../../../common-components'
import { LOCAL_SERVER_API } from '../../../../../env'
import { getStorage } from '../../../../../config'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import TextareaAutosize from 'react-textarea-autosize';
import { performTaskAction } from '../../../../task/task-perform/redux/actions'
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import moment from 'moment'
import { AuthActions } from '../../../../auth/redux/actions';
class EmployeeKpiComment extends Component {
    constructor(props) {
        let idUser = getStorage("userId");
        super(props);
        this.state = {
            editComment: '',
            currentUser: idUser,
            showChildComment: '',
            editCommentOfComment: '',
            showfile: [],
            comment: {
                creator: idUser,
                description: '',
                files: [],
            },
            newComment: {
                description: ''
            },
            commentOfComment: {
                creator: idUser,
                description: '',
                files: [],
            }

        }
        this.newComment = [];
        this.newCommentOfComment = []
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
        let showChildComment = this.state.showChildComment;
        if (showChildComment === id) {
            await this.setState(state => {
                return {
                    ...state,
                    showChildComment: ""
                }
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    showChildComment: id
                }
            })
        }
    }

    handleShowFile = (id) => {
        let a;
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

    handleEditComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editComment: id
            }
        })
    }

    handleEditCommentOfComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editCommentOfComment: id
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

    onCommentFilesChange = (files) => {
        this.setState((state) => {
            return {
                ...state,
                commentOfComment: {
                    ...state.commentOfComment,
                    files: files,
                }
            }
        })
    }

    editComment = async (id) => {
        let { newComment } = this.state;
        if (newComment.description) {
            await this.props.editComment(id, newComment)
        }
        this.setState(state => {
            return {
                ...state,
                editComment: ""
            }
        })
    }
    editCommentOfComment = async (e, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newCommentOfComment: {
                    ...state.newCommentOfComment,
                    description: this.newCommentOfComment[index].value,
                },
                editCommentOfComment: ''
            }
        })
        let { newCommentOfComment } = this.state;
        if (newCommentOfComment.description) {
            this.props.editCommentOfComment(index, newCommentOfComment);
        }
    }

    submitComment = async (id) => {
        let { comment } = this.state;
        const data = new FormData();
        data.append("idKPI", id);
        data.append("creator", comment.creator);
        data.append("description", comment.description);
        comment.files && comment.files.forEach(x => {
            data.append("files", x);
        })
        if (comment.creator && comment.description) {
            this.props.createComment(data);
        }
        await this.setState(state => {
            return {
                ...state,
                comment: {
                    ...state.comment,
                    description: "",
                    files: [],
                },
            }
        })
    }

    submitCommentOfComment = async (id) => {
        let { commentOfComment } = this.state;
        const data = new FormData();
        data.append("idComment", id);
        data.append("creator", commentOfComment.creator);
        data.append("description", commentOfComment.description);
        commentOfComment.files && commentOfComment.files.forEach(x => {
            data.append("files", x);
        })
        if (commentOfComment.creator && commentOfComment.description) {
            this.props.createCommentOfComment(data);
        }
        await this.setState(state => {
            return {
                ...state,
                commentOfComment: {
                    ...state.commentOfComment,
                    description: "",
                    files: [],
                },
            }
        })
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        this.props.downloadFile(path, fileName);
    }

    render() {
        const { kpimembers, auth } = this.props;
        const { translate } = this.props;
        const { editComment, editCommentOfComment, showChildComment, currentUser } = this.state;
        let comments, currentKPI;
        let minRows = 3, maxRows = 20;

        if (kpimembers.currentKPI) {
            currentKPI = kpimembers.currentKPI;
            comments = currentKPI.comments
        }
        return (
            <React.Fragment>
                {comments?
                    comments.map(item => {
                        return (
                            <div className="clearfix" key={item._id}>
                                <img className="user-img-level1" src={(LOCAL_SERVER_API + item.creator.avatar)} alt="User Image" />
                                {editComment !== item._id &&
                                    <React.Fragment>
                                        <div className="content-level1">
                                            <a style={{ cursor: 'pointer' }}>{item.creator.name} </a>
                                            {item.description.split('\n').map((item, idx) => {
                                                return (
                                                    <span key={idx}>
                                                        {item}
                                                        <br />
                                                    </span>
                                                );
                                            })}
                                            {item.creator._id === currentUser &&
                                                <div className="btn-group pull-right">
                                                    <span data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-h"></i>
                                                    </span>
                                                    <ul className="dropdown-menu">
                                                        <li><a style={{ cursor: 'pointer' }} onClick={() => this.handleEditComment(item._id)} >{translate('kpi.evaluation.employee_evaluation.edit_cmt')}</a></li>
                                                        <li><a style={{ cursor: 'pointer' }} onClick={() => this.props.deleteComment(item._id, currentKPI._id)} >{translate('kpi.evaluation.employee_evaluation.delete_cmt')}</a></li>
                                                    </ul>
                                                </div>}
                                        </div>
                                        <ul className="list-inline tool-level1">
                                            <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                            <li><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate('kpi.evaluation.employee_evaluation.add_cmt')} ({item.comments.length}) &nbsp;</a></li>
                                            {item.files.length > 0 &&
                                                <React.Fragment>
                                                    <li style={{ display: "inline-table" }}>
                                                        <div><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> {translate('kpi.evaluation.employee_evaluation.attached_file')} ({item.files && item.files.length})</i></b></a> </div></li>
                                                    {this.state.showfile.some(obj => obj === item._id) &&
                                                        <li style={{ display: "inline-table" }}>{item.files.map(elem => {
                                                            return <div><a style={{ cursor: 'pointer' }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
                                                        })}</li>
                                                    }
                                                </React.Fragment>
                                            }
                                        </ul>
                                    </React.Fragment>
                                }
                                {editComment === item._id &&
                                    <div>
                                        <div className="text-input-level1">
                                            <TextareaAutosize
                                                defaultValue={item.description}
                                                useCacheForDOMMeasurements
                                                minRows={minRows}
                                                maxRows={maxRows}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    this.setState(state => {
                                                        return { ...state, newComment: { ...state.newComment, description: value } }
                                                    })
                                                }}
                                            />
                                        </div>
                                        <ul className="list-inline tool-level1" style={{ textAlign: "right" }}>
                                            <li><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={() => this.editComment(item._id)}>{translate('kpi.evaluation.employee_evaluation.send_edition')}</a></li>
                                            <li><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={(e) => this.handleEditComment(e)}>{translate('kpi.evaluation.employee_evaluation.cancel')}</a></li>
                                        </ul>
                                    </div>}
                                {showChildComment === item._id &&
                                    <div className="comment-content-child">
                                        {item.comments.map(child => {
                                            return <div key={child._id}>
                                                <img className="user-img-level2" src={(LOCAL_SERVER_API + item.creator.avatar)} alt="User Image" />
                                                {editCommentOfComment !== child._id &&
                                                    <div>
                                                        <div className="content-level2">
                                                            <a style={{ cursor: 'pointer' }}>{child.creator.name} </a>
                                                            {child.description.split('\n').map((item, idx) => {
                                                                return (
                                                                    <span key={idx}>
                                                                        {item}
                                                                        <br />
                                                                    </span>
                                                                );
                                                            })}
                                                            {child.creator._id === currentUser &&
                                                                <div className="btn-group pull-right">
                                                                    <span data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a style={{ cursor: 'pointer' }} onClick={() => this.handleEditCommentOfComment(child._id)} >{translate('kpi.evaluation.employee_evaluation.edit_cmt')}</a></li>
                                                                        <li><a style={{ cursor: 'pointer' }} onClick={() => this.props.deleteCommentOfComment(child._id, currentKPI._id)} >{translate('kpi.evaluation.employee_evaluation.delete_cmt')}</a></li>
                                                                    </ul>
                                                                </div>}
                                                        </div>
                                                        <ul className="list-inline tool-level2">
                                                            <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                            {child.files.length > 0 &&
                                                                <React.Fragment>
                                                                    <li style={{ display: "inline-table" }}>
                                                                        <div>
                                                                            <a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}>
                                                                                <b><i class="fa fa-paperclip" aria-hidden="true"> {translate('kpi.evaluation.employee_evaluation.attached_file')} ({child.files && child.files.length})</i></b>
                                                                            </a>
                                                                        </div>
                                                                    </li>
                                                                    {this.state.showfile.some(obj => obj === child._id) &&
                                                                        <li style={{ display: "inline-table" }}>
                                                                            {child.files.map(elem => {
                                                                                return <div><a style={{ cursor: 'pointer' }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
                                                                            })}
                                                                        </li>
                                                                    }
                                                                </React.Fragment>}
                                                        </ul>
                                                    </div>
                                                }
                                                {editCommentOfComment === child._id &&
                                                    <div>
                                                        <div className="text-input-level2">
                                                            <textarea
                                                                defaultValue={child.description}
                                                                ref={input => this.newCommentOfComment[child._id] = input}
                                                            />
                                                        </div>
                                                        <ul className="list-inline tool-level2" style={{ textAlign: "right" }}>
                                                            <li><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={(e) => this.editCommentOfComment(e, child._id)}>{translate('kpi.evaluation.employee_evaluation.send_edition')} </a></li>
                                                            <li><a style={{ cursor: 'pointer' }} className="link-black text-sm" onClick={(e) => this.handleEditCommentOfComment(e)}>{translate('kpi.evaluation.employee_evaluation.cancel')}</a></li>
                                                        </ul>
                                                    </div>
                                                }
                                            </div>;
                                            return true;
                                        })
                                        }
                                        <div>
                                            <img className="user-img-level2" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="user avatar" />
                                            <ContentMaker
                                                inputCssClass="text-input-level2" controlCssClass="tool-level2"
                                                onFilesChange={this.onCommentFilesChange}
                                                onFilesError={this.onFilesError}
                                                files={this.state.commentOfComment.files}
                                                text={this.state.commentOfComment.description}
                                                placeholder={translate('kpi.evaluation.employee_evaluation.comment')}
                                                submitButtonText={translate('kpi.evaluation.employee_evaluation.add_cmt')}
                                                onTextChange={(e) => {
                                                    let value = e.target.value;
                                                    this.setState(state => {
                                                        return { ...state, commentOfComment: { ...state.commentOfComment, description: value } }
                                                    })
                                                }}
                                                onSubmit={() => this.submitCommentOfComment(item._id)}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }) : null
                }
                <img className="user-img-level1" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="User Image" />
                <ContentMaker
                    inputCssClass="text-input-level1" controlCssClass="tool-level1"
                    onFilesChange={this.onFilesChange}
                    onFilesError={this.onFilesError}
                    files={this.state.comment.files}
                    text={this.state.comment.description}
                    placeholder={translate('kpi.evaluation.employee_evaluation.commment')}
                    submitButtonText={translate('kpi.evaluation.employee_evaluation.add_cmt')}
                    onTextChange={(e) => {
                        let value = e.target.value;
                        this.setState(state => {
                            return { ...state, comment: { ...state.comment, description: value } }
                        })
                    }}
                    onSubmit={(e) => this.submitComment(currentKPI._id)}
                />
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { auth, kpimembers } = state;
    return { auth, kpimembers };
}
const actionCreators = {
    editComment: createKpiSetActions.editComment,
    deleteComment: createKpiSetActions.deleteComment,
    downloadFile: AuthActions.downloadFile,
    createComment: createKpiSetActions.createComment,
    createCommentOfComment: createKpiSetActions.createCommentOfComment,
    editCommentOfComment: createKpiSetActions.editCommentOfComment,
    deleteCommentOfComment: createKpiSetActions.deleteCommentOfComment
};
const comment = connect(mapState, actionCreators)(withTranslate(EmployeeKpiComment));

export { comment as EmployeeKpiComment }
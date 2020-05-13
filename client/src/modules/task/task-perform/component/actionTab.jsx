import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Swal from 'sweetalert2';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { managerKpiActions } from "../../../kpi/employee/management/redux/actions";
import moment from 'moment'

class ActionTab extends Component {
    constructor(props) {

        const token = getStorage();
        const verified = jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;
        super(props);
        this.state = {
            currentUser: idUser,
            selected: "taskAction",
            extendDescription: false,
            editDescription: false,
            extendInformation: true,
            extendRACI: false,
            extendKPI: false,
            extendApproveRessult: false,
            extendInfoByTemplate: true,
            comment: false,
            action: false,
            editComment: "",
            editAction: "",
            editTaskComment: "",
            editCommentOfTaskComment: "",
            startTimer: false,
            pauseTimer: false,
            showChildComment: "",
            showChildTaskComment: "",
            newCommentOfAction: {
                //task: this.props.id,
                creator: idUser,
                content: "",
                file: null,
                taskActionId: null
            },
            newAction: {
                //task: this.props.id,
                creator: idUser,
                content: "",
                file: null
            },
            newTaskComment: {
                creator: idUser,
                content: "",
                file: null
            },
            newCommentOfTaskComment: {
                creator: idUser,
                content: "",
                file : null
            },
            showEdit: false,
            timer: {
                //task: this.props.id,
                startTimer: "",
                stopTimer: null,
                user: idUser,
                time: 0,
            },
            resultTask: 0,
            showModal: ""
        };
        this.contentTaskComment= [];
        this.contentCommentOfAction= [];
        this.newContentCommentOfAction = [];
        this.contentAction = [];
        this.newContentAction = [];
        this.newContentTaskComment= [];
        this.contentCommentOfTaskComment= [];
        this.newContentCommentOfTaskComment= [];
        //this.onHandleChangeFile = this.onHandleChangeFile.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.mypoint = [];
        this.approvepoint = [];
    }
    componentDidUpdate() {
        if (this.props.id !== undefined) {
            let script3 = document.createElement('script');
            script3.src = '../lib/main/js/CoCauToChuc.js';
            script3.async = true;
            script3.defer = true;
            document.body.appendChild(script3);
            const { performtasks } = this.props;
            var currentTimer;
            if (typeof performtasks.currentTimer !== "undefined") currentTimer = performtasks.currentTimer;
            if (currentTimer && this.state.timer.startTimer === "") {
                this.setState(state => {
                    return {
                        ...state,
                        timer: {
                            ...currentTimer,
                            startTimer: currentTimer.startTimer - currentTimer.time
                        },
                        startTimer: true,
                        pauseTimer: currentTimer.pause,
                    }
                })
                //Chỉnh giao diện
                document.getElementById("start-timer-task").style.width = "20%";
                document.getElementById("btn-approve").style.marginLeft = "50%";
                // Setup thời thời gian chạy
                if (currentTimer.pause === false) {
                    this.timer = setInterval(() => this.setState(state => {
                        return {
                            ...state,
                            timer: {
                                ...state.timer,
                                time: Date.now() - this.state.timer.startTimer,
                            },
                        }
                    }), 1000);
                }
            }
        }

    }
    componentDidMount() {
        let script2 = document.createElement('script');
        script2.src = '../lib/main/js/uploadfile/custom.js';
        script2.async = true;
        script2.defer = true;
        document.body.appendChild(script2);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        if (nextProps.id !== this.state.id) {
            // console.log('nextProps.id !== this.state.id', nextProps.id ,this.state.id, nextState.id);
            this.props.getLogTimer(nextProps.id);
            this.props.getTaskById(nextProps.id);
            this.props.getTaskActions(nextProps.id);
            this.props.getStatusTimer(nextProps.id);
            this.props.getTaskComments(nextProps.id)
            // return true;
        }
        return true;
    }

    UNSAFE_componentWillMount() {
        // this.props.getLogTimer(this.props.id);
        // this.props.getAllKPIPersonalByMember(this.props.responsible);
        // this.props.getAllUserOfDepartment(this.props.unit);
        // this.props.getTaskById(this.props.id);
        // this.props.getTaskActions(this.props.id);
        // this.props.getStatusTimer(this.props.id);
    }
    showEdit(event) {
        event.preventDefault();
        
        this.setState({ showEdit: true }, () => {
          document.addEventListener('click', this.closeEdit);
        });
    }
    closeEdit(event) {
    
        if (!this.dropdownEdit.contains(event.target)) {
          
          this.setState({ showEdit: false }, () => {
            document.removeEventListener('click', this.closeEdit);
          });  
          
        }
    }
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selected: content
            }
        })
    }
    handleComment = async (event) => {
        event.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                comment: !state.comment
            }
        })
    }
    handleAction = async (event) => {
        event.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                action: !state.action
            }
        })
    }
    handleShowChildComment = async (id) => {
        var showChildComment = this.state.showChildComment;
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
    handleShowChildTaskComment = async (id) => {
        var showChildTaskComment = this.state.showChildTaskComment;
        if (showChildTaskComment === id) {
            await this.setState(state => {
                return {
                    ...state,
                    showChildTaskComment: ""
                }
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    showChildTaskComment: id
                }
            })
        }

    }
    handleEditCommentOfTaskComment = async(id) => {
        await this.setState(state => {
            return {
                ...state,
                editCommentOfTaskComment: id
            }
        })
    }
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`modelPerformTask${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    submitComment = async (e, id, index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    content: this.contentCommentOfAction[index].value,
                    taskActionId: id,
                    task: taskId
                }
            }
        })
        var { newCommentOfAction } = this.state;
        console.log(newCommentOfAction)
        // const data = new FormData();
        // data.append("task", newComment.task);
        // data.append("creator", newComment.creator);
        // data.append("parent", newComment.parent);
        // data.append("content", newComment.content);
        //  data.append("file", newComment.file);
        if (newCommentOfAction.task && newCommentOfAction.content && newCommentOfAction.creator) {

            this.props.addActionComment(newCommentOfAction);
        }
        this.contentCommentOfAction[index].value = "";
    }
    //Thêm mới hoạt động
    submitAction = async (e, id, index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    content: this.contentAction[index].value,
                    task: taskId
                }
            }
        })
        var { newAction } = this.state;
        if (newAction.content && newAction.creator) {
            console.log(newAction)
            this.props.addTaskAction(newAction);
        }
        this.contentAction[index].value = "";
    }
    //Thêm mới bình luận của công việc
    submitTaskComment = async (e,id,index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    content: this.contentTaskComment[index].value,
                    task: taskId
                }
            }
        })
        var { newTaskComment } = this.state;
        console.log(newTaskComment)
        if (newTaskComment.content && newTaskComment.creator) {
            this.props.createTaskComment(newTaskComment);
        }
        this.contentTaskComment[index].value = "";
    }
    submitCommentOfTaskComment = async (e,id,index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    content: this.contentCommentOfTaskComment[index].value,
                    task: taskId,
                    id: id
                }
            }
        })
        var { newCommentOfTaskComment } = this.state;
        console.log(newCommentOfTaskComment)
        if (newCommentOfTaskComment.content && newCommentOfTaskComment.creator) {
            this.props.createCommentOfTaskComment(newCommentOfTaskComment);
        }
        this.contentCommentOfTaskComment[index].value = "";
    }
    handleEditActionComment = async (id) => {

        await this.setState(state => {
            return {
                ...state,
                editComment: id
            }
        })
    }
    handleEditAction = async (id) => {
        console.log("HAHAHAHA")
        await this.setState(state => {
            return {
                ...state,
                editAction: id
            }
        })
    }
    handleEditTaskComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editTaskComment: id
            }
        })
    }
    //Lưu hoạt động
    handleSaveEditActionComment = async (e, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    content: this.newContentCommentOfAction[index].value,
                    // file:
                },
                editComment: ""
            }
        })
        var { newCommentOfAction } = this.state;
        if (newCommentOfAction.content) {
            this.props.editActionComment(index, newCommentOfAction);
        }
    }
    handleSaveEditAction = async (e, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    content: this.newContentAction[index].value,
                    // file:
                },
                editAction: ""
            }
        })
        var { newAction } = this.state;
        if (newAction.content) {
            this.props.editTaskAction(index, newAction);
        }
    }
    handleSaveEditTaskComment = async (e,index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    content: this.newContentTaskComment[index].value,
                    // file:
                },
                editTaskComment: ""
            }
        })
        var { newTaskComment } = this.state;
        if (newTaskComment.content) {
            this.props.editTaskComment(index, newTaskComment);
        }
    }
    handleSaveEditCommentOfTaskComment = async (e,index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    content: this.newContentCommentOfTaskComment[index].value,
                    id : index
                    // file:
                },
                editCommentOfTaskComment: ""
            }
        })
        var { newCommentOfTaskComment } = this.state;
        console.log(newCommentOfTaskComment)
        if (newCommentOfTaskComment.content) {
            this.props.editCommentOfTaskComment(index, newCommentOfTaskComment);
        }
    }

    render() {
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask;
        const { tasks, performtasks, user, KPIPersonalManager } = this.props; 
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }
        var task, actionComments, taskActions,taskComments, actions, informations, currentTimer, userdepartments, listKPIPersonal, logTimer;
        var statusTask;
        const { selected, extendDescription, editDescription, extendInformation, extendRACI, extendKPI, extendApproveRessult, extendInfoByTemplate } = this.state;
        const { comment, editComment, startTimer, showChildComment, pauseTimer, editAction, action,editTaskComment,showChildTaskComment,editCommentOfTaskComment } = this.state;
        const { time } = this.state.timer;
  
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }
        if (typeof performtasks.taskcomments !== 'undefined' && performtasks.taskcomments !== null) taskComments = performtasks.taskcomments;
        if (typeof performtasks.taskactions !== 'undefined' && performtasks.taskactions !== null) taskActions = performtasks.taskactions;
        if (typeof performtasks.currentTimer !== "undefined") currentTimer = performtasks.currentTimer;
        if (performtasks.logtimer) logTimer = performtasks.logtimer;
        if (user.userdepartments) userdepartments = user.userdepartments;

        return (
            <div>
                <div className="nav-tabs-custom" style={{boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none"}}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">Hoạt động()</a></li>
                        <li><a href="#actionComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">Trao đổi()</a></li>
                        <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">Tài liệu</a></li>
                        <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">Công việc con</a></li>
                        <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">Lịch sử bấm giờ</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                            {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                                // Hiển thị hoạt động của công việc
                                taskActions.map(item => {
                                    // if (item.parent === null)
                                    return <div className="post clearfix" style={{ textAlign: 'left', width: "100%", marginTop: "1.5%", marginLeft: "15px", }} key={item._id}>
                                        <div className="row">
                                            <div className="user-block col-sm-2" style={{ display: "inline-block", marginBottom: "0px", marginLeft: "-14px" }}>
                                                <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                            </div>
                                            <div className="col-sm-9" style={{ backgroundColor: "#f2f3f5", borderRadius: "18px", marginLeft: "-45px", width: "78.4%" }}>
                                                <div className="user-block" style={{ display: "inline-block", marginBottom: "0px" }}>
                                                    <span className="username" style={{ marginLeft: "0px", marginTop:"10px" }} >
                                                        <a href="#abc">{item.creator.name}</a>
                                                    </span>
                                                    <p style={{ marginBottom: "2px", marginTop: "2px", fontFamily: 'inherit Helvetica, Arial, sans-serif', fontSize: "13px" }}>&nbsp;{item.description}</p>
                                                    <div className="row" style={{ width: "300%", marginLeft: "0px", marginBottom: "0px" }} >
                                                        <span className="description col-sm-5" style={{ marginLeft: "-11px" }}>{moment(item.createdAt).fromNow()}</span>
                                                        <div className="comment-content">
                                                            <React.Fragment>
                                                                {/* Hiển thị nội dung hoạt động cho công việc*/}
                                                                <div className="attach-file" style={{ marginTop: "-10px" }}>
                                                                    {/* <a href={item.file.url} download>{item.file.name}</a> */}
                                                                </div>
                                                                <ul className="list-inline" style={{ marginTop: '10px' }}>
                                                                    <li className="">
                                                                        <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}>
                                                                            <i className="fa fa-comments-o margin-r-5" /> Bình luận({item.comments.length}) &nbsp;
                                                                            {showChildComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </React.Fragment>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-group dropright">
                                                <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                    <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditAction(item._id)} >Sửa hành động</button>
                                                    <div class="dropdown-divider"></div>
                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteTaskAction(item._id, task._id)} >Xóa hành động</button>
                                                    <div class="dropdown-divider"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                        {editAction === item._id &&
                                            <React.Fragment>
                                                <div style={{ marginTop: "3%", marginLeft: "10%", width: "82%" }}>
                                                    <textarea
                                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', borderRadius: "18px" }}
                                                        defaultValue={item.description}
                                                        ref={input => this.newContentAction[item._id] = input}
                                                    />
                                                    <div className="row action-post">
                                                        <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                        <button style={{ width: "20%", marginRight: "2%" }} className="col-xs-3 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditAction(e, item._id)}>Gửi chỉnh sửa</button>
                                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditAction(e)}>Hủy bỏ</button>
                                                    </div>
                                                </div>
                                            </React.Fragment>}
                                        {/* Hiển thị bình luận cho hoạt động */}
                                        {showChildComment === item._id &&
                                            <div className="comment-content-child">
                                                {item.comments.map(child => {
                                                    console.log("Lap lan 1");
                                                    return <div className="col-sm-12 form-group margin-bottom-none" key={child._id} style={{ marginTop: "10px", marginLeft: "10px" }}>
                                                        <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "2%" }}>
                                                            <img className="img-circle img-bordered-sm"
                                                                src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                style={{ height: "30px", width: "30px" }} />
                                                        </div>
                                                        <div className="col-sm-11" style={{ marginBottom: "10px", borderRadius: "15px", backgroundColor: "#f2f3f5", width: "80%", marginLeft: "17px" }} >
                                                            <span className="username">
                                                                <a href="#abc">{item.creator.name}</a>
                                                            </span>
                                                            <p style={{ marginBottom: "-2px", fontFamily: 'inherit Helvetica, Arial, sans-serif', fontSize: "13px" }}>&nbsp;{child.content}</p>
                                                            {/* <a href={child.file.url} download>{child.file.name}</a> */}
                                                            <span className="description">{moment(child.createdAt).fromNow()}</span>

                                                        </div>
                                                        {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                            <div class="btn-group dropright">
                                                                <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                                    <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditActionComment(child._id)} >Sửa bình luận</button>
                                                                    <div class="dropdown-divider"></div>
                                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteActionComment(child._id, task._id)} >Xóa bình luận</button>
                                                                    <div class="dropdown-divider"></div>
                                                                </div>
                                                            </div>
                                                        }
                                                        {editComment === child._id &&
                                                            <React.Fragment>
                                                                <div style={{ width: "83%", marginLeft: "8.2%" }}>
                                                                    <textarea
                                                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px", borderRadius: "18px" }}
                                                                        defaultValue={child.content}
                                                                        ref={input => this.newContentCommentOfAction[child._id] = input}
                                                                    />
                                                                    <div className="row action-post" style={{ marginRight: "-4px", marginBottom: "10px", marginLeft: "5px" }}>
                                                                        <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                        <button style={{ width: "20%", marginRight: "2%" }} className="col-xs-3 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </div>;
                                                    return true;
                                                })
                                                }
                                                {/*Thêm bình luận cho hoạt động */}
                                                <div className="comment-child-action">
                                                    <form className="form-horizontal">
                                                        <div className="col-sm-12 margin-bottom-none" style={{ marginTop: "10px", marginLeft: "0.7%" }}>
                                                            <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                <img className="img-circle img-bordered-sm"
                                                                    src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                    style={{ height: "30px", width: "30px" }} />
                                                            </div>
                                                            <div className="col-sm-11" >
                                                                <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment"
                                                                    style={{ width: '92.5%', height: 40, fontSize: 13, border: '1px solid #dddddd', borderRadius: "18px", marginLeft: "1%" }} ref={input => this.contentCommentOfAction[item._id] = input} />
                                                                <div className="row action-post" style={{ width: "112%" }}>
                                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} style={{ marginLeft: "1%" }} />
                                                                    <button type="submit" style={{ width: "20%", marginRight: "2%", textAlign: "center", marginLeft: "50%",marginTop:"-4%" }} className="col-xs-2 col-xs-offset-7 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id, task._id)}>Gửi bình luận  </button>
                                                                    <button style={{ width: "16%", marginTop:"-4%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        }
                                    </div>;
                                    return true;
                                }) : null
                            }
                            {/* Thêm hoạt động cho công việc*/}
                            {this.props.role === "responsible" &&
                                <form className="form-horizontal" style={{ paddingTop: "2%" }}>
                                    <div className="form-group margin-bottom-none">
                                        <div className="row" style={{marginLeft:"3px"}}>
                                            <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                            </div>
                                            <div className="col-sm-9" style={{marginLeft:"19px", width:"81%"}} >
                                                <textarea placeholder="Hãy nhập nội dung hoạt động"
                                                    style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "0px" }}
                                                    ref={input => this.contentAction[0] = input} />

                                                <div className="row action-post" style={{ }}>
                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                    <button type="submit" style={{ width: "18%", marginRight: "2%", marginLeft: "-15%" }} className="col-xs-1 btn btn-success btn-sm" onClick={(e) => this.submitAction(e, null, 0, task._id)}>Thêm hoạt động</button>
                                                    <button style={{ width: "13%", }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleAction}>Hủy bỏ</button>
                                                </div>
                                            </div>
                                        </div>    
                                    </div>
                                </form>}
                        </div>
                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                taskComments.map(item => {
                                    // if (item.parent === null)
                                    return <div className="post clearfix" style={{ textAlign: 'left', width: "100%", marginTop: "1.5%", marginLeft: "15px", }} key={item._id}>
                                        <div className="row" style={{marginLeft:"-30px"}}>
                                            <div className="user-block col-sm-2" style={{ display: "inline-block" }}>
                                                <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                            </div>
                                            <div className="col-sm-9" style={{ backgroundColor: "#f2f3f5", borderRadius: "18px",marginLeft:"-50px"  }}>
                                                <div className="user-block" style={{ display: "inline-block", }}>
                                                    <span className="username" style={{ marginTop:"10px" }} >
                                                        <a href="#abc" style={{marginLeft:"-50px"}}>{item.creator.name}</a>
                                                    </span>
                                                    <p style={{ marginBottom: "2px", marginTop: "2px", fontFamily: 'inherit Helvetica, Arial, sans-serif', fontSize: "13px" }}>&nbsp;{item.content}</p>
                                                    <div className="row" style={{width:"250%",marginBottom:"-20px"}} >
                                                        <span className="description col-sm-5" style={{ marginLeft: "0px" }}>{moment(item.createdAt).fromNow()}</span>
                                                        <div className="comment-content">
                                                            <React.Fragment>
                                                                {/* Hiển thị nội dung hoạt động cho công việc*/}
                                                                <div className="attach-file" style={{ marginTop: "-10px" }}>
                                                                    {/* <a href={item.file.url} download>{item.file.name}</a> */}
                                                                </div>
                                                                <ul className="list-inline" style={{ marginTop: '10px',marginBottom:"10px" }}>
                                                                    <li className="">
                                                                        <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}>
                                                                            <i className="fa fa-comments-o margin-r-5" /> Bình luận({item.comments.length}) &nbsp;
                                                                        {showChildTaskComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </React.Fragment>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-group dropright col-sm-1" style={{padding:"0px"}}>
                                                <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                    <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditTaskComment(item._id)} >Sửa bình luận</button>
                                                    <div class="dropdown-divider"></div>
                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteTaskComment(item._id, task._id)} >Xóa bình luận</button>
                                                    <div class="dropdown-divider"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                        {editTaskComment === item._id &&
                                            <React.Fragment>
                                                <div style={{ marginTop: "3%", marginLeft: "10%", width: "82%" }}>
                                                    <textarea
                                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', borderRadius: "18px" }}
                                                        defaultValue={item.content}
                                                        ref={input => this.newContentTaskComment[item._id] = input}
                                                    />
                                                    <div className="row action-post">
                                                        <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                        <button style={{ width: "20%", marginRight: "2%" }} className="col-xs-3 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditTaskComment(e, item._id)}>Gửi chỉnh sửa</button>
                                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditTaskComment(e)}>Hủy bỏ</button>
                                                    </div>
                                                </div>
                                            </React.Fragment>}
                                        {/* Hiển thị bình luận cho hoạt động */}
                                        {showChildTaskComment === item._id &&
                                            <div className="comment-content-child">
                                                {item.comments.map(child => {
                                                    return <div className="col-sm-12 form-group margin-bottom-none" key={child._id} style={{ marginTop: "10px", }}>
                                                        <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "2%" }}>
                                                            <img className="img-circle img-bordered-sm"
                                                                src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                style={{ height: "30px", width: "30px" }} />
                                                        </div>
                                                        <div className="col-sm-11" style={{ marginBottom: "10px", borderRadius: "15px", backgroundColor: "#f2f3f5", width: "80%", marginLeft: "17px",padding:"8px",paddingLeft:"15px" }} >
                                                            <span className="username">
                                                                <a href="#abc">{item.creator.name}</a>
                                                            </span>
                                                            <p style={{ marginBottom: "-2px", fontFamily: 'inherit Helvetica, Arial, sans-serif', fontSize: "13px" }}>&nbsp;{child.content}</p>
                                                            {/* <a href={child.file.url} download>{child.file.name}</a> */}
                                                            <span className="description">{moment(child.createdAt).fromNow()}</span>

                                                        </div>
                                                        {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                            <div class="btn-group dropright">
                                                                <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                                    <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditCommentOfTaskComment(child._id)} >Sửa bình luận</button>
                                                                    <div class="dropdown-divider"></div>
                                                                    <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteCommentOfTaskComment(child._id, task._id)} >Xóa bình luận</button>
                                                                    <div class="dropdown-divider"></div>
                                                                </div>
                                                            </div>
                                                        }
                                                        {editCommentOfTaskComment === child._id &&
                                                            <React.Fragment>
                                                                <div style={{ width: "83%", marginLeft: "8.2%" }}>
                                                                    <textarea
                                                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px", borderRadius: "18px" }}
                                                                        defaultValue={child.content}
                                                                        ref={input => this.newContentCommentOfTaskComment[child._id] = input}
                                                                    />
                                                                    <div className="row action-post" style={{ marginRight: "-4px", marginBottom: "10px", marginLeft: "5px" }}>
                                                                        <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                        <button style={{ width: "20%", marginRight: "2%" }} className="col-xs-3 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditCommentOfTaskComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditCommentOfTaskComment(e)}>Hủy bỏ</button>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </div>;
                                                    return true;
                                                })
                                                }
                                                {/*Thêm bình luận cho bình luận */}
                                                <div className="comment-child-action">
                                                    <form className="form-horizontal">
                                                        <div className="col-sm-12 margin-bottom-none" style={{ marginTop: "10px" }}>
                                                            <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                <img className="img-circle img-bordered-sm"
                                                                    src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                    style={{ height: "30px", width: "30px" }} />
                                                            </div>
                                                            <div className="col-sm-11" >
                                                                <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment"
                                                                    style={{ width: '91.5%', height: 40, fontSize: 13, border: '1px solid #dddddd', borderRadius: "18px", marginLeft: "1%" }} ref={input => this.contentCommentOfTaskComment[item._id] = input} />
                                                                <div className="row action-post" style={{ width: "107%" }}>
                                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} style={{ marginLeft: "1%" }} />
                                                                    <button type="submit" style={{ width: "20%", marginRight: "2%", textAlign: "center", marginLeft: "50%",marginTop:"-4%" }} className="col-xs-2 col-xs-offset-7 btn btn-success btn-sm" onClick={(e) => this.submitCommentOfTaskComment(e, item._id, item._id, task._id)}>Gửi bình luận  </button>
                                                                    <button style={{ width: "16%",marginTop:"-4%" }} className="col-xs-2 btn btn-default btn-sm" >Hủy bỏ</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        }
                                    </div>;
                                    return true;
                                }) : null
                            }
                            {/* Thêm bình luận cho công việc*/}
                            {this.props.role === "responsible" &&
                                <form className="form-horizontal" style={{ paddingTop: "2%" }}>
                                    <div className="form-group margin-bottom-none">
                                        <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                            <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                        </div>
                                        <div className="col-sm-8" >
                                            <textarea placeholder="Hãy nhập nội dung hoạt động"
                                                style={{ width: '123%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "20px" }}
                                                ref={input => this.contentTaskComment[0] = input} />

                                            <div className="row action-post" style={{ width: "150%",marginLeft:"5px" }}>
                                                <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                <button type="submit" style={{ width: "18%", marginRight: "2%", marginLeft: "-15%" }} className="col-xs-1 btn btn-success btn-sm" onClick={(e) => this.submitTaskComment(e, null, 0, task._id)}>Thêm hoạt động</button>
                                                <button style={{ width: "13%", }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleAction}>Hủy bỏ</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>}
                        </div>
                        {/* Chuyển qua tab tài liệu */}
                        <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                            {/* <div id="content"> */}
                            <input type="file" name="files[]" id="filer_input2" multiple="multiple" />
                            {/* </div> */}
                        </div>
                        {/* Chuyển qua tab công việc con */}
                        <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">

                        </div>
                        {/* Chuyển qua tab Bấm giờ */}
                        <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                            <ul style={{ listStyle: "none" }}>
                                {
                                    logTimer &&
                                    logTimer.map(item =>
                                        <li className="list-log-timer" key={item._id}>
                                            <p style={{ fontSize: "15px" }}>{item.user.name} Bắt đầu: {this.format(item.start, 'H:i:s d-m-Y')} Kết thúc: {this.format(item.stopTimer, 'H:i:s d-m-Y')} Thời gian làm việc: {this.convertTime(item.time)}</p>
                                        </li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user, } = state;
    return { tasks, performtasks, user, };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getTaskById: taskManagementActions.getTaskById,
    addActionComment: performTaskAction.addActionComment,
    editActionComment: performTaskAction.editActionComment,
    deleteActionComment: performTaskAction.deleteActionComment,
    getTaskActions: performTaskAction.getTaskActions,
    addTaskAction: performTaskAction.addTaskAction,
    editTaskAction: performTaskAction.editTaskAction,
    deleteTaskAction: performTaskAction.deleteTaskAction,
    startTimer: performTaskAction.startTimerTask,
    pauseTimer: performTaskAction.pauseTimerTask,
    continueTimer: performTaskAction.continueTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getLogTimer: performTaskAction.getLogTimerTask,
    getStatusTimer: performTaskAction.getTimerStatusTask,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalOfResponsible,
    getTaskComments: performTaskAction.getTaskComments,
    editTaskComment: performTaskAction.editTaskComment,
    deleteTaskComment: performTaskAction.deleteTaskComment,
    createTaskComment: performTaskAction.createTaskComment,
    createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
    editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
    deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }


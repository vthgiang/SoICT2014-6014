import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    getStorage
} from '../../../../config';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { managerKpiActions } from "../../../kpi/employee/management/redux/actions";
import Rating from 'react-rating'
import moment from 'moment'
import Files from 'react-files'
class ActionTab extends Component {
    constructor(props) {
        var idUser = getStorage("userId");
        super(props);
        this.state = {
            currentUser: idUser,
            selected: "taskAction",
            comment: false,
            action: false,
            editComment: "",
            valueRating:2.5,
            files: [],
            editAction: "",
            editTaskComment: "",
            editCommentOfTaskComment: "",
            pauseTimer: false,
            showChildComment: "",
            showChildTaskComment: "",
            newCommentOfAction: {
                creator: idUser,
                content: "",
                files: null,
                taskActionId: null
            },
            newAction: {
                creator: idUser,
                content: "",
                files: null
            },
            newTaskComment: {
                creator: idUser,
                content: "",
            },
            newCommentOfTaskComment: {
                creator: idUser,
                content: "",
            },
            showEdit: false,
            timer: {
                startTimer: "",
                stopTimer: null,
                user: idUser,
                time: 0,
            },
            evaluations: {
                creator: idUser,
            },
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

    }
    componentDidUpdate() {
        if (this.props.id !== undefined) {
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
            
            this.props.getTimesheetLogs(nextProps.id);
            this.props.getTaskById(nextProps.id);
            this.props.getTaskActions(nextProps.id);
            this.props.getStatusTimer(nextProps.id);
            this.props.getTaskComments(nextProps.id)
            // return true;
        }
        return true;
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
    setValueRating = async (id,newValue) => {
        
        await this.setState(state => {
            return {
                ...state,
                valueRating: newValue,
                evaluations: {
                    ...state.evaluations,
                    rating: newValue*2
                }
            }
        })
        var {evaluations} = this.state;
        console.log(evaluations)
        if(evaluations.rating){
            
            this.props.evaluationAction(id,evaluations);
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
                    task: taskId,
                    files: this.state.files
                }
            }
        })
        var { newAction } = this.state;
        console.log(this.state);
        

        const data = new FormData();
        data.append("task", newAction.task);
        data.append("creator", newAction.creator);
        data.append("content", newAction.content);
        newAction.files.forEach(x=>{
            data.append("files", x);
        })
        //Xóa file đã được chọn mỗi khi gửi hoạt động
        this.state.files.forEach(item=>{
            this.refs.files.removeFile(item)
        })
        if(newAction.creator && newAction.content){
            
            this.props.addTaskAction(data);
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
        
        if (newCommentOfTaskComment.content) {
            this.props.editCommentOfTaskComment(index, newCommentOfTaskComment);
        }
    }
    handleEvaluationAction = async (e,id,status) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                evaluations: {
                    ...state.evaluations,
                    status: status
                }
            }
        })
        var {evaluations} = this.state;
        if(evaluations.status){
            this.props.evaluationAction(id,evaluations);
        }
    }  
    handleConfirmAction = async (e,actionId,userId) => {
        e.preventDefault();
        this.props.confirmAction(actionId,userId)
    }
    onFilesChange = (files) => {
        this.setState({
          files
        }, () => {
          console.log(this.state.files)
        })
      }
    
    onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
    }

    filesRemoveOne = (file) => {
    this.refs.files.removeFile(file)
    }
    // filesRemoveAll = () => {
    // this.refs.files.removeFiles()
    // }

    // filesUpload = () => {
    // const formData = new FormData()
    // Object.keys(this.state.files).forEach((key) => {
    //     const file = this.state.files[key]
    //     formData.append(key, new Blob([file], { type: file.type }), file.name || 'file')
    // })}
    
    render() {
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask;
        const { tasks, performtasks, user } = this.props; 
        var taskInfo, actionComments, taskActions,taskComments, actions,logTimer;
        const { selected,comment, editComment, showChildComment, editAction, action,editTaskComment,showChildTaskComment,editCommentOfTaskComment,valueRating,currentUser,hover } = this.state;
        
        const checkUserId = obj =>  obj.creator._id === currentUser;
        if(typeof tasks.task !== 'undefined' && tasks.task !== null) taskInfo = tasks.task.info
        console.log(taskInfo)
        if (typeof performtasks.taskcomments !== 'undefined' && performtasks.taskcomments !== null) taskComments = performtasks.taskcomments;
        if (typeof performtasks.taskactions !== 'undefined' && performtasks.taskactions !== null) taskActions = performtasks.taskactions;
        if (performtasks.logtimer) logTimer = performtasks.logtimer; 
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
                                    return <div className="post clearfix"  key={item._id}>
                                        <div class="user-block" style={{marginBottom:"10px"}}>
                                            <img class="img-circle img-bordered-sm" src="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/67683193_1564884113669140_2021053726499799040_o.jpg?_nc_cat=101&_nc_sid=110474&_nc_ohc=8bb8KMlozUIAX_zBgVb&_nc_ht=scontent.fhan2-1.fna&oh=1222d67f501934703ccc77c6e5d8fd99&oe=5EEA69F8" alt="User Image" />
                                                <span class="username">
                                                    <a href="#">{item.creator? item.creator.name : ""}</a>
                                                    {/* <a href="#" class="pull-right btn-box-tool btn dropdown-toggle" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></a> */}
                                                    
                                                    {this.props.role === 'responsible' && <div class="btn-group dropleft pull-right">
                                                        <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                            <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditAction(item._id)} >Sửa hành động</button>
                                                            <div class="dropdown-divider"></div>
                                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteTaskAction(item._id, task._id)} >Xóa hành động</button>
                                                            <div class="dropdown-divider"></div>
                                                            
                                                        </div>
                                                    </div>}
                                                </span>
                                            <span class="description">{moment(item.createdAt).fromNow()}</span>
                                        </div>
                                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                                            {item.description}
                                        </p>
                                        <div>{item.files.length>0?item.files[0].url:null}</div>
                                        <ul class="list-inline">
                                            <li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>
                                            <li><a href="#" class="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i class="fa fa-comments-o margin-r-5"></i> Bình luận({item.comments.length}) &nbsp;</a></li>
                                            {(item.creator === undefined && this.props.role ==="responsible") &&
                                            <li><a href="#" class="link-black text-sm" onClick={(e) => this.handleConfirmAction(e,item._id, currentUser)}><i class="fa fa-check-circle" aria-hidden="true"></i> Xác nhận hoạt động</a></li>}
                                            {(this.props.role === "accountable" || this.props.role === "consulted" || this.props.role === "creator" || this.props.role === "informed") &&
                                            <React.Fragment>
                                            <li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Đánh giá: </a></li>
                                            <li style={{display:"inline-table"}}>
                                                {typeof item.evaluations !== 'undefined' && item.evaluations.length !== 0 ?
                                                    <React.Fragment>
                                                        
                                                        {item.evaluations.some(checkUserId)=== true ?
                                                            <React.Fragment>
                                                                {item.evaluations.map(element => {
                                                                    if(taskInfo){
                                                                        if(taskInfo.accountableEmployees.some(obj => obj._id === element.creator._id)){
                                                                            return <div> <b><u> {element.creator.name} đánh giá {element.rating}/10 </u></b> </div>
                                                                        }else{
                                                                            return <div> {element.creator.name} đánh giá {element.rating}/10  </div>
                                                                        }
                                                                    }

                                                                })}
                                                            </React.Fragment>:
                                                            <React.Fragment>
                                                                <Rating
                                                                    fractions = {2}
                                                                    emptySymbol="fa fa-star-o fa-2x"
                                                                    fullSymbol="fa fa-star fa-2x"
                                                                    initialRating = {0}
                                                                    onClick={(value) => {
                                                                    this.setValueRating(item._id,value);
                                                                    }}
                                                                    
                                                                />
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>:
                                                    <React.Fragment>
                                                        <Rating
                                                            fractions = {2}
                                                            emptySymbol="fa fa-star-o fa-2x"
                                                            fullSymbol="fa fa-star fa-2x"
                                                            initialRating = {0}
                                                            onClick={(value) => {
                                                            this.setValueRating(item._id,value);
                                                            }}
                                                            
                                                        />
                                                    </React.Fragment>}
                                            </li></React.Fragment>}
                                        </ul>
                                            
                                        
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
                                            <div>
                                                {item.comments.map(child => {
                                                    return <div className="col-sm-12 form-group margin-bottom-none" key={child._id} style={{ marginTop: "10px", marginLeft: "10px" }}>
                                                        <div class="user-block" style={{marginBottom:"10px"}}>
                                                            <img class="img-circle img-bordered-sm" src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/97006891_2717126238515406_5886747261832003584_n.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=aqjZiblGPY8AX89nbir&_nc_ht=scontent.fhan2-3.fna&oh=4b186ff3ba6be7421c9494df2b81834a&oe=5EE8ECB5" style={{ height: "40px", width: "40px" }} alt="User Image" />
                                                                <span class="username">
                                                                    <a href="#">{child.creator.name}</a>
                                                                    {child.creator._id === currentUser && 
                                                                    <div class="btn-group dropleft pull-right">
                                                                        <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                                            <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                        <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditActionComment(child._id)} >Sửa bình luận</button>
                                                                            <div class="dropdown-divider"></div>
                                                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteActionComment(child._id, task._id)} >Xóa bình luận</button>
                                                                            <div class="dropdown-divider"></div>
                                                                            
                                                                        </div>
                                                                    </div>}
                                                                </span>
                                                            <span class="description">{moment(child.createdAt).fromNow()}</span>
                                                        </div>
                                                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                                                            {child.content}
                                                        </p>
                                                        
                                                        {editComment === child._id &&
                                                            <React.Fragment>
                                                                <div style={{ width: "83%", marginLeft: "8.2%" }}>
                                                                    <textarea
                                                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px", borderRadius: "18px"  }}
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
                                                                    src="https://scontent.fhan2-4.fna.fbcdn.net/v/t1.0-1/c342.0.1365.1365a/95803940_1693154607513079_1901501950311006208_o.jpg?_nc_cat=110&_nc_sid=dbb9e7&_nc_ohc=2PAqz2ywXeEAX_he0l0&_nc_ht=scontent.fhan2-4.fna&oh=38c1fe7039904f0854258d1c99a1a123&oe=5EEB1B63" alt="user avatar"
                                                                    style={{ height: "30px", width: "30px" }} />
                                                            </div>
                                                            <div className="col-sm-11" >
                                                                <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment"
                                                                    style={{ width: '92.5%', height: 40, fontSize: 13, border: '1px solid #dddddd', borderRadius: "18px", marginLeft: "1%" }} ref={input => this.contentCommentOfAction[item._id] = input} />
                                                                <div className="row action-post" style={{ width: "112%" }}>
                                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} style={{ marginLeft: "1%" }} />
                                                                    <button type="submit" style={{ width: "auto", marginTop:"-28px" }} className="col-xs-2 col-xs-offset-7 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id, task._id)}>Gửi bình luận  </button>
                                                                    {/* <button style={{ width: "16%", marginTop:"-4%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button> */}
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
                            <React.Fragment>
                                <div class="user-block">
                                <img className="img-circle img-bordered-sm" src="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/67683193_1564884113669140_2021053726499799040_o.jpg?_nc_cat=101&_nc_sid=110474&_nc_ohc=8bb8KMlozUIAX_zBgVb&_nc_ht=scontent.fhan2-1.fna&oh=1222d67f501934703ccc77c6e5d8fd99&oe=5EEA69F8" alt="user avatar" />
                                    <span class="username">
                                        <textarea placeholder="Hãy nhập nội dung hoạt động"
                                            style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "0px",padding:"10px 0px 0px 5px",borderRadius:"15px" }}
                                            ref={input => this.contentAction[0] = input} /> 
                                    </span>
                                </div>
                                <div className="row action-post" style={{width:"110%" }}>
                                {this.state.files.length > 0 ?
                                    <div className='files-list'>
                                        <ul style={{listStyle: 'none',marginLeft:'25px'}}>{this.state.files.map((file) =>
                                            <li className='files-list-item' key={file.id}>
                                                <div className='files-list-item-preview' style={{width:"92%"}}>
                                                {file.preview.type === 'image' ?  
                                                <React.Fragment>
                                                    <img className='files-list-item-preview-image' style={{width:"20%"}} src={file.preview.url} />
                                                </React.Fragment>    
                                                : 
                                                <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                    <a href="#" class="pull-right btn-box-tool" onClick={this.filesRemoveOne.bind(this, file)}><i class="fa fa-times"></i></a>
                                                </div>
                                                <div className='files-list-item-content'>
                                                    <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                                    <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                                </div>
                                            </li>
                                        )}
                                        </ul>
                                    </div>:null} 
                                    <div className="files col-xs-1" style={{}}>
                                        <Files
                                        ref='files'
                                        className='files-dropzone-list'
                                        style={{ height: '20px' }}
                                        onChange={this.onFilesChange}
                                        onError={this.onFilesError}
                                        multiple
                                        maxFiles={10}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable
                                        >
                                        <button className="btn btn-primary" style={{marginLeft:"50px"}}>Upload file</button>
                                        </Files>
                                    </div>   
                                    <button type="submit" style={{ marginLeft:"120px" }} className="btn btn-success" onClick={(e) => this.submitAction(e, null, 0, task._id)}>Thêm hoạt động</button>
                                </div>
                            </React.Fragment>}
                        </div>
                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                taskComments.map(item => {
                                    // if (item.parent === null)
                                    return <div className="post clearfix"  key={item._id}>
                                        <div class="user-block">
                                            <img class="img-circle img-bordered-sm" src="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/67683193_1564884113669140_2021053726499799040_o.jpg?_nc_cat=101&_nc_sid=110474&_nc_ohc=8bb8KMlozUIAX_zBgVb&_nc_ht=scontent.fhan2-1.fna&oh=1222d67f501934703ccc77c6e5d8fd99&oe=5EEA69F8" alt="User Image" />
                                                <span class="username">
                                                <a href="#">{item.creator.name}</a>
                                                {item.creator._id === currentUser && 
                                                <div class="btn-group dropleft pull-right">
                                                    <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                        <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                        <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditTaskComment(item._id)} >Sửa bình luận</button>
                                                        <div class="dropdown-divider"></div>
                                                        <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteTaskComment(item._id, task._id)} >Xóa bình luận</button>
                                                        <div class="dropdown-divider"></div>
                               
                                                    </div>
                                                </div>}
                                                </span>
                                            <span class="description">{moment(item.createdAt).fromNow()}</span>
                                        </div>
                                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                                            {item.content}
                                        </p>
                                        <ul class="list-inline">
                                            <li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>
                                            <li><a href="#" class="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i class="fa fa-comments-o margin-r-5"></i> Bình luận({item.comments.length}) &nbsp;</a></li>
                                        </ul>
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
                                                        <div class="user-block" style={{marginBottom:"10px"}}>
                                                            <img class="img-circle img-bordered-sm" src="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/67683193_1564884113669140_2021053726499799040_o.jpg?_nc_cat=101&_nc_sid=110474&_nc_ohc=8bb8KMlozUIAX_zBgVb&_nc_ht=scontent.fhan2-1.fna&oh=1222d67f501934703ccc77c6e5d8fd99&oe=5EEA69F8" style={{ height: "40px", width: "40px" }} alt="User Image" />
                                                                <span class="username">
                                                                    <a href="#">{child.creator.name}</a>
                                                                    {child.creator._id === currentUser && <div class="btn-group dropleft pull-right">
                                                                    <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                                                        <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                                                        <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.handleEditCommentOfTaskComment(child._id)} >Sửa bình luận</button>
                                                                        <div class="dropdown-divider"></div>
                                                                        <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} onClick={() => this.props.deleteCommentOfTaskComment(child._id, task._id)} >Xóa bình luận</button>
                                                                        <div class="dropdown-divider"></div>
                                                                    </div>
                                                    </div>}
                                                                </span>
                                                            <span class="description">{moment(child.createdAt).fromNow()}</span>
                                                        </div>
                                                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                                                            {child.content}
                                                        </p>
                                                        
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
                                                                    src="https://scontent.fhan2-4.fna.fbcdn.net/v/t1.0-1/c342.0.1365.1365a/95803940_1693154607513079_1901501950311006208_o.jpg?_nc_cat=110&_nc_sid=dbb9e7&_nc_ohc=2PAqz2ywXeEAX_he0l0&_nc_ht=scontent.fhan2-4.fna&oh=38c1fe7039904f0854258d1c99a1a123&oe=5EEB1B63" alt="user avatar"
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
                            <div class="user-block">
                                <img class="img-circle img-bordered-sm" src="../../dist/img/user7-128x128.jpg" alt="User Image" />
                                    <span class="username">
                                    <textarea placeholder="Hãy nhập nội dung hoạt động"
                                                style={{ width: '123%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "20px" }}
                                                ref={input => this.contentTaskComment[0] = input} />

                                    </span>
                            </div>
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
                            <ul style={{ listStyle: "none",fontFamily:'sans-serif' }}>
                                {
                                    logTimer &&
                                    logTimer.map(item =>
                                        <li className="list-log-timer" key={item._id}>
                                            <p style={{ fontSize: "15px" }}>{item.creator.name} : Bắt đầu: {moment(item.startedAt, "x").format("DD MMM YYYY hh:mm a")} - Kết thúc: {moment(item.stoppedAt).format("DD MMM YYYY hh:mm a")} Thời gian làm việc: {moment.utc(item.duration, "x").format('HH:mm:ss')} </p>
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
    addActionComment: performTaskAction.addActionComment,
    editActionComment: performTaskAction.editActionComment,
    deleteActionComment: performTaskAction.deleteActionComment,
    getTaskActions: performTaskAction.getTaskActions,
    addTaskAction: performTaskAction.addTaskAction,
    editTaskAction: performTaskAction.editTaskAction,
    deleteTaskAction: performTaskAction.deleteTaskAction,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getStatusTimer: performTaskAction.getTimerStatusTask,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalOfResponsible,
    getTaskComments: performTaskAction.getTaskComments,
    editTaskComment: performTaskAction.editTaskComment,
    deleteTaskComment: performTaskAction.deleteTaskComment,
    createTaskComment: performTaskAction.createTaskComment,
    createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
    editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
    deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment,
    evaluationAction: performTaskAction.evaluationAction,
    confirmAction: performTaskAction.confirmAction
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }


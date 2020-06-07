import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {ContentMaker} from '../../../../common-components'

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
import TextareaAutosize from 'react-textarea-autosize';
import { LOCAL_SERVER_API } from '../../../../env';
import './actionTab.css';
import { DocumentActions } from '../../../document/redux/actions'
import { SubTaskTab } from './subTaskTab';
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
            hover: {},
            filestask:[],
            commentfiles:[],
            taskcommentfiles: [],
            cmtoftaskcmtfiles: [],
            editAction: "",
            editTaskComment: "",
            editCommentOfTaskComment: "",
            pauseTimer: false,
            showChildComment: "",
            showChildTaskComment: "",
            showEvaluations: [],
            newCommentOfAction: {
                creator: idUser,
                description: "",
                files: null,
                taskActionId: null
            },
            newAction: {
                creator: idUser,
                description: "",
                files: []
            },
            newTaskComment: {
                creator: idUser,
                description: "",
            },
            newCommentOfTaskComment: {
                creator: idUser,
                description: "",
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
            value: '',
			rows: 3,
			minRows: 3,
            maxRows: 25,
            showfile:[],
            descriptionFile : ""
        };
        this.hover =[];
        this.contentTaskComment= [];
        this.contentCommentOfAction= [];
        this.newContentCommentOfAction = [];
        this.contentAction = [];
        this.newContentAction = [];
        this.newContentTaskComment= [];
        this.contentCommentOfTaskComment= [];
        this.newContentCommentOfTaskComment= [];
        this.descriptionFile = []

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
            this.props.getStatusTimer(nextProps.id);
            this.props.getSubTask(nextProps.id);
            // return true;
            return true;
        }
        if(nextProps.performtasks.taskActions !== this.props.performtasks.taskActions){      
            this.props.getTaskById(nextProps.id);
            return true;
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
    setHover = async (id,value) =>{
        if(isNaN(value)){
            this.hover[id] = 0;
        }else this.hover[id] = value*2;
        
        await this.setState(state => {
            return {
                ...state,
                hover : {
                    ...state.hover,
                    id:value
                }
            }
        })
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
                    description: this.contentCommentOfAction[index].value,
                    taskActionId: id,
                    task: taskId,
                    commentfiles : this.state.commentfiles
                }
            }
        })
        var { newCommentOfAction } = this.state;
        
        const data = new FormData();
        data.append("task", newCommentOfAction.task);
        data.append("creator", newCommentOfAction.creator);
        data.append("description", newCommentOfAction.description);
        data.append("taskActionId",newCommentOfAction.taskActionId )
        newCommentOfAction.commentfiles.forEach(x=>{
            data.append("files", x);
        })
        if (newCommentOfAction.task && newCommentOfAction.description && newCommentOfAction.creator) {

            this.props.addActionComment(data);
            if(this.state.commentfiles){
                this.state.commentfiles.forEach(item=>{
                    this.refs.filesAddAction1.removeFile(item)
                })
            }
        }
        this.contentCommentOfAction[index].value = "";
    }
    //Thêm mới hoạt động
    submitAction = async (taskId) => {
        var { newAction } = this.state;
        const data = new FormData();

        data.append("task", taskId);
        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        newAction.files && newAction.files.forEach(x=>{
            data.append("files", x);
        })
        
        if(newAction.creator && newAction.description){
            this.props.addTaskAction(data);
        }

        // Reset state cho việc thêm mới action
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    description: "",
                    files: [],
                },
            }
        })
    }
    //Thêm mới bình luận của công việc
    submitTaskComment = async (e,id,index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    description: this.contentTaskComment[index].value,
                    task: taskId,
                    files: this.state.taskcommentfiles
                }
            }
        })
        var { newTaskComment } = this.state;

        const data = new FormData();
        data.append("task", newTaskComment.task);
        data.append("creator", newTaskComment.creator);
        data.append("description", newTaskComment.description);
        newTaskComment.files.forEach(x=>{
            data.append("files", x);
        })
        if (newTaskComment.description && newTaskComment.creator) {
            this.props.createTaskComment(data);
            if(this.state.taskcommentfiles){
                this.state.taskcommentfiles.forEach(item=>{
                    this.refs.filesAddComment.removeFile(item)
                })
            }
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
                    description: this.contentCommentOfTaskComment[index].value,
                    task: taskId,
                    id: id,
                    files : this.state.cmtoftaskcmtfiles
                }
            }
        })
        var { newCommentOfTaskComment } = this.state;
        const data = new FormData();
        data.append("task", newCommentOfTaskComment.task);
        data.append("creator", newCommentOfTaskComment.creator);
        data.append("description", newCommentOfTaskComment.description);
        data.append("id", newCommentOfTaskComment.id);
        newCommentOfTaskComment.files.forEach(x=>{
            data.append("files", x);
        })
        if (newCommentOfTaskComment.description && newCommentOfTaskComment.creator) {
            this.props.createCommentOfTaskComment(data);
            if(this.state.cmtoftaskcmtfiles){
                this.state.cmtoftaskcmtfiles.forEach(item=>{
                    this.refs.filescmtoftaskcmt.removeFile(item)
                })
            }
        }
        this.contentCommentOfTaskComment[index].value = "";
    }
    handleUploadFile   = async (task,index,creator) => {
        const data  = new FormData();

        this.state.filestask.forEach(x => {
            data.append("files",x)
        })
        data.append("description",this.descriptionFile[index].value)
        data.append("creator",creator)
        if(this.state.filestask){
            this.props.uploadFile(task,data);
                this.refs.filesAddTask.removeFiles()
        }
        this.descriptionFile[index].value = ""
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
                    description: this.newContentCommentOfAction[index].value,
                    // file:
                },
                editComment: ""
            }
        })
        var { newCommentOfAction } = this.state;
        if (newCommentOfAction.description) {
            this.props.editActionComment(index, newCommentOfAction);
        }
    }
    handleSaveEditAction = async (e, index) => {
        e.preventDefault();
        let description = this.newContentAction[index].value;
        if (description) {
            this.props.editTaskAction(index, {description: description});
            await this.setState(state => {
                return {
                    ...state,
                    editAction: ""
                }
            })
        }

    }
    handleSaveEditTaskComment = async (e,index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    description: this.newContentTaskComment[index].value,
                    // file:
                },
                editTaskComment: ""
            }
        })
        var { newTaskComment } = this.state;
        if (newTaskComment.description) {
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
                    description: this.newContentCommentOfTaskComment[index].value,
                    id : index
                },
                editCommentOfTaskComment: ""
            }
        })
        var { newCommentOfTaskComment } = this.state;
        
        if (newCommentOfTaskComment.description) {
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
    handleChange = (event) => {

		const textareaLineHeight = 13;
		const { minRows, maxRows } = this.state;
        const previousRows = event.target.rows;//3
  	    event.target.rows = minRows; // reset number of rows in textarea 
        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

		if (currentRows >= maxRows) {
			event.target.rows = maxRows;
			event.target.scrollTop = event.target.scrollHeight;
		}
    
  	this.setState({
    	value: event.target.value,
        rows: currentRows < maxRows ? currentRows : maxRows,
    });
	};
    onFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    files: files,
                }
            }
        })
      }
    onTaskCommentFilesChange = (files) => {
        this.setState({
          taskcommentfiles: files
        })
      }  
    onCommentFilesChange = (commentfiles) => {
        this.setState({
            commentfiles
        })
      }
    onCommentOfTaskCommentFilesChange = (cmtoftaskcmtfiles) => {
        this.setState({
            cmtoftaskcmtfiles
        })
      }  

    onFilesTaskChange  = (filestask) => {
        this.setState({
            filestask:filestask
        })
    }
    onFilesError = (error, file) => {
    }

    filesRemoveOne = (file) => {
    this.refs.filesAddAction.removeFile(file)
    }
    filesRemoveAll = () => {
    this.refs.filesAddAction.removeFiles()
    }
    requestDownloadFile = (e,path,fileName) => {
        
        e.preventDefault();
        this.props.downloadFile(path,fileName);

        
    }
    handleShowFile =  (id) => {
        var a
        if(this.state.showfile.some(obj => obj === id)){
            a= this.state.showfile.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showfile : a
                }
            })
        }else {
            this.setState(state => {
                return {
                    ...state,
                showfile: [...this.state.showfile,id]
                }
            })
        }
    }
    handleShowEvaluations = (id) => {
        var a
        if(this.state.showEvaluations.some(obj => obj === id)){
            a= this.state.showEvaluations.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showEvaluations : a
                }
            })
        }else {
            this.setState(state => {
                return {
                    ...state,
                    showEvaluations: [...this.state.showEvaluations,id]
                }
            })
        }
    }
    render() {
        const { translate } = this.props;
        var type = ["actions","commentofactions","taskcomments","commentoftaskcomments"]
        var task, actions, informations;
        var statusTask,files;
        const { tasks, performtasks, user,auth } = this.props;
        const subtasks = tasks.subtasks;
        var actionComments, taskActions,taskComments, actions,logTimer;
        const { showEvaluations, selected,comment, editComment, showChildComment, editAction, action,editTaskComment,showChildTaskComment,editCommentOfTaskComment,valueRating,currentUser,hover } = this.state;
        const checkUserId = obj =>  obj.creator._id === currentUser;
        if(typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
            task = performtasks.task.info;
            taskComments = task.taskComments;
            taskActions = task.taskActions;
            files = task.files
        }
        if (performtasks.logtimer) logTimer = performtasks.logtimer; 
        return (
            <div>
                <div className="nav-tabs-custom" style={{boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none"}}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">Hoạt động  ({taskActions && taskActions.length})</a></li>
                        <li><a href="#actionComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">Trao đổi ({taskComments && taskComments.length})</a></li>
                        <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">Tài liệu ({files && files.length})</a></li>
                        <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">Lịch sử bấm giờ ({logTimer && logTimer.length})</a></li>
                        <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">Công việc con ({subtasks && subtasks.length})</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                            {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                                // Hiển thị hoạt động của công việc
                                taskActions.map(item => {
                                    // if (item.parent === null)
                                    return (
                                    <div className="clearfix"  key={item._id}>
                                        {item.creator ?
                                        <img className="user-img-level1" src={(LOCAL_SERVER_API+item.creator.avatar)} alt="User Image" /> :
                                        <div className="user-img-level1" />
                                        }
                                        {editAction !== item._id && // khi chỉnh sửa thì ẩn action hiện tại đi
                                        <React.Fragment>
                                            <p className="content-level1" data-width="100%">
                                                {item.creator?
                                                <a href="#">{item.creator.name} </a>:
                                                item.name && <b>{item.name} </b>}
                                                {item.description}
                                                {(this.props.role === 'responsible' && item.creator) && <div className="btn-group dropleft pull-right">
                                                    <button className="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" >
                                                        <svg className="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <div className="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.handleEditAction(item._id)} >Sửa hành động</button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item btn-primary-outline" type="button"  onClick={() => this.props.deleteTaskAction(item._id, task._id)} >Xóa hành động</button>
                                                        <div className="dropdown-divider"></div>
                                                    </div>
                                                </div>}                 
                                            </p>

                                            {/* Các file đính kèm */}
                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>

                                                
                                                {((item.creator === undefined || item.creator === null) && this.props.role ==="responsible") &&
                                                <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleConfirmAction(e,item._id, currentUser)}><i className="fa fa-check-circle" aria-hidden="true"></i> Xác nhận hoàn thành</a></li>}

                                                {/* Các chức năng tương tác với action */}
                                                {item.creator &&
                                                <React.Fragment>
                                                    <li><a href="#" className="link-black text-sm" onClick={()=>{this.handleShowEvaluations(item._id)}}><i className="fa fa-thumbs-o-up margin-r-5"></i>Đánh giá ({item.evaluations && item.evaluations.length})</a></li>

                                                    {(this.props.role === "accountable" || this.props.role === "consulted" || this.props.role === "creator" || this.props.role === "informed") &&
                                                    <li style={{display:"inline-table"}} className="list-inline">
                                                        {(
                                                            (item.evaluations && item.evaluations.length !== 0 && !item.evaluations.some(checkUserId)) ||
                                                            (!item.evaluations || item.evaluations.length === 0)
                                                        ) &&
                                                            <React.Fragment>
                                                                <Rating
                                                                    
                                                                    fractions = {2}
                                                                    emptySymbol="fa fa-star-o fa-2x"
                                                                    fullSymbol="fa fa-star fa-2x"
                                                                    initialRating = {0}
                                                                    onClick={(value) => {
                                                                    this.setValueRating(item._id,value);
                                                                    }}
                                                                    onHover={(value)=> {                                                                                                                                                   
                                                                        this.setHover(item._id,value)
                                                                    }}
                                                                />
                                                                <div style={{display:"inline",marginLeft:"5px"}}>{this.hover[item._id]}</div> 
                                                            </React.Fragment>
                                                        }
                                                    </li>
                                                    }

                                                    {item.files && item.files.length && // Chỉ hiện show file khi có file đính kèm
                                                    <li style={{display:"inline-table"}}>
                                                        <a href="#" className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><i class="fa fa-paperclip" aria-hidden="true"></i> File đính kèm ({item.files && item.files.length})</a>
                                                    </li>
                                                    }

                                                    <li><a href="#" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận ({item.comments.length}) &nbsp;</a></li>
                                                </React.Fragment>
                                                }
                                            </ul>
                                            
                                            
                                            <div className="tool-level1" style={{paddingLeft: 5}}>
                                                {/* Các kết quả đánh giá của action */}
                                                {showEvaluations.some(obj => obj === item._id)&&
                                                    <React.Fragment>
                                                        <div style={{marginBottom: 10}}>
                                                            {typeof item.evaluations !== 'undefined' && item.evaluations.length !== 0 &&
                                                            item.evaluations.map(element => {
                                                                if(task){
                                                                    if(task.accountableEmployees.some(obj => obj._id === element.creator._id)){
                                                                        return <div> <b>{element.creator.name} - {element.rating}/10 </b> </div>
                                                                    }
                                                                    if(task.accountableEmployees.some(obj => obj._id !== element.creator._id)) {
                                                                        return <div> {element.creator.name} - {element.rating}/10 </div>
                                                                    }
                                                                }
                                                            })
                                                            }
                                                        </div>
                                                    </React.Fragment>
                                                }

                                                {/* Các file đính kèm của action */}
                                                {this.state.showfile.some(obj => obj === item._id ) &&
                                                    <div>
                                                        {item.files.map(elem => {
                                                            return <div><a href="#" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                        })}
                                                    </div>
                                                }
                                            </div>
                                        </React.Fragment>
                                        }

                                        {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                        {editAction === item._id &&
                                            <div>
                                                <div className="text-input-level1">
                                                    <textarea
                                                        defaultValue={item.description}
                                                        ref={input => this.newContentAction[item._id] = input}
                                                    />
                                                </div>
                                                <ul className="list-inline tool-level1 pull-right">
                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleSaveEditAction(e, item._id)}>Gửi chỉnh sửa</a></li>
                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleEditAction(e)}>Hủy bỏ</a></li>
                                                </ul>
                                        
                                            </div>}
                                        

                                        {/* Hiển thị bình luận cho hoạt động */}
                                        {showChildComment === item._id &&
                                            <div>
                                                {item.comments.map(child => {
                                                    return <div  key={child._id}>
                                                        <img className="user-img-level2" src={(LOCAL_SERVER_API+child.creator.avatar)} alt="User Image" />
                                                        
                                                        {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                                        <div>
                                                            <p className="content-level2">
                                                                <a href="#">{child.creator.name} </a>
                                                                {child.description}

                                                                {child.creator._id === currentUser && 
                                                                <div className="btn-group dropleft pull-right">
                                                                    <button className="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" >
                                                                        <svg className="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.handleEditActionComment(child._id)} >Sửa bình luận</button>
                                                                        <div className="dropdown-divider"></div>
                                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.props.deleteActionComment(child._id, task._id)} >Xóa bình luận</button>
                                                                        <div className="dropdown-divider"></div>
                                                                        
                                                                    </div>
                                                                </div>}
                                                            </p>
                                                            {/* <div className="tool-level2">
                                                                <span className="text-sm">{moment(child.createdAt).fromNow()}</span>
                                                            </div> */}
                                                            <ul className="list-inline tool-level2">
                                                                    <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                    <li style={{display:"inline-table"}}>
                                                                    <div><a href="#" className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                                    {this.state.showfile.some(obj => obj === child._id ) &&
                                                                        <li style={{display:"inline-table"}}>
                                                                        {child.files.map(elem => {
                                                                            return <div><a href="#" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                                        })}
                                                                        </li>
                                                                    }

                                                            </ul>
                                                        </div>
                                                        }
                                                        
                                                        {/*Chỉnh sửa nội dung bình luận của hoạt động */}
                                                        {editComment === child._id &&
                                                            <div>
                                                                <div className="text-input-level2">
                                                                    <textarea
                                                                        rows={this.state.rows}
                                                                        placeholder={'Enter your text here...'}
                                                                        className={'textarea'}
                                                                        onChange={this.handleChange}
                                                                        defaultValue={child.description}
                                                                        ref={input => this.newContentCommentOfAction[child._id] = input}
                                                                    />
                                                                </div>
                                                                <ul className="list-inline tool-level2 pull-right">
                                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa </a></li>
                                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</a></li>
                                                                </ul>
                                                                <div className="tool-level2">
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>;
                                                    return true;
                                                })
                                                }
                                                {/*Thêm bình luận cho hoạt động */}
                                                <div>
                                                    <img className="user-img-level2"
                                                        src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar"
                                                    />
                                                    <div className="text-input-level2">
                                                        <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment" ref={input => this.contentCommentOfAction[item._id] = input} />    
                                                    </div>
                                                    <div className="tool-level2">
                                                        <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.submitComment(e, item._id, item._id, task._id)}>Gửi bình luận</a>
                                                        <Files
                                                            ref='filesAddAction1'
                                                            className='files-dropzone-list'
                                                            onChange={this.onCommentFilesChange}
                                                            onError={this.onFilesError}
                                                            multiple
                                                            maxFiles={10}
                                                            maxFileSize={10000000}
                                                            minFileSize={0}
                                                            clickable={false}>  
                                                            <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.refs.filesAddAction1.openFileChooser()}>Uploadfile &nbsp; &nbsp; </a>
                                                        </Files>
                                                    </div>
                                                    <ul>{this.state.commentfiles.map((file) =>
                                                        <li className='files-list-item' style={{marginLeft: "40px"}} key={file.id}>
                                                            <div className='files-list-item-preview'>
                                                            {file.preview.type === 'image' ?  
                                                            <React.Fragment>
                                                                <img className='files-list-item-preview-image'src={file.preview.url} />
                                                            </React.Fragment>    
                                                            : 
                                                            <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                                <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filesAddAction1.removeFile(file)}}><i className="fa fa-times"></i></a>
                                                            </div>
                                                            <div className='files-list-item-content'>
                                                                <div className='files-list-item-content-item files-list-item-content-item-comment-1'>{file.name}</div>
                                                                <div className='files-list-item-content-item files-list-item-content-item-comment-2'>{file.sizeReadable}</div>
                                                            </div>
                                                        </li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                                    </div>)
                                }) : null
                            }
                            {/* Thêm hoạt động cho công việc*/}
                            {this.props.role === "responsible" && task &&
                            <React.Fragment>
                                <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar" />
                                <ContentMaker
                                    onFilesChange={this.onFilesChange}
                                    onFilesError={this.onFilesError}
                                    files={this.state.newAction.files}
                                    text={this.state.newAction.description}
                                    placeholder={"Nhập hoạt động"}
                                    submitButtonText={"Thêm hoạt động"}
                                    onTextChange={(e)=>{
                                        let value = e.target.value;
                                        this.setState(state => {
                                            return { ...state, newAction: {...state.newAction, description: value}}
                                        })
                                    }}
                                    onSubmit={(e)=>{this.submitAction(task._id)}}
                                />
                            </React.Fragment>}
                        </div>
                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                taskComments.map(item => {
                                    // if (item.parent === null)
                                    return (
                                    <div className="clearfix"  key={item._id}>
                                        <img className="user-img-level1" src={(LOCAL_SERVER_API+item.creator.avatar)} alt="User Image" />
                                        
                                        { editTaskComment !== item._id && // Khi đang edit thì ẩn đi
                                        <React.Fragment>
                                            <p className="content-level1">
                                                <a href="#">{item.creator.name} </a>
                                                {item.description}
                                                {item.creator._id === currentUser && 
                                                <div className="btn-group dropleft pull-right">
                                                    <button className="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" >
                                                        <svg className="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <div className="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.handleEditTaskComment(item._id)} >Sửa bình luận</button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.props.deleteTaskComment(item._id, task._id)} >Xóa bình luận</button>
                                                        <div className="dropdown-divider"></div>
                                
                                                    </div>
                                                </div>}
                                            </p>


                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                                
                                                <li><a href="#" className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận ({item.comments.length}) &nbsp;</a></li>
                                                {item.files.length> 0 &&
                                                <React.Fragment>
                                                <li style={{display:"inline-table"}}>
                                                <div><a href="#" className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({item.files && item.files.length})</i></b></a> </div></li>
                                                {this.state.showfile.some(obj => obj === item._id ) &&
                                                    <li style={{display:"inline-table"}}>{item.files.map(elem => {
                                                        return <div><a href="#" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                    })}</li>
                                                }
                                                </React.Fragment>
                                                }
                                            </ul>
                                        </React.Fragment>
                                        }

                                        {/*Chỉnh sửa nội dung trao đổi của công việc */}
                                        {editTaskComment === item._id &&
                                            <div>
                                                <div className="text-input-level1">
                                                    <textarea
                                                        defaultValue={item.description}
                                                        ref={input => this.newContentTaskComment[item._id] = input}
                                                    />
                                                </div>
                                                <ul className="list-inline tool-level1 pull-right">
                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleSaveEditTaskComment(e, item._id)}>Gửi chỉnh sửa</a></li>
                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleEditTaskComment(e)}>Hủy bỏ</a></li>
                                                </ul>
                                                <div className="tool-level1">
                                                   
                                                </div>
                                            </div>}
                                        
                                        {/* Hiển thị bình luận cho bình luận */}
                                        {showChildTaskComment === item._id &&
                                            <div className="comment-content-child">
                                                {item.comments.map(child => {
                                                    return <div key={child._id}>
                                                        <img className="user-img-level2" src={(LOCAL_SERVER_API+item.creator.avatar)} alt="User Image" />
                                                        
                                                        {editCommentOfTaskComment !== child._id && // Đang edit thì ẩn đi
                                                        <div>
                                                            <p className="content-level2">
                                                                <a href="#">{child.creator.name} </a>
                                                                {child.description}

                                                                {child.creator._id === currentUser &&
                                                                <div className="btn-group dropleft pull-right">
                                                                    <button className="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" >
                                                                        <svg className="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.handleEditCommentOfTaskComment(child._id)} >Sửa bình luận</button>
                                                                        <div className="dropdown-divider"></div>
                                                                        <button className="dropdown-item btn-primary-outline" type="button" onClick={() => this.props.deleteCommentOfTaskComment(child._id, task._id)} >Xóa bình luận</button>
                                                                        <div className="dropdown-divider"></div>
                                                                    </div>
                                                                </div>}
                                                            </p>
                                                            <ul className="list-inline tool-level2">
                                                                    <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                    {child.files.length> 0 &&
                                                                    <React.Fragment>
                                                                    <li style={{display:"inline-table"}}>
                                                                    <div><a href="#" className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                                    {this.state.showfile.some(obj => obj === child._id ) &&
                                                                        <li style={{display:"inline-table"}}>
                                                                        {child.files.map(elem => {
                                                                            return <div><a href="#" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                                        })}
                                                                        </li>
                                                                    }
                                                                    </React.Fragment>}
                                                            </ul>
                                                        </div>
                                                        }

                                                        {/* Sửa bình luận của bình luận */}
                                                        {editCommentOfTaskComment === child._id &&
                                                            <div>
                                                                <div className="text-input-level2">
                                                                    <textarea
                                                                        defaultValue={child.description}
                                                                        ref={input => this.newContentCommentOfTaskComment[child._id] = input}
                                                                    />
                                                                </div>
                                                                <ul className="list-inline tool-level2 pull-right">
                                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleSaveEditCommentOfTaskComment(e, child._id)}>Gửi chỉnh sửa </a></li>
                                                                    <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleEditCommentOfTaskComment(e)}>Hủy bỏ</a></li>
                                                                </ul>
                                                                <div className="tool-level2">
                                                                    
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>;
                                                    return true;
                                                })
                                                }
                                                {/*Thêm bình luận cho bình luận */}
                                                <div>
                                                    <img className="user-img-level2" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar"/>
                                                    <div className="text-input-level2" >
                                                        <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment" ref={input => this.contentCommentOfTaskComment[item._id] = input} />
                                                    </div>
                                                    <div className="tool-level2">
                                                        <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.submitCommentOfTaskComment(e, item._id, item._id, task._id)}>Gửi bình luận  </a>
                                                        <Files
                                                            ref='filescmtoftaskcmt'
                                                            className='files-dropzone-list'
                                                            onChange={this.onCommentOfTaskCommentFilesChange}
                                                            onError={this.onFilesError}
                                                            multiple
                                                            maxFiles={10}
                                                            maxFileSize={10000000}
                                                            minFileSize={0}
                                                            clickable={false}>  
                                                            <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.refs.filescmtoftaskcmt.openFileChooser()}>Uploadfile &nbsp; &nbsp; </a>
                                                        </Files>
                                                    </div>
                                                    <ul>{this.state.cmtoftaskcmtfiles.map((file) =>
                                                        <li className='files-list-item' key={file.id}>
                                                            <div className='files-list-item-preview'>
                                                            {file.preview.type === 'image' ?  
                                                            <React.Fragment>
                                                                <img className='files-list-item-preview-image'src={file.preview.url} />
                                                            </React.Fragment>    
                                                            : 
                                                            <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                                <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filescmtoftaskcmt.removeFile(file)}}><i className="fa fa-times"></i></a>
                                                            </div>
                                                            <div className='files-list-item-content'>
                                                                <div className='files-list-item-content-item files-list-item-content-item-comment-1'>{file.name}</div>
                                                                <div className='files-list-item-content-item files-list-item-content-item-comment-2'>{file.sizeReadable}</div>
                                                            </div>
                                                        </li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    )
                                }) : null
                            }
                            {/* Thêm bình luận cho công việc*/}
                            <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="User Image" />
                            <div className="text-input-level1">
                                <textarea placeholder="Hãy nhập nội dung trao đổi" ref={input => this.contentTaskComment[0] = input} />
                            </div>
                            <div className="tool-level1">
                                    <div style={{textAlign: "right"}}>
                                        <a href="#" className="link-black text-sm" onClick={(e) => this.submitTaskComment(e, null, 0, task._id)}>Thêm hoạt động</a>
                                    </div>
                                    <Files
                                        ref='filesAddComment'
                                        className='files-dropzone-list'
                                        onChange={this.onTaskCommentFilesChange}
                                        onError={this.onFilesError}
                                        multiple
                                        maxFiles={10}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable={false}>  
                                        <div className='files-list'>
                                            <a href="#" className="pull-right" title="Đính kèm file" onClick={(e) => this.refs.filesAddComment.openFileChooser()}>
                                                <i class="material-icons">attach_file</i>
                                            </a>
                                            <span>Drop files here</span>
                                            <ul>{this.state.taskcommentfiles.map((file) =>
                                                <li className='files-list-item' key={file.id}>
                                                    <div className='files-list-item-preview'>
                                                    {file.preview.type === 'image' ?  
                                                    <React.Fragment>
                                                        <img className='files-list-item-preview-image'src={file.preview.url} />
                                                    </React.Fragment>    
                                                    : 
                                                    <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                        <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filesAddComment.removeFile(file)}}><i className="fa fa-times"></i></a>
                                                    </div>
                                                    <div className='files-list-item-content'>
                                                        <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                                        <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                                    </div>
                                                </li>
                                            )}
                                            </ul>
                                        </div> 
                                    </Files>
                                    
                                </div>
                        </div>


                        {/* Chuyển qua tab tài liệu */}
                        <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                        <div class="box-body table-responsive" style={{marginBottom:"30px"}}>
                            {files &&
                                files.map((item,index)=>{
                                    return(
                                    <div style={{marginBottom: 20}}>                                      
                                        <div><strong>{item.creator.name} - </strong>{item.description}</div>
                                        <a href="#" onClick={(e)=>this.requestDownloadFile(e,item.url,item.name)} >{item.name}</a>  
                                    </div>
                                    )
                                })
                            }
                        </div>
                        <React.Fragment>
                            <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar" />
                            <div className="text-input-level1">
                                <TextareaAutosize
                                    placeholder="Hãy nhập mô tả"
                                    useCacheForDOMMeasurements
                                    minRows={3}
                                    maxRows={20}
                                    ref={input => this.descriptionFile[0] = input} />
                            </div>
                            <div className="tool-level1">
                                <div style={{textAlign: "right"}}>
                                    <a href="#" className="link-black text-sm" onClick={(e) => this.handleUploadFile(task._id,0,currentUser)}>Upload File</a>
                                </div>           
                                <Files
                                    ref='filesAddTask'
                                    className='files-dropzone-list'
                                    onChange={this.onFilesTaskChange}
                                    onError={this.onFilesError}
                                    multiple
                                    maxFiles={10}
                                    maxFileSize={10000000}
                                    minFileSize={0}
                                    clickable={false}>  
                                    <div className='files-list'>
                                        <a href="#" className="pull-right" title="Đính kèm file" onClick={(e) => this.refs.filesAddTask.openFileChooser()}>
                                            <i class="material-icons">attach_file</i>
                                        </a>
                                        <span>Drop files here</span>
                                        <ul>{this.state.filestask.map((file) =>
                                            <li className='files-list-item' key={file.id}>
                                                <div className='files-list-item-preview'>
                                                {file.preview.type === 'image' ?  
                                                <React.Fragment>
                                                    <img className='files-list-item-preview-image'src={file.preview.url} />
                                                </React.Fragment>    
                                                : 
                                                <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                    <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filesAddTask.removeFile(file)}}><i className="fa fa-times"></i></a>
                                                </div>
                                                <div className='files-list-item-content'>
                                                    <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                                    <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>  
                                                </div>
                                            </li>
                                        )}
                                        </ul>
                                    </div> 
                                </Files>
                                
                            </div>
                            </React.Fragment>
                        </div>
                        {/* Chuyển qua tab công việc con */}
                        <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">
                            <SubTaskTab 
                                id = {this.state.id}
                            />
                        </div>
                        {/* Chuyển qua tab Bấm giờ */}
                        <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                            {logTimer && logTimer.map(item =>
                                <div key={item._id} style={{marginBottom: 20}}>
                                    <a style={{fontWeight: 700}} href="#">{item.creator.name} - </a>
                                    Tổng thời gian {moment.utc(item.duration, "x").format('HH:mm:ss')} - &nbsp;
                                    {item.description? item.description: "Không có mô tả"}
                                    <div>{moment(item.startedAt, "x").format("HH:mm:ss DD/MM/YYYY")} - {moment(item.stoppedAt).format("HH:mm:ss DD/MM/YYYY")} </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user,auth } = state;
    return { tasks, performtasks, user,auth };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
    addActionComment: performTaskAction.addActionComment,
    editActionComment: performTaskAction.editActionComment,
    deleteActionComment: performTaskAction.deleteActionComment,
    addTaskAction: performTaskAction.addTaskAction,
    editTaskAction: performTaskAction.editTaskAction,
    deleteTaskAction: performTaskAction.deleteTaskAction,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getStatusTimer: performTaskAction.getTimerStatusTask,
    editTaskComment: performTaskAction.editTaskComment,
    deleteTaskComment: performTaskAction.deleteTaskComment,
    createTaskComment: performTaskAction.createTaskComment,
    createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
    editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
    deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment,
    evaluationAction: performTaskAction.evaluationAction,
    confirmAction: performTaskAction.confirmAction,
    downloadFile: performTaskAction.downloadFile,
    getSubTask: taskManagementActions.getSubTask,
    uploadFile: performTaskAction.uploadFile
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }


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
            newCommentOfAction: {
                creator: idUser,
                description: "",
                files: null,
                taskActionId: null
            },
            newAction: {
                creator: idUser,
                description: "",
                files: null
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
    componentDidUpdate(oldProps) {
        if(oldProps.performtasks.taskactions !== this.props.performtasks.taskactions ){
            this.props.getTaskById(oldProps.id);
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getTimesheetLogs(nextProps.id);
            this.props.getTaskById(nextProps.id);
            this.props.getStatusTimer(nextProps.id);
            this.props.getTaskComments(nextProps.id);
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
        console.log(this.hover[id])
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
    submitAction = async (e, id, index,taskId) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    description: this.contentAction[index].value,
                    task: taskId,
                    files: this.state.files
                }
            }
        })
        var { newAction } = this.state;
        const data = new FormData();
        data.append("task", newAction.task);
        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        newAction.files.forEach(x=>{
            data.append("files", x);
        })
        //Xóa file đã được chọn mỗi khi gửi hoạt động
        
        if(newAction.creator && newAction.description){
            
            this.props.addTaskAction(data);
            if(this.state.files){
                this.state.files.forEach(item=>{
                    this.refs.filesAddAction.removeFile(item)
                })
            }
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
        this.setState({
          files
        },()=> {console.log(this.state.files)})
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
    handleUploadFile   = (task) => {
        const data  = new FormData();
        this.state.filestask.forEach(x => {
            data.append("files",x)
        })
        this.props.uploadFile(task,data);
        if(this.state.filestask){
            this.state.filestask.forEach(item=>{
                this.refs.filesAddTask.removeFile(item)
            })
        }
    }
    onFilesTaskChange  = (filestask) => {
        this.setState({
            filestask
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
    requestDownloadFile = (e,id,fileName) => {
        e.preventDefault();
        this.props.downloadFile(id,fileName);
    }
    
    render() {
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask,files;
        const { tasks, performtasks, user,auth } = this.props; 
        var actionComments, taskActions,taskComments, actions,logTimer;
        const { selected,comment, editComment, showChildComment, editAction, action,editTaskComment,showChildTaskComment,editCommentOfTaskComment,valueRating,currentUser,hover } = this.state;
        const checkUserId = obj =>  obj.creator._id === currentUser;
        if(typeof tasks.task !== 'undefined' && tasks.task !== null) {
            task = tasks.task.info;
            taskComments = task.taskComments;
            taskActions = task.taskActions;
        }
        if (performtasks.logtimer) logTimer = performtasks.logtimer; 
        if(performtasks.files) files = performtasks.files
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
                                    return (
                                    <div className="post clearfix"  key={item._id}>
                                        {item.creator ?
                                        <img className="user-img-level1" src={(LOCAL_SERVER_API+item.creator.avatar)} alt="User Image" /> :
                                        <img className="user-img-level1" src={(LOCAL_SERVER_API+"/upload/avatars/none.jpeg")} alt="User Image" />
                                        }
                                        {editAction !== item._id && // khi chỉnh sửa thì ẩn action hiện tại đi
                                        <React.Fragment>
                                            <p className="content-level1" data-width="100%">
                                                <ul className="list-inline" style={{marginBottom:"0px"}}>
                                                    <li><a href="#" >{item.creator? item.creator.name : ""} </a></li>
                                                    {item.name &&
                                                    <li><b>Tên hoạt động: &nbsp; </b> {item.name}</li>}
                                                </ul>
                                                
                                                
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
                                            
                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                                <li><a href="#" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận({item.comments.length}) &nbsp;</a></li>
                                                {item.files.length> 0 &&
                                                <React.Fragment>
                                                <li style={{display:"inline-table"}}>
                                                <div><b>File đính kèm:</b> </div></li>
                                                <li style={{display:"inline-table"}}>{item.files.map(elem => {
                                                    return <div><a href="#"onClick={(e)=>this.requestDownloadFile(e,elem._id,elem.name)}> {elem.name} </a></div>
                                                })}</li></React.Fragment>
                                                }
                                                {((item.creator === undefined || item.creator === null) && this.props.role ==="responsible") &&
                                                <li><a href="#" className="link-black text-sm" onClick={(e) => this.handleConfirmAction(e,item._id, currentUser)}><i className="fa fa-check-circle" aria-hidden="true"></i> Xác nhận hoạt động</a></li>}
                                                {(this.props.role === "accountable" || this.props.role === "consulted" || this.props.role === "creator" || this.props.role === "informed") &&
                                                <React.Fragment>
                                                <li><a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5"></i> Đánh giá: </a></li>
                                                <li style={{display:"inline-table"}} className="list-inline">
                                                    {typeof item.evaluations !== 'undefined' && item.evaluations.length !== 0 ?
                                                        <React.Fragment>
                                                            {item.evaluations.some(checkUserId)=== true ?
                                                                <React.Fragment>
                                                                    {item.evaluations.map(element => {
                                                                    if(task){
                                                                        if(task.accountableEmployees.some(obj => obj._id === element.creator._id)){
                                                                            return <div> <b><u> {element.creator.name} đánh giá {element.rating}/10 </u></b> </div>
                                                                        }
                                                                    }
                                                                })}
                                                                {item.evaluations.map(element => {
                                                                    if(task){
                                                                        if(task.accountableEmployees.some(obj => obj._id !== element.creator._id)){
                                                                            return <div> {element.creator.name} đánh giá {element.rating}/10 </div>
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
                                                                        onHover={(value)=> {                                                                                                                                                   
                                                                            this.setHover(item._id,value)
                                                                        }}
                                                                    />
                                                                    <div style={{display:"inline",marginLeft:"5px"}}>{this.hover[item._id]*2}</div> 
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
                                                                onHover={(value)=> {
                                                                    this.setHover(item._id,value)
                                                                }}
                                                            />
                                                            <div style={{display:"inline",marginLeft:"5px"}}>{this.hover && this.hover[item._id]}</div> 
                                                        </React.Fragment>}
                                                
                                                </li>
                                                
                                                </React.Fragment>}
                                            </ul>
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
                                                                {child.content}

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
                                                                    {child.files.length> 0 &&
                                                                    <React.Fragment>
                                                                    <li style={{display:"inline-table"}}>
                                                                    <div><b>File đính kèm:</b></div></li>
                                                                    <li style={{display:"inline-table"}}>
                                                                    {child.files.map(elem => {
                                                                        return <div><a href="#" onClick={()=>this.requestDownloadFile('123456', "a")}> {elem.name} </a></div>
                                                                    })}
                                                                    </li></React.Fragment>}
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
                                                                        defaultValue={child.content}
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
                            {this.props.role === "responsible" &&
                            <React.Fragment>
                                
                                <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar" />
                                <div className="text-input-level1">
                                    <TextareaAutosize
                                        placeholder="Hãy nhập nội dung hoạt động"
                                        useCacheForDOMMeasurements
                                        minRows={3}
                                        maxRows={20}
                                        ref={input => this.contentAction[0] = input} />
                                </div>
                                
                                <div className="tool-level1">
                                    <div style={{textAlign: "right"}}>
                                        <a href="#" className="link-black text-sm" onClick={(e) => this.submitAction(e, null, 0, task._id)}>Thêm hoạt động</a>
                                    </div>
                                    
                                    <Files
                                        ref='filesAddAction'
                                        className='files-dropzone-list'
                                        onChange={this.onFilesChange}
                                        onError={this.onFilesError}
                                        multiple
                                        maxFiles={10}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable={false}>  
                                        <div className='files-list'>
                                            <a href="#" className="pull-right" title="Đính kèm file" onClick={(e) => this.refs.filesAddAction.openFileChooser()}>
                                                <i class="material-icons">attach_file</i>
                                            </a>
                                            <span>Drop files here</span>
                                            <ul>{this.state.files.map((file) =>
                                                <li className='files-list-item' key={file.id}>
                                                    <div className='files-list-item-preview'>
                                                    {file.preview.type === 'image' ?  
                                                    <React.Fragment>
                                                        <img className='files-list-item-preview-image'src={file.preview.url} />
                                                    </React.Fragment>    
                                                    : 
                                                    <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                        <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filesAddAction.removeFile(file)}}><i className="fa fa-times"></i></a>
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
                            </React.Fragment>}
                        </div>


                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                taskComments.map(item => {
                                    // if (item.parent === null)
                                    return (
                                    <div className="post clearfix"  key={item._id}>
                                        <img className="user-img-level1" src={(LOCAL_SERVER_API+item.creator.avatar)} alt="User Image" />
                                        
                                        { editTaskComment !== item._id && // Khi đang edit thì ẩn đi
                                        <React.Fragment>
                                            <p className="content-level1">
                                                <a href="#">{item.creator.name} </a>
                                                {item.content}
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
                                                
                                                <li><a href="#" className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận({item.comments.length}) &nbsp;</a></li>
                                                {item.files.length> 0 &&
                                                <React.Fragment>
                                                <li style={{display:"inline-table"}}>
                                                <div><b>File đính kèm:</b> </div></li>
                                                <li style={{display:"inline-table"}}>{item.files.map(elem => {
                                                    return <div><a href="#" onClick={()=>this.requestDownloadFile('123456', "a")}> {elem.name} </a></div>
                                                })}</li></React.Fragment>
                                                }
                                            </ul>
                                        </React.Fragment>
                                        }

                                        {/*Chỉnh sửa nội dung trao đổi của công việc */}
                                        {editTaskComment === item._id &&
                                            <div>
                                                <div className="text-input-level1">
                                                    <textarea
                                                        defaultValue={item.content}
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
                                                                {child.content}

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
                                                                    <div><b>File đính kèm:</b></div></li>
                                                                    <li style={{display:"inline-table"}}>
                                                                    {child.files.map(elem => {
                                                                        return <div><a href="#" onClick={()=>this.requestDownloadFile('123456', "a")}> {elem.name} </a></div>
                                                                    })}
                                                                    </li></React.Fragment>}
                                                            </ul>
                                                        </div>
                                                        }

                                                        {/* Sửa bình luận của bình luận */}
                                                        {editCommentOfTaskComment === child._id &&
                                                            <div>
                                                                <div className="text-input-level2">
                                                                    <textarea
                                                                        defaultValue={child.content}
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
                        {/* {files && 
                            
                        } */}
                        
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
                        <button type="button" className="pull-right btn btn-primary" style={{marginTop:"10px"}} onClick={(e) => this.handleUploadFile(task._id)}>Upload</button>
                        </div>


                        {/* Chuyển qua tab công việc con */}
                        <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">
                            <SubTaskTab 
                                id = {this.props.id}
                            />
                        </div>
                        {/* Chuyển qua tab Bấm giờ */}
                        <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                            <ul style={{ listStyle: "none",fontFamily:'sans-serif' }}>
                                {
                                    logTimer &&
                                    logTimer.map(item =>
                                        <li className="list-log-timer" key={item._id}>
                                            <p style={{ fontSize: "13px" }}><a href="#">{item.creator.name}</a> : {moment(item.startedAt, "x").format("DD MMM YYYY HH:mm")} - {moment(item.stoppedAt).format("DD MMM YYYY HH:mm ")} - {moment.utc(item.duration, "x").format('HH:mm:ss')} - Mô tả: {item.description} </p>
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
    const { tasks, performtasks, user,auth } = state;
    return { tasks, performtasks, user,auth };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
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
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalOfResponsible,
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


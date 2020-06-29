import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {ContentMaker} from '../../../../common-components'
//Showfileoption
import {
    getStorage
} from '../../../../config';
import { DialogModal  } from '../../../../common-components/';
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
            taskFiles: {
                creator: idUser,
                description: '',
                files:[]
            },
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
                files: [],
                taskActionId: null
            },
            newAction: {
                creator: idUser,
                description: "",
                files: []
            },
            newActionEdited: {
                creator: idUser,
                description: "",
                files: []
            },
            newCommentOfActionEdited: {
                creator: idUser,
                description: "",
                files: []
            },
            newTaskComment: {
                creator: idUser,
                description: "",
                files: []
            },
            newCommentOfTaskComment: {
                creator: idUser,
                description: "",
                files: []
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
            descriptionFile : "",
            showModalDelete: '',
            deleteFile: ''
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
    
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.id !== prevState.id) {
    //         return {
    //             ...prevState,
    //             id: nextProps.id
    //         }
    //     }
    // }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
        console.log('----------------000000------------------');
            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id
                }
            })
            this.props.getTimesheetLogs(nextProps.id);
            // this.props.getTaskById(nextProps.id);
            this.props.getStatusTimer(nextProps.id);
            this.props.getSubTask(nextProps.id);
            this.props.getTaskLog(nextProps.id);
            // return true;
            return true;
        }
        // if(nextProps.performtasks.taskActions !== this.props.performtasks.taskActions){      
        //     this.props.getTaskById(nextProps.id);
        //     return true;
        // }
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
    setValueRating = async (id,newValue,index) => {
        await this.setState(state => {
            return {
                ...state,
                valueRating: newValue,
                evaluations: {
                    ...state.evaluations,
                    rating: newValue*2,
                    type : index
                }
            }
        })
        var {evaluations} = this.state;
        console.log(evaluations)
        this.props.evaluationAction(id,evaluations)
        await this.setState(state => {
            return {
                ...state,
                showEvaluations: [...this.state.showEvaluations,id]
            }
        })
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
    submitComment = async ( id,taskId) => {
        var { newCommentOfAction } = this.state;
        const data = new FormData();
        data.append("task", taskId);
        data.append("creator", newCommentOfAction.creator);
        data.append("description", newCommentOfAction.description);
        data.append("taskActionId",id )
        newCommentOfAction && newCommentOfAction.files.forEach(x=>{
            data.append("files", x);
        })
        if (newCommentOfAction.description && newCommentOfAction.creator) {
            this.props.addActionComment(data);
        }
        await this.setState(state => {
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    description: "",
                    files: [],
                },
            }
        })
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
    submitTaskComment = async (taskId) => {
        var { newTaskComment } = this.state;

        const data = new FormData();
        data.append("task", taskId);
        data.append("creator", newTaskComment.creator);
        data.append("description", newTaskComment.description);
        newTaskComment.files.forEach(x=>{
            data.append("files", x);
        })
        if (newTaskComment.description && newTaskComment.creator) {
            this.props.createTaskComment(data);
        }
       // Reset state cho việc thêm mới bình luận
       await this.setState(state => {
        return {
            ...state,
            newTaskComment: {
                ...state.newTaskComment,
                description: "",
                files: [],
            },
        }
    })
    }
    submitCommentOfTaskComment = async (id,taskId) => {
        var { newCommentOfTaskComment } = this.state;
        const data = new FormData();
        data.append("task", taskId);
        data.append("creator", newCommentOfTaskComment.creator);
        data.append("description", newCommentOfTaskComment.description);
        data.append("id", id);
        newCommentOfTaskComment.files.forEach(x=>{
            data.append("files", x);
        })
        if (newCommentOfTaskComment.description && newCommentOfTaskComment.creator) {
            this.props.createCommentOfTaskComment(data);
        }
        // Reset state cho việc thêm mới bình luận
         await this.setState(state => {
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    description: "",
                    files: [],
                },
            }
        })
    }
    handleUploadFile   = async (task,creator) => {
        const data  = new FormData();

        this.state.taskFiles.files.forEach(x => {
            data.append("files",x)
        })
        data.append("description",this.state.taskFiles.description)
        data.append("creator",creator)
        if(this.state.taskFiles.files){
            this.props.uploadFile(task,data); 
        }
        // Reset state cho việc thêm mới bình luận
        await this.setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    description: "",
                    files: [],
                },
            }
        })
        
       
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
    handleSaveEditActionComment = async (e, id) => {
        e.preventDefault();
        let {newCommentOfActionEdited} = this.state;
        let data = new FormData();
        newCommentOfActionEdited.files.forEach(x=> {
            data.append("files",x);
        })
        data.append("description",newCommentOfActionEdited.description);
        data.append("creator",newCommentOfActionEdited.creator);
        if(newCommentOfActionEdited.description){
            this.props.editActionComment(id,data);
        }
        await this.setState(state => {
            return {
                ...state,
                editComment: ""
            }
        })
    }
    handleSaveEditAction = async (e,id) => {
        e.preventDefault();
        let {newActionEdited} = this.state;
        let data = new FormData();
        newActionEdited.files.forEach(x => {
            data.append("files",x)
        })
        data.append("description",newActionEdited.description)
        data.append("creator",newActionEdited.creator)
        if(newActionEdited.description){
            this.props.editTaskAction(id,data);
        }
        await this.setState(state => {
            return {
                ...state,
                editAction: ""
            }
        })
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
    onActionFilesChange = (files) => {
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
    onEditActionFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newActionEdited: {
                    ...state.newActionEdited,
                    files: files,
                }
            }
        })
    }
    onEditCommentOfActionFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    files: files,
                }
            }
        })
    }
    onTaskCommentFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    files: files,
                }
            }
        })
    }  
    onCommentFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    files: files,
                }
            }
        })
    } 
    onCommentOfTaskCommentFilesChange = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    files: files,
                }
            }
        })
    }  
    onTaskFilesChange  = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    files: files,
                }
            }
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
    handleDeleteFile = async (fileId,fileName,actionId) => {
        await this.setState(state =>{
            return {
                ...state,
                showModalDelete : actionId,
                deleteFile : {
                    fileId : fileId,
                    actionId: actionId,
                    fileName: fileName
                }
            } 
        });
        window.$(`#modal-confirm-deletefile`).modal('show');
    }
    save = () => {   
       this.props.deleteFile(this.state.deleteFile.fileId,this.state.deleteFile.actionId)
    }
    //TODO href = "javascript:void(0)"
    render() {
        const { translate } = this.props;
        var type = ["actions","commentofactions","taskcomments","commentoftaskcomments"]
        var task, actions, informations;
        var statusTask,files;
        const { tasks, performtasks, user,auth } = this.props;
        const subtasks = tasks.subtasks;
        var actionComments, taskActions, taskComments, actions, logTimer, logs;
        const { showEvaluations, selected,comment, editComment, showChildComment, editAction, action,editTaskComment,showChildTaskComment,editCommentOfTaskComment,valueRating,currentUser,hover } = this.state;
        const checkUserId = obj =>  obj.creator._id === currentUser;
        if(typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
            // task = performtasks.task.info;
            task = performtasks.task;
            taskComments = task.taskComments;
            taskActions = task.taskActions;
            files = task.files
        }
        if (performtasks.logtimer) logTimer = performtasks.logtimer; 
        if (performtasks.logs) logs = performtasks.logs; 
        return (
            <div>
                <div className="nav-tabs-custom" style={{boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none"}}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">Hoạt động  ({taskActions && taskActions.length})</a></li>
                        <li><a href="#actionComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">Trao đổi ({taskComments && taskComments.length})</a></li>
                        <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">Tài liệu ({files && files.length})</a></li>
                        <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">Lịch sử bấm giờ ({logTimer && logTimer.length})</a></li>
                        <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">Công việc con ({subtasks && subtasks.length})</a></li>
                        <li><a href="#historyLog" onClick={() => this.handleChangeContent("historyLog")} data-toggle="tab">Lịch sử thay đổi ({logs && logs.length})</a></li>
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
                                                <a href="javascript:void(0)">{item.creator.name} </a>:
                                                item.name && <b>{item.name} </b>}
                                                {item.description}
                                                {(this.props.role === 'responsible' && item.creator) &&
                                                <div className="btn-group pull-right">
                                                    <span data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-h"></i>
                                                    </span>
                                                    <ul className="dropdown-menu">
                                                        <li><a href="javascript:void(0)" onClick={() => this.handleEditAction(item._id)} >Sửa hành động</a></li>
                                                        <li><a href="javascript:void(0)" onClick={() => this.props.deleteTaskAction(item._id, task._id)} >Xóa hành động</a></li>
                                                    </ul>
                                                </div>}                 
                                            </p>

                                            {/* Các file đính kèm */}
                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                                <li>{item.mandatory && !item.creator && <b className="text-sm">Hoạt động bắt buộc</b>}</li>
                                                {((item.creator === undefined || item.creator === null) && this.props.role ==="responsible") &&
                                                <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleConfirmAction(e,item._id, currentUser)}><i className="fa fa-check-circle" aria-hidden="true"></i> Xác nhận hoàn thành</a></li>}

                                                {/* Các chức năng tương tác với action */}
                                                {item.creator &&
                                                <React.Fragment>
                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={()=>{this.handleShowEvaluations(item._id)}}><i className="fa fa-thumbs-o-up margin-r-5"></i>Đánh giá ({item.evaluations && item.evaluations.length})</a></li>
                                                    {(this.props.role === "accountable" || this.props.role === "consulted" || this.props.role === "creator" || this.props.role === "informed") &&
                                                    <li style={{display:"inline-table"}} className="list-inline">
                                                        {(
                                                            (item.evaluations && item.evaluations.length !== 0 && !item.evaluations.some(checkUserId)) ||
                                                            (!item.evaluations || item.evaluations.length === 0)
                                                        ) &&
                                                            <React.Fragment>
                                                                <Rating 
                                                                    fractions = {2}
                                                                    emptySymbol="fa fa-star-o fa-2x high"
                                                                    fullSymbol="fa fa-star fa-2x high"
                                                                    initialRating = {0}
                                                                    onClick={(value) => {
                                                                    this.setValueRating(item._id,value,0);
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

                                                    {item.files && item.files.length >0 && // Chỉ hiện show file khi có file đính kèm
                                                    <li style={{display:"inline-table"}}>
                                                        <a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><i class="fa fa-paperclip" aria-hidden="true"></i> File đính kèm ({item.files && item.files.length})</a>
                                                    </li>
                                                    }
                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận ({item.comments.length}) &nbsp;</a></li>
                                                </React.Fragment>
                                                }
                                            </ul>     
                                            <div className="tool-level1" style={{paddingLeft: 5}}>
                                                {/* Các kết quả đánh giá của action */}
                                               
                                                {showEvaluations.some(obj => obj === item._id)&&
                                                    <React.Fragment>
                                                        <div style={{marginBottom: 10}}>
                                                            <ul className="list-inline">
                                                                <li style={{marginLeft:'0px'}}> 
                                                                {typeof item.evaluations !== 'undefined' && item.evaluations.length !== 0 &&
                                                                    item.evaluations.map(element => {
                                                                        if(task){
                                                                            if(task.accountableEmployees.some(obj => obj._id === element.creator._id)){
                                                                                return <div> 
                                                                                    <ul className="list-inline">
                                                                                        <li><b>{element.creator.name} - {element.rating}/10 </b></li>
                                                                                        <li></li>
                                                                                    </ul>
                                                                                    
                                                                                </div>
                                                                            }
                                                                            if(task.accountableEmployees.some(obj => obj._id !== element.creator._id)) {
                                                                                return <div> {element.creator.name} - {element.rating}/10 </div>
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                </li>
                                                                {item.evaluations.some(checkUserId) &&
                                                                <React.Fragment>
                                                                    <li>Đánh giá lại</li>
                                                                    <li>
                                                                    <Rating
                                                                    fractions = {2}
                                                                    emptySymbol="fa fa-star-o fa-2x high"
                                                                    fullSymbol="fa fa-star fa-2x high"
                                                                    initialRating = {0}
                                                                    onClick={(value) => {
                                                                    this.setValueRating(item._id,value,1);
                                                                    }}
                                                                    onHover={(value)=> {                                                                                                                                                   
                                                                        this.setHover(item._id,value)
                                                                    }}
                                                                />
                                                                <div style={{display:"inline",marginLeft:"5px"}}>{this.hover[item._id]}</div> </li>
                                                                </React.Fragment>
                                                                }
                                                            </ul>
                                                           
                                                        </div>
                                                    </React.Fragment>
                                                }
                                                {/* Các file đính kèm của action */}
                                                {this.state.showfile.some(obj => obj === item._id ) &&
                                                    <div>
                                                        {item.files.map(elem => {
                                                            return <div><a href="javascript:void(0)" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                        })}
                                                    </div>
                                                }
                                            </div>
                                        </React.Fragment>
                                        }

                                        {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                        {editAction === item._id &&
                                            <React.Fragment>
                                            <div>
                                                <ContentMaker 
                                                    inputCssClass="text-input-level1" controlCssClass="tool-level2"
                                                    onFilesChange={this.onEditActionFilesChange}
                                                    onFilesError={this.onFilesError}
                                                    files={this.state.newActionEdited.files}
                                                    defaultValue = {item.description}
                                                    submitButtonText={"Gửi chỉnh sửa"}
                                                    cancelButtonText= {"Hủy bỏ"}
                                                    handleEdit = {(e) => this.handleEditAction(e)}
                                                    onTextChange={(e)=>{
                                                        let value = e.target.value;
                                                        this.setState(state => {
                                                            return { ...state, newActionEdited: {...state.newActionEdited, description: value}}
                                                        })
                                                    }}
                                                    onSubmit={(e)=>{this.handleSaveEditAction(e,item._id)}}
                                                />
                                                {item.files.length >0 && 
                                                <ul  style={{marginTop:'-40px',marginLeft:'50px',listStyle:'none'}}>
                                                        {item.files.map(file => {
                                                        return <li>
                                                            <a href="javascript:void(0)" className="link-black text-sm">{file.name} &nbsp;</a><a href="javascript:void(0)" className="link-black text-sm btn-box-tool" onClick={()=>{this.handleDeleteFile(file._id,file.name,item._id)}}><i className="fa fa-times"></i></a>
                                                        </li>
                                                        })}
                                                </ul>}
                                            {this.state.showModalDelete === item._id &&
                                                <DialogModal
                                                    size={75}
                                                    maxWidth={200}
                                                    modalID={`modal-confirm-deletefile`}
                                                    formID={`from-confirm-deletefile`}
                                                    title={this.props.title}
                                                    isLoading={false}
                                                    func={this.save}
                                                >
                                                    Bạn có chắc chắn muốn xóa file {this.state.deleteFile.fileName} ?
                                                </DialogModal>
                                                    }             
                                            </div>
                                            </React.Fragment>
                                        }
                                    
                                        {/* Hiển thị bình luận cho hoạt động */}
                                        {showChildComment === item._id &&
                                            <div>
                                                {item.comments.map(child => {
                                                    return <div  key={child._id}>
                                                        <img className="user-img-level2" src={(LOCAL_SERVER_API+child.creator.avatar)} alt="User Image" />
                                                        
                                                        {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                                        <div>
                                                            <p className="content-level2">
                                                                <a href="javascript:void(0)">{child.creator.name} </a>
                                                                {child.description}

                                                                {child.creator._id === currentUser &&
                                                                <div className="btn-group pull-right">
                                                                    <span data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a href="javascript:void(0)" onClick={() => this.handleEditActionComment(child._id)} >Sửa bình luận</a></li>
                                                                        <li><a href="javascript:void(0)" onClick={() => this.props.deleteActionComment(child._id, task._id)} >Xóa bình luận</a></li>
                                                                    </ul>
                                                                </div>}
                                                            </p>
                                                            {/* <div className="tool-level2">
                                                                <span className="text-sm">{moment(child.createdAt).fromNow()}</span>
                                                            </div> */}
                                                            <ul className="list-inline tool-level2">
                                                                    <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                    <li style={{display:"inline-table"}}>
                                                                    <div><a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                                    {this.state.showfile.some(obj => obj === child._id ) &&
                                                                        <li style={{display:"inline-table"}}>
                                                                        {child.files.map(elem => {
                                                                            return <div><a href="javascript:void(0)" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
                                                                        })}
                                                                        </li>
                                                                    }

                                                            </ul>
                                                        </div>
                                                        }
                                                        
                                                        {/*Chỉnh sửa nội dung bình luận của hoạt động */}
                                                        {editComment === child._id &&
                                                            // <div>
                                                            //     <div className="text-input-level2">
                                                            //         <textarea
                                                            //             rows={this.state.rows}
                                                            //             placeholder={'Enter your text here...'}
                                                            //             className={'textarea'}
                                                            //             onChange={this.handleChange}
                                                            //             defaultValue={child.description}
                                                            //             ref={input => this.newContentCommentOfAction[child._id] = input}
                                                            //         />
                                                            //     </div>
                                                            //     <ul className="list-inline tool-level2" style={{textAlign: "right"}}>
                                                            //         <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa </a></li>
                                                            //         <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</a></li>
                                                            //     </ul>
                                                            //     <div className="tool-level2">
                                                            //     </div>
                                                            // </div>
                                                            <React.Fragment>
                                                            <div>
                                                                <ContentMaker 
                                                                    inputCssClass="text-input-level1" controlCssClass="tool-level2"
                                                                    onFilesChange={this.onEditCommentOfActionFilesChange}
                                                                    onFilesError={this.onFilesError}
                                                                    files={this.state.newCommentOfActionEdited.files}
                                                                    defaultValue = {child.description}
                                                                    submitButtonText={"Gửi chỉnh sửa"}
                                                                    cancelButtonText= {"Hủy bỏ"}
                                                                    handleEdit = {(e) => this.handleEditActionComment(e)}
                                                                    onTextChange={(e)=>{
                                                                        let value = e.target.value;
                                                                        this.setState(state => {
                                                                            return { ...state, newCommentOfActionEdited: {...state.newCommentOfActionEdited, description: value}}
                                                                        })
                                                                    }}
                                                                    onSubmit={(e)=>{this.handleSaveEditActionComment(e,child._id)}}
                                                                />
                                                                {child.files.length >0 && 
                                                                <ul  style={{marginTop:'-40px',marginLeft:'50px',listStyle:'none'}}>
                                                                        {child.files.map(file => {
                                                                        return <li>
                                                                            <a href="javascript:void(0)" className="link-black text-sm">{file.name} &nbsp;</a><a href="javascript:void(0)" className="link-black text-sm btn-box-tool" onClick={()=>{this.handleDeleteFile(file._id,file.name,child._id)}}><i className="fa fa-times"></i></a>
                                                                        </li>
                                                                        })}
                                                                </ul>}
                                                            {this.state.showModalDelete === item._id &&
                                                                <DialogModal
                                                                    marginTop
                                                                    size={75}
                                                                    maxWidth={200}
                                                                    modalID={`modal-confirm-deletefile`}
                                                                    formID={`from-confirm-deletefile`}
                                                                    title={this.props.title}
                                                                    isLoading={false}
                                                                    func={this.save}
                                                                >
                                                                    Bạn có chắc chắn muốn xóa file {this.state.deleteFile.fileName} ?
                                                                </DialogModal>
                                                                    }             
                                                            </div>
                                                            </React.Fragment>
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
                                                    <ContentMaker
                                                        inputCssClass="text-input-level2" controlCssClass="tool-level2"
                                                        onFilesChange={this.onCommentFilesChange}
                                                        onFilesError={this.onFilesError}
                                                        files={this.state.newCommentOfAction.files}
                                                        text={this.state.newCommentOfAction.description}
                                                        placeholder={"Nhập bình luận cho hoạt động"}
                                                        submitButtonText={"Thêm bình luận"}
                                                        onTextChange={(e)=>{
                                                            let value = e.target.value;
                                                            this.setState(state => {
                                                                return { ...state, newCommentOfAction: {...state.newCommentOfAction, description: value}}
                                                            })
                                                        }}
                                                        onSubmit={(e)=>{this.submitComment(item._id,task._id)}}
                                                    />
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
                                    inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                    onFilesChange={this.onActionFilesChange}
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
                                                <a href="javascript:void(0)">{item.creator.name} </a>
                                                {item.description}
                                                {item.creator._id === currentUser &&
                                                <div className="btn-group pull-right">
                                                    <span data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-h"></i>
                                                    </span>
                                                    <ul className="dropdown-menu">
                                                        <li><a href="javascript:void(0)" onClick={() => this.handleEditTaskComment(item._id)} >Sửa bình luận</a></li>
                                                        <li><a href="javascript:void(0)" onClick={() => this.props.deleteTaskComment(item._id, task._id)} >Xóa bình luận</a></li>
                                                    </ul>
                                                </div>}
                                            </p>


                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                                
                                                <li><a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> Bình luận ({item.comments.length}) &nbsp;</a></li>
                                                {item.files.length> 0 &&
                                                <React.Fragment>
                                                <li style={{display:"inline-table"}}>
                                                <div><a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({item.files && item.files.length})</i></b></a> </div></li>
                                                {this.state.showfile.some(obj => obj === item._id ) &&
                                                    <li style={{display:"inline-table"}}>{item.files.map(elem => {
                                                        return <div><a href="javascript:void(0)" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
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
                                                <ul className="list-inline tool-level1" style={{textAlign: "right"}}>
                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleSaveEditTaskComment(e, item._id)}>Gửi chỉnh sửa</a></li>
                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleEditTaskComment(e)}>Hủy bỏ</a></li>
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
                                                                <a href="javascript:void(0)">{child.creator.name} </a>
                                                                {child.description}

                                                                {child.creator._id === currentUser &&
                                                                <div className="btn-group pull-right">
                                                                    <span data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <ul className="dropdown-menu">
                                                                        <li><a href="javascript:void(0)" onClick={() => this.handleEditCommentOfTaskComment(child._id)} >Sửa bình luận</a></li>
                                                                        <li><a href="javascript:void(0)" onClick={() => this.props.deleteCommentOfTaskComment(child._id, task._id)} >Xóa bình luận</a></li>
                                                                    </ul>
                                                                </div>}
                                                            </p>
                                                            <ul className="list-inline tool-level2">
                                                                    <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                    {child.files.length> 0 &&
                                                                    <React.Fragment>
                                                                    <li style={{display:"inline-table"}}>
                                                                    <div><a href="javascript:void(0)" className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i class="fa fa-paperclip" aria-hidden="true"> File đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                                    {this.state.showfile.some(obj => obj === child._id ) &&
                                                                        <li style={{display:"inline-table"}}>
                                                                        {child.files.map(elem => {
                                                                            return <div><a href="javascript:void(0)" onClick={(e)=>this.requestDownloadFile(e,elem.url,elem.name)}> {elem.name} </a></div>
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
                                                                <ul className="list-inline tool-level2" style={{textAlign: "right"}}>
                                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleSaveEditCommentOfTaskComment(e, child._id)}>Gửi chỉnh sửa </a></li>
                                                                    <li><a href="javascript:void(0)" className="link-black text-sm" onClick={(e) => this.handleEditCommentOfTaskComment(e)}>Hủy bỏ</a></li>
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
                                                    <ContentMaker
                                                        inputCssClass="text-input-level2" controlCssClass="tool-level2"
                                                        onFilesChange={this.onCommentOfTaskCommentFilesChange}
                                                        onFilesError={this.onFilesError}
                                                        files={this.state.newCommentOfTaskComment.files}
                                                        text={this.state.newCommentOfTaskComment.description}
                                                        placeholder={"Nhập bình luận"}
                                                        submitButtonText={"Thêm bình luận"}
                                                        onTextChange={(e)=>{
                                                            let value = e.target.value;
                                                            this.setState(state => {
                                                                return { ...state, newCommentOfTaskComment: {...state.newCommentOfTaskComment, description: value}}
                                                            })
                                                        }}
                                                        onSubmit={(e)=>{this.submitCommentOfTaskComment(item._id,task._id)}}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    )
                                }) : null
                            }
                            {/* Thêm bình luận cho công việc*/}
                            <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="User Image" />
                            <ContentMaker
                                inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                onFilesChange={this.onTaskCommentFilesChange}
                                onFilesError={this.onFilesError}
                                files={this.state.newTaskComment.files}
                                text={this.state.newTaskComment.description}
                                placeholder={"Nhập bình luận"}
                                submitButtonText={"Thêm bình luận"}
                                onTextChange={(e)=>{
                                    let value = e.target.value;
                                    this.setState(state => {
                                        return { ...state, newTaskComment: {...state.newTaskComment, description: value}}
                                    })
                                    
                                }}
                                onSubmit={(e)=>{this.submitTaskComment(task._id)}}
                            />
                        </div>


                        {/* Chuyển qua tab tài liệu */}
                        <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                        <div>
                            {files &&
                                files.map((item,index)=>{
                                    return(
                                    <div style={{marginBottom: 20}}>                                      
                                        <div><strong>{item.creator.name} - </strong>{item.description}</div>
                                        <a href="javascript:void(0)" onClick={(e)=>this.requestDownloadFile(e,item.url,item.name)} >{item.name}</a>  
                                    </div>
                                    )
                                })
                            }
                        </div>
                        <React.Fragment>
                            <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar" />
                            <ContentMaker
                                inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                onFilesChange={this.onTaskFilesChange}
                                onFilesError={this.onFilesError}
                                files={this.state.taskFiles.files}
                                text={this.state.taskFiles.description}
                                placeholder={"Nhập mô tả"}
                                submitButtonText={"Thêm tài liệu"}
                                onTextChange={(e)=>{
                                    let value = e.target.value;
                                    this.setState(state => {
                                        return { ...state, taskFiles: {...state.taskFiles, description: value}}
                                        
                                    })
                                    console.log(this.state.taskFiles)
                                }}
                                onSubmit={(e)=>{this.handleUploadFile(task._id,currentUser)}}
                            />
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
                                    <a style={{fontWeight: 700}} href="javascript:void(0)">{item.creator.name} - </a>
                                    Tổng thời gian {moment.utc(item.duration, "x").format('HH:mm:ss')} - &nbsp;
                                    {item.description? item.description: "Không có mô tả"}
                                    <div>{moment(item.startedAt, "x").format("HH:mm:ss DD/MM/YYYY")} - {moment(item.stoppedAt).format("HH:mm:ss DD/MM/YYYY")} </div>
                                </div>
                            )}
                        </div>

                        {/* Chuyển qua tab Nhật ký lịch sử */}
                        <div className={selected === "historyLog" ? "active tab-pane" : "tab-pane"} id="historyLog">
                            {logs && logs.map(item =>
                                <div key={item._id} style={{marginBottom: 20}}>
                                    <a style={{fontWeight: 700}} href="javascript:void(0)">{item.creator.name} - </a>
                                    Thời gian {moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                                    <ul>
                                        <li> {item.title? item.title: "Không có tiêu đề"} </li>
                                        <li> {item.description? item.description: "Không có mô tả"} </li>
                                    </ul>
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
    uploadFile: performTaskAction.uploadFile,
    deleteFile: performTaskAction.deleteFile,
    getTaskLog: performTaskAction.getTaskLog,
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }


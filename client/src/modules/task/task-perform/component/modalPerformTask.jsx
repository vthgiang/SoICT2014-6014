import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
import { performTaskAction } from "../redux/actions";
import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { managerKpiActions } from "../../../kpi/employee/management/redux/actions";
// import { taskManagementActions, performTaskAction, UserActions, kpiPersonalActions } from '../../../redux-actions/CombineActions';
import ModalApproveTask from "./modalApproveTask";
import { ButtonModal } from '../../../../common-components';

class ModalPerformTask extends Component {
    constructor(props) {

        const token = getStorage();
        const verified = jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;

        super(props);
        this.state = {
            currentUser: idUser,//fix---------------localStorage.getItem('id')-------------------
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
            startTimer: false,
            pauseTimer: false,
            showChildComment: "",
            newComment: {
                task: this.props.id,
                creator: idUser,//fix---------------localStorage.getItem("id")-------------------
                parent: null,
                content: "",
                file: null,
                taskActionId: null
            },
            newAction: {
                task: this.props.id,
                creator: idUser,
                content: "",
                file: null
            },
            timer: {
                task: this.props.id,
                startTimer: "",
                stopTimer: null,
                user: idUser,//fix---------------localStorage.getItem("id")-------------------
                time: 0,
            },
            resultTask: 0,
            showModal: ""
        };
        this.contentComment = [];
        this.newContentComment = [];
        this.contentAction = [];
        this.newContentAction = [];
        this.onHandleChangeFile = this.onHandleChangeFile.bind(this);
        this.mypoint = [];
        this.approvepoint = [];
    }
    componentDidUpdate() {
        let script3 = document.createElement('script');
        script3.src = '../lib/main/js/CoCauToChuc.js';//fix /lib/main.....................................
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
    componentDidMount() {
        let script2 = document.createElement('script');
        script2.src = '../lib/main/js/uploadfile/custom.js';//fix-------------------------------------------------------------
        script2.async = true;
        script2.defer = true;
        document.body.appendChild(script2);
    }
    UNSAFE_componentWillMount() {
        this.props.getLogTimer(this.props.id);
        this.props.getAllKPIPersonalByMember(this.props.responsible);
        this.props.getAllUserOfDepartment(this.props.unit);
        this.props.getTaskById(this.props.id);
        this.props.getTaskActions(this.props.id);
        this.props.getStatusTimer(this.props.id);//fix hàm bên services---------------------------------------------------
    }
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selected: content
            }
        })
    }
    handleChangeExtendDesciption = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendDescription: !state.extendDescription
            }
        })
    }
    handleChangeEditDesciption = async () => {
        await this.setState(state => {
            return {
                ...state,
                editDescription: !state.editDescription,
                extendDescription: !state.extendDescription
            }
        })
    }
    handleChangeExtendInformation = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendInformation: !state.extendInformation
            }
        })
    }
    handleChangeExtendRACI = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendRACI: !state.extendRACI
            }
        })
    }
    handleChangeExtendKPI = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendKPI: !state.extendKPI
            }
        })
    }
    handleChangeExtendInfoByTemplate = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendInfoByTemplate: !state.extendInfoByTemplate
            }
        })
    }
    handleChangeExtendApproveRessult = async () => {
        await this.setState(state => {
            return {
                ...state,
                extendApproveRessult: !state.extendApproveRessult
            }
        })
        this.calculateResulTaskDefault();
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
    startTimer = async () => {
        //Chỉnh giao diện
        document.getElementById("start-timer-task").style.width = "20%";
        document.getElementById("btn-approve").style.marginLeft = "50%";
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    startTimer: Date.now()
                }
            }
        })
        this.props.startTimer(this.state.timer);
        //Chỉnh trạng thái bấm giờ và update database
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    time: 0,
                    startTimer: Date.now(),
                },
                startTimer: true,
                pauseTimer: false
            }
        })
        // Setup thời thời gian chạy
        this.timer = setInterval(() => this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    time: Date.now() - this.state.timer.startTimer,
                },
            }
        }), 1);
    }
    stopTimer = async (timer) => {
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    stopTimer: Date.now(),
                },
                startTimer: false,
                pauseTimer: false
            }
        })
        // Xóa biến timer
        clearInterval(this.timer);
        // Chỉnh giao diện
        document.getElementById("start-timer-task").style.width = "9%";
        document.getElementById("btn-approve").style.marginLeft = "80%";

        Swal.fire({
            title: "Thời gian đã làm: " + this.convertTime(this.state.timer.time),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Lưu'
        }).then((res) => {
            // Update dữ liệu: Thời gian kết thúc, time = oldTime + newTime
            this.props.stopTimer(timer._id, this.state.timer);
            this.setState(state => {
                // TODO: test sau
                return {
                    ...state,
                    timer: {
                        task: this.props.id,
                        startTimer: "",
                        stopTimer: null,
                        time: 0
                    }
                }
            })
        });
        // reset trạng thái timer
    }
    pauseTimer = async (timer) => {
        // Chuyển sang trạng thái dừng bấm giờ
        await this.setState(state => {
            return {
                ...state,
                pauseTimer: true
            }
        })
        // Xóa biến timer
        clearInterval(this.timer);
        // Update database: time
        this.props.pauseTimer(timer._id, this.state.timer);
    }
    continueTimer = async (timer) => {
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    startTimer: Date.now()
                },
                startTimer: true,
                pauseTimer: false,
            }
        })
        this.props.continueTimer(timer._id, this.state.timer);
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    startTimer: this.state.timer.startTimer - this.state.timer.time
                },
                startTimer: true,
                pauseTimer: false,
            }
        })
        this.timer = setInterval(() => this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    time: Date.now() - this.state.timer.startTimer,
                },
            }
        }), 1);
    }
    convertTime = (duration) => {
        // var milliseconds = parseInt((duration % 1000) / 100),
        var seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
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
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    calculateOverdueDate = (enddate) => {
        var endTime = new Date(enddate).getTime();
        var time = Date.now() - endTime - 1000 * 3600 * 24;
        if (time <= 0) {
            return 0;
        } else {
            var day = Math.ceil(time / (1000 * 3600 * 24));
            return day;
        }
    }
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`modelPerformTask${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    submitComment = async (e, id, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newComment: {
                    ...state.newComment,
                    parent: id,
                    content: this.contentComment[index].value,
                    taskActionId : id
                }
            }
        })
        var { newComment } = this.state;
        // const data = new FormData();
        // data.append("task", newComment.task);
        // data.append("creator", newComment.creator);
        // data.append("parent", newComment.parent);
        // data.append("content", newComment.content);
        //  data.append("file", newComment.file);
        if (newComment.task && newComment.content && newComment.creator) {
            this.props.addActionComment(newComment);
        }
        this.contentComment[index].value = "";
    }
    //Thêm mới hoạt động
    submitAction = async (e, id, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    content: this.contentAction[index].value,
                }
            }
        })
        var { newAction } = this.state;
        if (newAction.content && newAction.creator) {
            this.props.addTaskAction(newAction);
        }
        this.contentAction[index].value = "";
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
    //Lưu hoạt động

    handleSaveEditActionComment = async (e, index) => {
        e.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                newComment: {
                    ...state.newComment,
                    content: this.newContentComment[index].value,
                    // file:
                },
                editComment: ""
            }
        })
        var { newComment } = this.state;
        if (newComment.content) {
            this.props.editActionComment(index, newComment);
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
    onHandleChangeFile = (event) => {
        var file = event.target.files[0];
        this.setState(state => {
            return {
                ...state,
                newComment: {
                    ...state.newComment,
                    file: file,
                    loaded: 0
                }
            }
        })
    }
    calculateTaskRessultByProgress = async (informations, formula) => {
        if (informations && formula) {
            // nếu như làm việc theo mẫu thì sẽ gọi đến công thức tính công việc theo mẫu
            this.calculateTaskRessult(informations, formula);
        } else {
            // Nếu không theo mẫu thì sẽ gọi đến công thức tính công việc không theo mẫu
            var startdate = this.startdate.value;
            var startD = startdate.split("-");
            var enddate = this.enddate.value;
            var endD = enddate.split('-');
            var startTime = new Date(startD[2], startD[1] - 1, startD[0]).getTime();
            var endTime = new Date(endD[2], endD[1] - 1, endD[0]).getTime();
            var time = endTime - startTime;
            if (time <= 0) {
                return 0;
            } else {
                var workDay = Math.ceil(time / (1000 * 3600 * 24));
            }
            var overdate = parseInt(this.overdate.value);
            var progress = parseInt(this.progress.value);
            var resultTask = Math.ceil(progress - (overdate / workDay) * progress);
            await this.setState(state => {
                return {
                    ...state,
                    resultTask: resultTask
                }
            })
        }
    }
    calculateResulTaskDefault = async () => {
        var startdate = this.startdate.value;
        var startD = startdate.split("-");
        var enddate = this.enddate.value;
        var endD = enddate.split('-');
        var startTime = new Date(startD[2], startD[1] - 1, startD[0]).getTime();
        var endTime = new Date(endD[2], endD[1] - 1, endD[0]).getTime();
        var time = endTime - startTime;
        if (time <= 0) {
            return 0;
        } else {
            var workDay = Math.ceil(time / (1000 * 3600 * 24));
        }
        var overdate = parseInt(this.overdate.value);
        var progress = parseInt(this.progress.value);
        var resultTask = Math.ceil(progress - (overdate / workDay) * progress);
        await this.setState(state => {
            return {
                ...state,
                resultTask: resultTask
            }
        })
    }
    calculateTaskRessult = async (informations, formula) => {
        var result;
        if (informations) {
            informations.map((item) => {
                window[item.code] = eval("this.refs." + item.code + ".value");
                return item;
            })
        }
        // Tính toán điểm công việc cho trường hợp công việc chuyển sang tháng tiếp theo
        var startdate = this.startdate.value;
        var startD = startdate.split("-");
        var enddate = this.enddate.value;
        var endD = enddate.split('-');
        var startTime = new Date(startD[2], startD[1] - 1, startD[0]).getTime();
        var endTime = new Date(endD[2], endD[1] - 1, endD[0]).getTime();
        var time = endTime - startTime;
        var wordedDay = Date.now() - startTime;
        if (wordedDay < time) {
            result = Math.ceil((eval(formula) * 100) / (wordedDay / time));
        } else {
            result = Math.ceil(eval(formula) * 100);
        }
        // var result = Math.ceil(eval(formula) * 100);
        var resultTask = 0;
        if (result < 0) resultTask = 0;
        else if (result > 100) resultTask = 100;
        else resultTask = result;
        await this.setState(state => {
            return {
                ...state,
                resultTask: resultTask
            }
        })
    }
    handleChangeMyPoint = (id) => {
        var systempoint = parseInt(this.resultTask.value);
        var mypoint = parseInt(this.mypoint[id].value);
        if (mypoint < 0) {
            this.approvepoint[id].value = Math.ceil(systempoint / 2);
        } else {
            this.approvepoint[id].value = Math.ceil((systempoint + mypoint) / 2);
        }
    }
    // Chuyển thời gian về định dạng mong muốn
    toDate = (date) => {
        if (date === void 0) {
            return new Date(0);
        }
        if (this.isDate(date)) {
            return date;
        } else {
            return new Date(parseFloat(date.toString()));
        }
    }
    isDate = (date) => {
        return (date instanceof Date);
    }
    format = (date, format) => {
        var d = this.toDate(date);
        return format
            .replace(/Y/gm, d.getFullYear().toString())
            .replace(/m/gm, ('0' + (d.getMonth() + 1)).substr(-2))
            .replace(/d/gm, ('0' + (d.getDate() + 1)).substr(-2))
            .replace(/H/gm, ('0' + (d.getHours() + 0)).substr(-2))
            .replace(/i/gm, ('0' + (d.getMinutes() + 0)).substr(-2))
            .replace(/s/gm, ('0' + (d.getSeconds() + 0)).substr(-2))
            .replace(/v/gm, ('0000' + (d.getMilliseconds() % 1000)).substr(-3));
    }

    handleSubmitContenTask = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModal: id
            }
        });
        window.$(`#modal-approve-task-${id}`).modal('show');
    }

    render() {
        var task, actionComments, taskActions, actions, informations, currentTimer, userdepartments, listKPIPersonal, logTimer;
        var statusTask;
        const { selected, extendDescription, editDescription, extendInformation, extendRACI, extendKPI, extendApproveRessult, extendInfoByTemplate } = this.state;
        const { comment, editComment, startTimer, showChildComment, pauseTimer, editAction, action } = this.state;
        const { time } = this.state.timer;
        const { tasks, performtasks, user, KPIPersonalManager } = this.props;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }
        if (typeof performtasks.taskactions !== 'undefined' && performtasks.taskactions !== null) taskActions = performtasks.taskactions;
        if (typeof performtasks.currentTimer !== "undefined") currentTimer = performtasks.currentTimer;
        if (performtasks.logtimer) logTimer = performtasks.logtimer;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (KPIPersonalManager.kpipersonals) listKPIPersonal = KPIPersonalManager.kpipersonals;//sửa ten -> ten-props.kpipersonals//chắc là cho vào overviewkpipersonal
        return (
            <div className="modal modal-full fade" data-backdrop="false" id={`modelPerformTask${this.props.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="col-sm-4">
                                <h3 className="modal-title" id="myModalLabel"><input style={{ border: "none", height: "6%", width: "100%" }} value={task && task.name} /></h3>
                            </div>
                            <div className="col-sm-8" style={{ marginTop: "-6px" }}>
                                <div id="start-timer-task" className="col-sm-3" style={{ marginLeft: "-3%", width: "9%" }}>
                                    {this.props.role !== "informed" && this.props.role !== "creator" && (startTimer ?
                                        <div className="run-timer" style={{ border: "1px solid #d0d0d0", borderRadius: "50px", boxSizing: "border-box", zIndex: "6", boxShadow: "1px 1px 3px #ccc", width: "130px", height: "30px" }}>
                                            <a href="#abc" className="delete" title="Kết thúc" onClick={() => this.stopTimer(currentTimer)}><i className="fa fa-stop" style={{ fontSize: "10px", marginLeft: "6px", marginTop: "9px" }}></i></a>
                                            {pauseTimer ? <a href="#abc" className="edit" title="Tiếp tục bấm giờ" onClick={() => this.continueTimer(currentTimer)}><i className="fa fa-play" style={{ fontSize: "10px", marginLeft: "-7px" }}></i></a>
                                                : <a href="#abc" className="edit" title="Tạm dừng" onClick={() => this.pauseTimer(currentTimer)}><i className="fa fa-pause" style={{ fontSize: "10px", marginLeft: "-7px" }}></i></a>}
                                            <input value={this.convertTime(time)} style={{ width: "60px", border: "none", background: "none", marginLeft: "-15px" }} disabled />
                                        </div> : <a href="#abc" className="timer" title="Bắt đầu bấm giờ" onClick={() => this.startTimer()}><i className="material-icons" style={{ marginTop: "5px" }}>timer</i></a>)}
                                </div>
                                {/* <div className="col-sm-1" style={{ marginTop: "5px", marginLeft: "-5%" }}><a href="#abc" className="default" title="Xóa công việc này"><i className="material-icons">delete</i></a></div> */}
                                <div className="col-sm-3">
                                    <label className="col-sm-2 control-label" style={{ width: '61%', textAlign: 'left', marginTop: "5px", fontWeight: "500", marginLeft: "-25%" }}>Mức ưu tiên:</label>
                                    <div className="col-sm-10" style={{ width: '79%', marginLeft: "-15%" }}>
                                        <select defaultValue={task && task.priority} className="form-control" ref={input => this.priority = input} disabled={this.props.role === "informed" || this.props.role === "creator"}>
                                            <option value="Cao">Cao</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Thấp">Thấp</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ marginLeft: "-6%" }}>
                                    <label className="col-sm-4 control-label" style={{ textAlign: 'left', width: "40%", marginTop: "5px", fontWeight: "500" }}>Trạng thái:</label>
                                    <div className="col-sm-10" style={{ width: '70%', marginLeft: "-12%" }}>
                                        <select defaultValue={task && task.status} className="form-control" ref={input => this.priority = input} disabled={this.props.role === "informed" || this.props.role === "creator"}>
                                            <option value="Đang chờ">Đang chờ</option>
                                            <option value="Đang thực hiện">Đang thực hiện</option>
                                            {/* <option value="Quá hạn">Quá hạn</option> */}
                                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                            <option value="Tạm dừng">Tạm dừng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    {/* {
                                        this.state.showModal === this.props.id &&
                                        <ModalApproveTask
                                            taskID={this.props.id}
                                            // task = { task }
                                            currentUser={this.state.currentUser}
                                            role={this.props.role}
                                            resultTask={this.state.resultTask}
                                        />
                                    } */}
                                    {
                                        (this.props.role === "responsible") &&
                                        <React.Fragment>
                                            {/* <ModalButton modalID={`modal-approve-task-${this.props.id}`} button_name="Yêu cầu phê duyệt" title="Yêu cầu phê duyệt" /> */}
                                            <button type="submit" id="btn-approve" className="col-sm-8 btn btn-success" style={{ width: "119%", marginLeft: "80%", height: "32px" }} onClick={() => this.handleSubmitContenTask(this.props.id)}>Yêu cầu kết thúc</button>
                                            {
                                                this.state.showModal === this.props.id &&
                                                <ModalApproveTask
                                                    taskID={this.props.id}
                                                    // task = { task }
                                                    currentUser={this.state.currentUser}
                                                    role={this.props.role}
                                                    resultTask={this.state.resultTask}
                                                />
                                            }

                                        </React.Fragment>
                                    }


                                    {   // && (statusTask && statusTask !== "Đã hoàn thành"))
                                        // (this.props.role !== "creator" && this.props.role !== "informed" ) &&
                                        // <button type="submit" id="btn-approve" className="col-sm-8 btn btn-success" style={{ width: "119%", marginLeft: "80%", height: "32px" }} onClick={this.handleSubmitContenTask}>Yêu cầu phê duyệt</button>
                                        // (((statusTask && ( statusTask === "Chờ phê duyệt")) && (this.props.role === "consulted" || this.props.role === "accountable")) || 
                                        //     (this.props.role === "responsible"  && (statusTask && statusTask !== "Đã hoàn thành"))) &&
                                        (this.props.role === "consulted" || this.props.role === "accountable") &&
                                        <React.Fragment>
                                            {/* <ModalButton modalID={`modal-approve-task-${this.props.id}`} button_name="Ket thuc cong viec" title="Ket thuc cong viec" /> */}
                                            <button type="submit" id="btn-approve" className="col-sm-8 btn btn-success" style={{ width: "119%", marginLeft: "80%", height: "32px" }} onClick={() => this.handleSubmitContenTask(this.props.id)}>Kết thúc công việc</button>
                                            {
                                                this.state.showModal === this.props.id &&
                                                <ModalApproveTask
                                                    taskID={this.props.id}
                                                    // task = { task }
                                                    currentUser={this.state.currentUser}
                                                    role={this.props.role}
                                                    resultTask={this.state.resultTask}
                                                />
                                            }
                                        </React.Fragment>
                                    }
                                </div>
                                <button type="button" className="col-sm-1 close" style={{ paddingLeft: "6%" }} onClick={() => this.handleCloseModal(task._id)} data-dismiss="modal">
                                    <span aria-hidden="true">×</span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <form className="form-horizontal">
                                <div className="row">
                                    {/* Mô tả công việc */}
                                    <div className="col-sm-12">
                                        <label className="col-sm-12 control-label" style={{ textAlign: 'left', width: "100%", marginTop: "-1%", marginLeft: "-15px" }}>
                                            <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng để xem nội dung mô tả"} onClick={this.handleChangeExtendDesciption}><i className={extendDescription ? "fa fa-angle-up" : "fa fa-angle-down"}></i></a>
                                            <label style={{ display: "inline", fontWeight: "500" }}>Mô tả công việc</label>
                                            {this.props.role !== "informed" && <a href="#abc" className="edit" title="Chỉnh sửa mô tả" onClick={this.handleChangeEditDesciption}><i className="material-icons">edit</i></a>}
                                        </label>
                                        {extendDescription ?
                                            (editDescription ?
                                                <textarea className="form-control" rows={5} value={task && task.description} style={{ width: "50%", height: "65px", marginLeft: "5%" }} />
                                                : <label className="control-label" style={{ textAlign: 'left', width: "40%", marginTop: "5px", marginLeft: "1.5%", fontWeight: "500" }}>{task.description}</label>)
                                            : null
                                        }
                                    </div>
                                    {/* Phân định trách nhiệm trong công việc */}
                                    <div className="col-sm-12">
                                        <label className="control-label" style={{ textAlign: 'left', width: "100%", marginTop: "3px", marginLeft: "10px", fontWeight: "500" }}>
                                            <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng xem thông tin phân định trách nhiệm"} onClick={this.handleChangeExtendRACI}>
                                                <i className={extendRACI ? "fa fa-angle-up" : "fa fa-angle-down"} style={{ fontSize: "15px" }}></i>
                                            </a>
                                            <label style={{ display: "inline", fontWeight: "500" }}>Phân định trách nhiệm (RACI)</label>
                                            {this.props.role !== "informed" && this.props.role !== "consulted" && extendRACI &&
                                                <a href="#abc" className="save_result" title="Lưu chỉnh sửa"><i className="material-icons">save</i></a>}
                                        </label>
                                    </div>
                                    {extendRACI &&
                                        <React.Fragment>
                                            <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>Người tạo*</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select multiline="true" defaultValue={task && task.creator} disabled className="form-control select2" style={{ width: '100%' }}>
                                                        {userdepartments &&
                                                            userdepartments.map(item =>
                                                                <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                    <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                                </optgroup>)

                                                            // <optgroup label={item.id_role.name} key={item.id_role._id}>
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}
                                                            //     {item.id_user.map(x => {
                                                            // {/* ---------------------------------------userId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //         return <option key={x._id} value={x._id}>{x.name}</option>
                                                            //     })}
                                                            // </optgroup>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>Người thực hiện*</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select multiline="true" defaultValue={task && task.responsibleEmployees.map(item => item._id)} disabled={this.props.role !== "accounatable"} className="form-control select2" multiple="multiple" ref="responsible" style={{ width: '100%' }}>
                                                        {userdepartments &&
                                                            userdepartments.map(item =>
                                                                <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                    <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                                </optgroup>)
                                                            // <optgroup label={item.id_role.name} key={item.id_role._id}>
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //     {item.id_user.map(x => {
                                                            // {/* ---------------------------------------userId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //         return <option key={x._id} value={x._id}>{x.name}</option>
                                                            //     })}
                                                            // </optgroup>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>Người phê duyệt*</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select multiline="true" defaultValue={task && task.accountableEmployees.map(item => item._id)} disabled={this.props.role !== "accounatable"} className="form-control select2" multiple="multiple" ref="accounatable" style={{ width: '100%' }}>
                                                        {userdepartments &&
                                                            userdepartments.map(item =>
                                                                <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                    <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                                </optgroup>)
                                                            // <optgroup label={item.id_role.name} key={item.id_role._id}>
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //     {item.id_user.map(x => {
                                                            // {/* ---------------------------------------userId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //         return <option key={x._id} value={x._id}>{x.name}</option>
                                                            //     })}
                                                            // </optgroup>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>Người hỗ trợ</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select multiline="true" defaultValue={task && task.consultedEmployees.map(item => item._id)} disabled={this.props.role !== "accounatable"} className="form-control select2" multiple="multiple" ref="consulted" style={{ width: '100%' }}>
                                                        {userdepartments &&
                                                            userdepartments.map(item =>
                                                                <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                    <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                                </optgroup>)
                                                            // <optgroup label={item.id_role.name} key={item.id_role._id}>
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //     {item.id_user.map(x => {
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //         return <option key={x._id} value={x._id}>{x.name}</option>
                                                            //     })}
                                                            // </optgroup>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>Người quan sát</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select multiline="true" defaultValue={task && task.informedEmployees.map(item => item._id)} disabled={this.props.role !== "accounatable"} className="form-control select2" multiple="multiple" ref="informed" style={{ width: '100%' }}>
                                                        {userdepartments &&
                                                            userdepartments.map(item =>
                                                                <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                    <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                                </optgroup>)
                                                            // <optgroup label={item.id_role.name} key={item.id_role._id}>
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //     {item.id_user.map(x => {
                                                            // {/* ---------------------------------------roleId---------------------------------------------------------**********-------------------*****************------------------------------------- */}

                                                            //         return <option key={x._id} value={x._id}>{x.name}</option>
                                                            //     })}
                                                            // </optgroup>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </React.Fragment>}
                                    {/* Liên kết mục tiêu */}
                                    <div className="col-sm-12">
                                        <label className="control-label" style={{ textAlign: 'left', width: "100%", marginTop: "3px", marginLeft: "10px", fontWeight: "500" }}>
                                            <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng xem thông tin phân định trách nhiệm"} onClick={this.handleChangeExtendKPI}>
                                                <i className={extendKPI ? "fa fa-angle-up" : "fa fa-angle-down"} style={{ fontSize: "15px" }}></i>
                                            </a>
                                            <label style={{ display: "inline", fontWeight: "500" }}>Liên kết mục tiêu (OKR)</label>
                                            {this.props.role !== "informed" && this.props.role !== "consulted" && extendKPI &&
                                                <a href="#abc" className="save_result" title="Lưu chỉnh sửa"><i className="material-icons">save</i></a>}
                                        </label>
                                    </div>
                                    {
                                        extendKPI && listKPIPersonal &&
                                        listKPIPersonal.map(item => {
                                            return <div className='col-sm-12' style={{ paddingTop: "10px" }}>
                                                <label className="col-sm-2 control-label" style={{ width: '12%', textAlign: 'left', fontWeight: "500" }}>{item.creater.name}</label>
                                                <div className="col-sm-8" style={{ width: '88%' }}>
                                                    <select className="form-control select2" defaultValue={task && task.kpis} disabled={this.props.role !== "accounatable" && this.props.role !== "responsible"} multiple="multiple" ref="kpi" data-placeholder="Select a State" style={{ width: '100%' }} >
                                                        {item.listtarget.map(x => {
                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        })
                                    }
                                    {/* Thông tin chung của công việc */}
                                    <div className="col-sm-12" >
                                        <label className="control-label" style={{ textAlign: 'left', width: "100%", marginTop: "3px", marginLeft: "10px", fontWeight: "500" }}>
                                            <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng xem thông tin công việc"} onClick={this.handleChangeExtendInformation}>
                                                <i className={extendInformation ? "fa fa-angle-up" : "fa fa-angle-down"} style={{ fontSize: "15px" }}></i>
                                            </a>
                                            <label style={{ display: "inline", fontWeight: "500", }}>Thông tin công việc</label>
                                            {this.props.role !== "informed" && extendInformation &&
                                                <a href="#abc" className="save_result" title="Lưu chỉnh sửa thông tin công việc" ><i className="material-icons">save</i></a>}
                                        </label>
                                    </div>
                                    {extendInformation &&
                                        <React.Fragment>
                                            <div className="col-sm-12">
                                                <div className="col-sm-4">
                                                    <label className="col-sm-2 control-label" style={{ width: '46%', textAlign: 'left', marginLeft: "-14px", fontWeight: "500" }}>Ngày bắt đầu:</label>
                                                    <div className={'input-group date has-feedback col-sm-8'} style={{ width: '57%' }}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" className="form-control" value={this.formatDate(task && task.startDate)} disabled={this.props.role === "informed" || this.props.role === "consulted"} ref={input => this.startdate = input} name="time" id="datepicker4" data-date-format="dd-mm-yyyy" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="col-sm-2 control-label" style={{ width: '46%', textAlign: 'left', marginLeft: "-14px", fontWeight: "500" }}>Ngày kết thúc:</label>
                                                    <div className={'input-group date has-feedback col-sm-8'} style={{ width: '57%' }}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" className="form-control" value={this.formatDate(task && task.endDate)} disabled={this.props.role === "informed" || this.props.role === "consulted"} ref={input => this.enddate = input} name="time" id="datepicker5" data-date-format="dd-mm-yyyy" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Thời gian quá hạn:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="text" className="form-control" value={this.calculateOverdueDate(task && task.endDate)} ref={input => this.overdate = input} disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Mức độ hoàn thành:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="text" defaultValue={task && task.progress} className="form-control" onChange={() => this.calculateTaskRessultByProgress(informations, task && task.taskTemplate && task.taskTemplate.formula)} disabled={this.props.role === "informed" || this.props.role === "consulted"} ref={input => this.progress = input} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Thời gian làm việc:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="name" className="form-control" value={this.convertTime(task && task.totalLoggedTime)} ref={input => this.time = input} disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>}
                                    {/* Thông tin công viêc theo mẫu */}
                                    {task && task.taskTemplate &&
                                        <React.Fragment>
                                            <div className="col-sm-12" >
                                                <label className="control-label" style={{ textAlign: 'left', width: "100%", marginTop: "3px", marginLeft: "10px", fontWeight: "500" }}>
                                                    <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng xem thông tin công việc"} onClick={this.handleChangeExtendInfoByTemplate}>
                                                        <i className={extendInfoByTemplate ? "fa fa-angle-up" : "fa fa-angle-down"} style={{ fontSize: "15px" }}></i>
                                                    </a>
                                                    <label style={{ display: "inline", fontWeight: "500" }}>Thông tin nhập liệu theo mẫu công việc</label>
                                                    {(this.props.role === "responsible" || this.props.role === "accountable") && extendInfoByTemplate &&
                                                        <a href="#abc" className="save_result" title="Lưu thông tin theo mẫu công việc" ><i className="material-icons">save</i></a>}
                                                </label>
                                            </div>
                                            {extendInfoByTemplate && informations &&
                                                <div className="col-sm-12" style={{ marginTop: "1%" }}>
                                                    {informations.map(item => <div className="col-sm-4" key={item._id}>
                                                        <div className='form-group has-feedback'>
                                                            <label className="col-sm-2" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>{item.name}</label>
                                                            <div className="col-sm-8" style={{ width: '60%' }}>
                                                                <input type={item.type} className="form-control" placeholder="80" onChange={() => this.calculateTaskRessult(informations, task && task.taskTemplate.formula)} ref={item.code} disabled={this.props.role !== "responsible" && this.props.role !== "accountable"} />
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                </div>}
                                        </React.Fragment>}
                                    {/* Đánh giá kết quả thực hiện công việc */}
                                    <div className="col-sm-12" style={{ marginBottom: "20px" }}>
                                        <label className="control-label" style={{ textAlign: 'left', width: "100%", marginTop: "3px", marginLeft: "10px", fontWeight: "500" }}>
                                            <a href="#abc" className="default" style={{ minWidth: "12px" }} title={extendDescription ? "Rút gọn" : "Mở rộng xem thông tin công việc"} onClick={this.handleChangeExtendApproveRessult}>
                                                <i className={extendApproveRessult ? "fa fa-angle-up" : "fa fa-angle-down"} style={{ fontSize: "15px" }}></i>
                                            </a>
                                            <label style={{ display: "inline", fontWeight: "500" }}>Đánh giá kết quả công việc</label>
                                            {this.props.role !== "informed" && extendApproveRessult &&
                                                <a href="#abc" className="save_result" title="Lưu kết quả đánh giá" ><i className="material-icons">save</i></a>}
                                        </label>
                                    </div>
                                    <div className="col-sm-12">
                                        {extendApproveRessult && <React.Fragment>
                                            <div className="col-sm-12">
                                                <div className='form-group'>
                                                    <label className="col-sm-2 control-label" style={{ width: '14%', textAlign: 'left', fontWeight: "500", fontSize: "medium" }}>Điểm hệ thống tính:</label>
                                                    <div className="col-sm-8" style={{ width: '30%' }}>
                                                        <input type="number" className="form-control" placeholder="75" value={this.state.resultTask} ref={input => this.resultTask = input} disabled />
                                                    </div>
                                                    {/* <label className="col-sm-2 control-label" style={{width: "57%", color: "blue"}}>(Điểm được tính theo công thức {task && task.taskTemplate.formula}. Trong đó, px là các thông tin nhập liệu từ mẫu công việc)</label> */}
                                                </div>
                                            </div>
                                            <label className="col-sm-12" style={{ fontSize: "medium", fontWeight: "500" }}>Vai trò người thực hiện:</label>
                                            {task && task.responsibleEmployees.map(item => <div className="col-sm-12" key={item._id}>
                                                <div className="control-label col-sm-3" style={{ width: "12%" }}>
                                                    <label style={{ fontWeight: "500" }}>{item.name}:</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm tự đánh giá:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" onChange={() => this.handleChangeMyPoint(item._id)} disabled={item._id !== this.state.currentUser} ref={input => this.mypoint[item._id] = input} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm quản lý chấm:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" ref={input => this.approvepoint[item._id] = input} disabled={this.props.role !== "accountable"} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                            <label className="col-sm-12" style={{ fontSize: "medium", fontWeight: "500" }}>Vai trò người phê duyệt:</label>
                                            {task && task.accountableEmployees.map(item => <div className="col-sm-12" key={item._id}>
                                                <div className="control-label col-sm-3" style={{ width: "12%" }}>
                                                    <label style={{ fontWeight: "500" }}>{item.name}:</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm tự đánh giá:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" disabled={this.props.role !== "accountable" || item._id !== this.state.currentUser} ref={input => this.name = input} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm quản lý chấm:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" ref={input => this.name = input} disabled={true} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                            <label className="col-sm-12" style={{ fontSize: "medium", fontWeight: "500" }}>Vai trò người hỗ trợ:</label>
                                            {task && task.consultedEmployees.map(item => <div className="col-sm-12" key={item._id}>
                                                <div className="control-label col-sm-3" style={{ width: "12%" }}>
                                                    <label style={{ fontWeight: "500" }}>{item.name}:</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm tự đánh giá:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" disabled={this.props.currentUser !== item._id} ref={input => this.name = input} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className='form-group has-feedback'>
                                                        <label className="col-sm-2 control-label" style={{ width: '40%', textAlign: 'left', fontWeight: "500" }}>Điểm quản lý chấm:</label>
                                                        <div className="col-sm-8" style={{ width: '60%' }}>
                                                            <input type="number" className="form-control" placeholder="80" ref={input => this.name = input} disabled={this.props.role !== "accountable"} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                        </React.Fragment>}
                                    </div>
                                </div>
                            </form>
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs" style={{ borderTop: "solid", borderWidth: "thin", borderColor: "aliceblue", width: "60%" }}>
                                    <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">Hoạt động</a></li>
                                    <li><a href="#actionComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">Trao đổi</a></li>
                                    <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">Tài liệu</a></li>
                                    <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">Công việc con</a></li>
                                    <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">Lịch sử bấm giờ</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                                        {/* Hoạt động của công việc theo mẫu */}
                                        {actions &&
                                            actions.map((item, index) =>
                                                <div className="post clearfix" style={{ width: "50%" }} key={item._id}>
                                                    <div className="col-sm-11">
                                                        <div className="user-block" style={{ display: "inline-block", marginBottom: "0px", textAlign: 'left', width: "100%", marginTop: "-1%", marginLeft: "15px" }}>
                                                            <p>{index + 1 + ". "}{item.name}</p>
                                                        </div>
                                                        {/* Phê duyệt hoạt động theo mẫu */}
                                                        {this.props.role === "accountable" &&
                                                            <div className="action-comment" style={{ display: "inline-block" }}>
                                                                <a href="#abc" title="Đạt" className="add_circle"><i className="material-icons">check_circle_outline</i></a>
                                                                <a href="#abc" title="Không đạt" className="delete"><i className="material-icons">highlight_off</i></a>
                                                            </div>
                                                        }
                                                        {/* Hành động mở bình luận của hoạt động */}
                                                        <div className="action-comment" style={{ display: "inline-block", textAlign: 'left', width: "100%", marginTop: "-1%", marginLeft: "10px" }}>
                                                            <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}>
                                                                {showChildComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-1">
                                                        {/* Xác nhận hoàn thành hành động của người thực hiện */}
                                                        {item.approve !== 1 && this.props.role === "responsible" &&
                                                            <div className="action-comment" title="Xác nhận đã hoàn thành hoạt động này" style={{ display: "inline-block" }}>
                                                                <i className="material-icons" style={{ color: "blue", fontWeight: "bold" }}>check</i>
                                                            </div>
                                                        }
                                                    </div>
                                                    <React.Fragment>
                                                        {/* Hiển thị bình luận cho hoạt động của công việc theo mẫu */}
                                                        {showChildComment === item._id &&
                                                            <div className="comment-content-child">
                                                                {
                                                                    item.comments.map(child => {
                                                                        if (child.parent === item._id) return <div className="col-sm-12 " key={child._id} style={{ marginBottom: "10px" }}>
                                                                            <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                                <img className="img-circle img-bordered-sm"
                                                                                    src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                                    style={{ height: "30px", width: "30px" }} />
                                                                            </div>
                                                                            <div className="col-sm-10" style={{ marginLeft: "-20%" }} >
                                                                                <p style={{ marginBottom: "-4px", marginLeft: "-60px" }}>&nbsp;{child.content}</p>
                                                                                {/*<a href={item.file.url} download>{item.file.name}</a>*/}
                                                                                <span className="description">19:30 19-11-2020</span>
                                                                                {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                                                    <div className="action-comment" style={{ display: "inline-block" }}>
                                                                                        <a href="#abc" title="Sửa bình luận" className="edit" onClick={() => this.handleEditActionComment(child._id)}><i className="material-icons">edit</i></a>
                                                                                        <a href="#abc" title="Xóa bình luận" className="delete" onClick={() => this.props.deleteActionComment(child._id)}><i className="material-icons">delete</i></a>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            {editComment === child._id &&
                                                                                <React.Fragment>
                                                                                    <textarea
                                                                                        style={{ width: '87%', height: 50, fontSize: 13, border: '1px solid #dddddd' }}
                                                                                        defaultValue={child.content}
                                                                                        ref={input => this.newContentComment[child._id] = input}
                                                                                    />
                                                                                    <div className="row action-post" style={{ marginLeft: "40px", marginRight: "18px" }}>
                                                                                        <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                                        <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                                                                    </div>
                                                                                </React.Fragment>
                                                                            }
                                                                        </div>;
                                                                        return true;
                                                                    })
                                                                }
                                                                {/* Thêm bình luận cho hoạt động của công việc theo mẫu */}

                                                                <div className="comment-child-action">
                                                                    <form className="form-horizontal" style={{ paddingTop: "1%" }}>
                                                                        <div className="col-sm-12 margin-bottom-none">
                                                                            <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                                <img className="img-circle img-bordered-sm"
                                                                                    //adminLTE/dist/img/user3-128x128.jpg
                                                                                    src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                                    style={{ height: "30px", width: "30px" }} />
                                                                            </div>
                                                                            <div className="col-sm-11" style={{ marginLeft: "9px" }} >
                                                                                <textarea placeholder="Hãy nhập nội dung bình luận"
                                                                                    style={{ width: '100%', height: 50, fontSize: 13, border: '1px solid #dddddd' }} ref={input => this.contentComment[item._id] = input} />
                                                                                <div className="row action-post" style={{ width: "107%" }}>
                                                                                    <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                                    <button style={{ width: "20%", marginRight: "2%", textAlign: "center" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id)}>Gửi bình luận</button>
                                                                                    <button style={{ width: "16%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        }
                                                    </React.Fragment>
                                                </div>)
                                        }
                                        {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                                            // Hiển thị hoạt động của công việc không theo mẫu
                                            taskActions.map(item => {
                                                // if (item.parent === null)
                                                return <div className="post clearfix" style={{ textAlign: 'left', width: "40%", marginTop: "5%", marginLeft: "15px" }} key={item._id}>
                                                    <div className="user-block" style={{ display: "inline-block", marginBottom: "0px" }}>
                                                        <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                                        <span className="username">
                                                            <a href="#abc">{item.creator.name}</a>
                                                        </span>
                                                        <p style={{ marginBottom: "4px", marginLeft: "60px" }}>&nbsp;{item.content}</p>
                                                        <span className="description">19:30 19-11-2021</span>
                                                    </div>
                                                    {(item.creator._id === this.state.currentUser && this.props.role === "responsible") &&
                                                        <div className="action-comment " style={{ display: "inline-block" }}>
                                                            <a href="#abc" title="Sửa hành động" className="edit" onClick={() => this.handleEditAction(item._id)}><i className="material-icons">edit</i></a>
                                                            <a href="#abc" title="Xóa hành động" className="delete" onClick={() => this.props.deleteTaskAction(item._id,this.props.id)}><i className="material-icons">delete</i></a>
                                                        </div>
                                                    }
                                                    {this.props.role === "accountable" &&
                                                        <div className="action-comment" style={{ display: "inline-block" }}>
                                                            <a href="#abc" title="Đạt" className="add_circle"><i className="material-icons">check_circle_outline</i></a>
                                                            <a href="#abc" title="Không đạt" className="delete"><i className="material-icons">highlight_off</i></a>
                                                        </div>
                                                    }
                                                    <div className="comment-content" style={{ marginLeft: "8%" }}>
                                                        {editAction === item._id ?
                                                            <React.Fragment>
                                                                {/* Chỉnh sửa nội dung hoạt động của công việc không theo mẫu */}
                                                                <textarea
                                                                    style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd' }}
                                                                    defaultValue={item.content}
                                                                    ref={input => this.newContentAction[item._id] = input}
                                                                />
                                                                <div className="row action-post">
                                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                    <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditAction(e, item._id)}>Gửi chỉnh sửa</button>
                                                                    <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditAction(e)}>Hủy bỏ</button>
                                                                </div>
                                                            </React.Fragment> :
                                                            <React.Fragment>
                                                                {/* Hiển thị nội dung hoạt động cho công việc không theo mẫu */}
                                                                <div className="attach-file" style={{ marginTop: "-10px" }}>
                                                                    {/* <a href={item.file.url} download>{item.file.name}</a> */}
                                                                </div>
                                                                <ul className="list-inline">
                                                                    <li className="pull-right">
                                                                        <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}>
                                                                            <i className="fa fa-comments-o margin-r-5" /> Bình luận({item.comments.filter(child => child.parent === item._id).reduce(sum => sum + 1, 0)}) &nbsp;
                                                                            {showChildComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                                {/* Hiển thị bình luận cho hoạt động không theo mẫu */}
                                                                {showChildComment === item._id &&
                                                                    <div className="comment-content-child">
                                                                        {item.comments.map(child => {
                                                                            if (child.parent === item._id) return <div className="col-sm-12 form-group margin-bottom-none" key={child._id}>
                                                                                <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "2%" }}>
                                                                                    <img className="img-circle img-bordered-sm"
                                                                                        src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                                        style={{ height: "30px", width: "30px" }} />
                                                                                </div>
                                                                                <div className="col-sm-11" style={{ marginBottom: "10px" }} >
                                                                                    <span className="username">
                                                                                        <a href="#abc">{item.creator.name}</a>
                                                                                    </span>
                                                                                    <p style={{ marginBottom: "-2px" }}>&nbsp;{child.content}</p>
                                                                                    {/* <a href={child.file.url} download>{child.file.name}</a> */}
                                                                                    <span className="description">19:30 19-11-2019</span>
                                                                                    {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                                                        <div className="action-comment" style={{ display: "inline-block" }}>
                                                                                            <a href="#abc" title="Sửa bình luận" className="edit" onClick={() => this.handleEditActionComment(child._id)}><i className="material-icons">edit</i></a>
                                                                                            <a href="#abc" title="Xóa bình luận" className="delete" onClick={() => this.props.deleteActionComment(child._id,this.props.id)}><i className="material-icons">delete</i></a>
                                                                                        </div>
                                                                                    }
                                                                                    {editComment === child._id &&
                                                                                        <React.Fragment>
                                                                                            <textarea
                                                                                                style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px" }}
                                                                                                defaultValue={child.content}
                                                                                                ref={input => this.newContentComment[child._id] = input}
                                                                                            />
                                                                                            <div className="row action-post" style={{ marginRight: "-4px", marginBottom: "10px", marginLeft: "5px" }}>
                                                                                                <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                                                <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                                                <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    }
                                                                                </div>
                                                                            </div>;
                                                                            return true;
                                                                        })
                                                                        }
                                                                        <div className="comment-child-action">
                                                                            <form className="form-horizontal">
                                                                                <div className="col-sm-12 margin-bottom-none" style={{ marginTop: "10px" }}>
                                                                                    <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                                        <img className="img-circle img-bordered-sm"
                                                                                            src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                                            style={{ height: "30px", width: "30px" }} />
                                                                                    </div>
                                                                                    <div className="col-sm-11" >
                                                                                        <textarea placeholder="Hãy nhập nội dung bình luận"
                                                                                            style={{ width: '100%', height: 40, fontSize: 13, border: '1px solid #dddddd' }} ref={input => this.contentComment[item._id] = input} />
                                                                                        <div className="row action-post" style={{ width: "107%" }}>
                                                                                            <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                                            <button type="submit" style={{ width: "20%", marginRight: "2%", textAlign: "center" }} className="col-xs-2 col-xs-offset-7 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id)}>Gửi bình luận  </button>
                                                                                            <button style={{ width: "16%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </React.Fragment>
                                                        }
                                                    </div>
                                                </div>;
                                                return true;
                                            }) : null
                                        }
                                        {/* Thêm hoạt động cho công việc không theo mẫu */}
                                        {this.props.role === "responsible" &&
                                            <form className="form-horizontal" style={{ paddingTop: "2%" }}>
                                                <div className="form-group margin-bottom-none">
                                                    <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                        <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                                    </div>
                                                    <div className="col-sm-8" >
                                                        <textarea placeholder="Hãy nhập nội dung hoạt động"
                                                            style={{ width: '60%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "-360px" }}
                                                            onClick={this.handleAction} ref={input => this.contentAction[0] = input} />
                                                        {action &&
                                                            <div className="row action-post" style={{ width: "69.5%" }}>
                                                                <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />

                                                                <button type="submit" style={{ width: "18%", marginRight: "2%", marginLeft: "-15%" }} className="col-xs-1 btn btn-success btn-sm" onClick={(e) => this.submitAction(e, null, 0)}>Thêm hoạt động</button>
                                                                <button style={{ width: "13%", }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleAction}>Hủy bỏ</button>
                                                            </div>}
                                                    </div>
                                                </div>
                                            </form>}
                                    </div>
                                    {/* Chuyển qua tab trao đổi */}
                                    <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                                        <div>Tab trao đổi</div>
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
                    </div>
                </div>
            </div >
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user, KPIPersonalManager } = state;//cho là overviewKpiPersonal
    return { tasks, performtasks, user, KPIPersonalManager };
}

const actionCreators = {
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
    getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalOfResponsible,    //kpi member actions ko thì cho vào managerKpiActions (của personal) cũng đc
};
const connectedModalPerformTask = connect(mapState, actionCreators)(ModalPerformTask);
export { connectedModalPerformTask as ModalPerformTask };
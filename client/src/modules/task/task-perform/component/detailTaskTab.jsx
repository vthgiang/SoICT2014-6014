import React, { Component } from 'react';
import { connect } from 'react-redux';

import { performTaskAction } from './../redux/actions';
import { taskManagementActions } from './../../task-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

import { ModalEditTaskByResponsibleEmployee } from './modalEditTaskByResponsibleEmployee';
import { ModalEditTaskByAccountableEmployee } from './modalEditTaskByAccountableEmployee';

import { EvaluationModal } from './evaluationModal';
import { getStorage } from '../../../../config';
import { SelectFollowingTaskModal } from './selectFollowingTaskModal';

import { withTranslate } from 'react-redux-multilingual';
import './detailTaskTab.css';
import Swal from 'sweetalert2';

class DetailTaskTab extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;
        var idUser = getStorage("userId");

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.ROLE = {
            RESPONSIBLE: { name: translate('task.task_management.responsible'), value: "responsible" },
            ACCOUNTABLE: { name: translate('task.task_management.accountable'), value: "accountable" },
            CONSULTED: { name: translate('task.task_management.consulted'), value: "consulted" },
            CREATOR: { name: translate('task.task_management.creator'), value: "creator" },
            INFORMED: { name: translate('task.task_management.informed'), value: "informed" },
        };

        this.state = {
            collapseInfo: false,
            openTimeCounnt: false,
            startTimer: false,
            pauseTimer: false,
            highestIndex: 0,
            currentUser: idUser,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            currentMonth: currentYear + '-' + (currentMonth + 1),
            nextMonth: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }

    }

    shouldComponentUpdate = (nextProps, nextState) => {

        if (nextProps.id !== this.state.id) {

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return true;
        }

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.tasks.task) {
                return false;
            } else { // Dữ liệu đã về
                let task = nextProps.task;

                this.props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id);

                let roles = [];
                if (task) {
                    let userId = getStorage("userId");
                    let tmp = task.responsibleEmployees.find(item => item._id === userId);
                    if (tmp) {
                        roles.push(this.ROLE.RESPONSIBLE);
                    }

                    tmp = task.accountableEmployees.find(item => item._id === userId);
                    if (tmp) {
                        roles.push(this.ROLE.ACCOUNTABLE);
                    }

                    tmp = task.consultedEmployees.find(item => item._id === userId);
                    if (tmp) {
                        roles.push(this.ROLE.CONSULTED);
                    }

                    tmp = task.informedEmployees.find(item => item._id === userId);
                    if (tmp) {
                        roles.push(this.ROLE.INFORMED);
                    }

                    if (userId === task.creator._id) {
                        roles.push(this.ROLE.CREATOR);
                    }
                }

                let currentRole;
                if (roles.length > 0) {
                    currentRole = roles[0].value;
                    if (this.props.onChangeTaskRole) {
                        this.props.onChangeTaskRole(currentRole);
                    }
                }

                this.setState(state => {
                    return {
                        ...state,
                        dataStatus: this.DATA_STATUS.FINISHED,
                        roles: roles,
                        currentRole: roles.length > 0 ? roles[0].value : null,
                    }
                })
                return false;
            }
        }
        return true;
    }

    handleChangeCollapseInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                collapseInfo: !state.collapseInfo
            }
        });
    }

    startTimer = async (taskId, userId) => {
        var timer = {
            creator: userId,
        };
        this.props.startTimer(taskId, timer);
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "Inprocess") return translate('task.task_management.inprocess');
        else if (data === "WaitForApproval") return translate('task.task_management.wait_for_approval');
        else if (data === "Finished") return translate('task.task_management.finished');
        else if (data === "Delayed") return translate('task.task_management.delayed');
        else if (data === "Canceled") return translate('task.task_management.canceled');
    }

    // convert ISODate to String dd-mm-yyyy
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

    handleShowEdit = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEdit: id
            }
        });
        window.$(`#modal-edit-task-by-${role}-${id}`).modal('show');

    }

    handleEndTask = async (id, status, codeInProcess, typeOfTask) => {
        await this.setState(state => {
            return {
                ...state,
                showEndTask: id,
            }
        });
        if (codeInProcess) {
            if (typeOfTask === "Gateway") {
                window.$(`#modal-select-following-task`).modal('show');
            }
            else {
                Swal.fire({
                    title: "Bạn có chắc chắn muốn kết thúc công việc",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: this.props.translate('general.no'),
                    confirmButtonText: this.props.translate('general.yes'),
                }).then((result) => {
                    if (result.value) {
                        this.props.editStatusTask(id, status, typeOfTask)
                    }
                })
            }
        }
        else {
            Swal.fire({
                title: "Bạn có chắc chắn muốn kết thúc công việc",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.translate('general.no'),
                confirmButtonText: this.props.translate('general.yes'),
            }).then((result) => {
                if (result.value) {
                    this.props.editStatusTask(id, status, false)
                }
            })
        }
    }

    handleShowEvaluate = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEvaluate: id
            }
        });
        // window.$(`#modal-evaluate-task-by-${role}-${id}-evaluate`).modal('show');
        window.$(`#task-evaluation-modal-${id}-`).modal('show');

    }
    refresh = async () => {
        this.props.getTaskById(this.state.id);
        this.props.getSubTask(this.state.id);
        this.props.getTimesheetLogs(this.state.id);
        this.props.getTaskLog(this.state.id);
        await this.setState(state => {
            return {
                ...state,
                showEdit: undefined,
                showEndTask: undefined,
                showEvaluate: undefined,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        })

    }
    changeRole = (role) => {
        this.setState(state => {
            return {
                ...state,
                currentRole: role
            }
        })
        this.props.onChangeTaskRole(role);
    }

    checkConfirmTask = (task) => {
        const { currentUser } = this.state;

        let checkConfirmByRole = false, checkConfirmCurrentUser = false, listEmployee, responsibleEmployeesNotConfirm = [], accountableEmployeesNotConfirm = [], consultedEmployeesNotConfirm = [];
        let confirmedByEmployeesId, listEmployeeId;
        
        if (task && task.responsibleEmployees && task.accountableEmployees && task.consultedEmployees && task.confirmedByEmployees) {
            listEmployee = task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees);
            confirmedByEmployeesId = task.confirmedByEmployees.map(item => item._id);
            listEmployeeId = listEmployee.map(item => item._id);

            task.responsibleEmployees.map(item => {
                if (!confirmedByEmployeesId.includes(item._id)) {
                    responsibleEmployeesNotConfirm.push(item);
                }
            })

            task.accountableEmployees.map(item => {
                if (!confirmedByEmployeesId.includes(item._id)) {
                    accountableEmployeesNotConfirm.push(item);
                }
            })

            task.consultedEmployees.map(item => {
                if (!confirmedByEmployeesId.includes(item._id)) {
                    consultedEmployeesNotConfirm.push(item);
                }
            })

            if (listEmployeeId.includes(currentUser) && !confirmedByEmployeesId.includes(currentUser)) {
                checkConfirmCurrentUser = true
            };
        }

        if (responsibleEmployeesNotConfirm.length !== 0
            || accountableEmployeesNotConfirm.length !== 0
            || consultedEmployeesNotConfirm !== 0)
        {
            checkConfirmByRole = true;
        }

        return {
            responsibleEmployeesNotConfirm: responsibleEmployeesNotConfirm,
            accountableEmployeesNotConfirm: accountableEmployeesNotConfirm,
            consultedEmployeesNotConfirm: consultedEmployeesNotConfirm,
            checkConfirmCurrentUser: checkConfirmCurrentUser,
            checkConfirmByRole: checkConfirmByRole,
            checkConfirm: checkConfirmByRole || checkConfirmCurrentUser
        }
    }

    checkEvaluationTaskAction = (task) => {
        const { currentMonth, nextMonth } = this.state;

        let taskActionNotEvaluate = [];

        if (task) {
            if (task.taskActions && task.taskActions.length !== 0) {
                task.taskActions.map(action => {
                    if (action.evaluations) {
                        let evaluations = action.evaluations.filter(item => new Date(item.updatedAt) >= new Date(currentMonth) && new Date(item.updatedAt) < new Date(nextMonth));
                        if (evaluations && evaluations.length === 0) {
                            taskActionNotEvaluate.push(action);
                        }
                    }
                })
            }
        }

        return {
            checkEvaluationTaskAction: taskActionNotEvaluate.length !== 0,
            taskActionNotEvaluate: taskActionNotEvaluate
        }
    }

    checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation = (task) => {
        const { currentMonth, nextMonth } = this.state;

        let evaluations = [], checkEvaluationTask = false, checkDeadlineForEvaluation = false;
        let responsibleEmployeesNotKpiLink = [], accountableEmployeesNotKpiLink = [], consultedEmployeesNotKpiLink = [], deadlineForEvaluation;

        if (task && task.evaluations) {
            evaluations = task.evaluations.filter(item => new Date(item.date) >= new Date(currentMonth) && new Date(item.date) < new Date(nextMonth));
            
            if (evaluations.length === 0) {
                // Check đánh giá trong tháng
                checkEvaluationTask = true;

                // Nhân viên chưa liên kết KPI
                responsibleEmployeesNotKpiLink = task.responsibleEmployees;
                accountableEmployeesNotKpiLink = task.accountableEmployees;
                consultedEmployeesNotKpiLink = task.consultedEmployees;
            } else {
                let currentDate = new Date();
                let evaluationDate = new Date(evaluations[0].date);

                // Check số ngày đến hạn đánh giá
                deadlineForEvaluation = (evaluationDate.getTime() - currentDate.getTime()) / (3600 * 24 * 1000);
                if (deadlineForEvaluation <= 7) {
                    checkDeadlineForEvaluation = true;

                    if (deadlineForEvaluation <= 0) {
                        deadlineForEvaluation = -1;
                    } else if (deadlineForEvaluation < 1) {
                        deadlineForEvaluation = Math.floor(deadlineForEvaluation * 24) + ' giờ';
                    } else {
                        deadlineForEvaluation = Math.floor(deadlineForEvaluation) + ' ngày';
                    }
                }

                // Nhân viên chưa liên kết KPI
                if (evaluations[0].results && evaluations[0].results.length !== 0) {
                    if (task.responsibleEmployees) {
                        responsibleEmployeesNotKpiLink = task.responsibleEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id && evaluations[0].results[i].role === 'Responsible') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }
                    if (task.accountableEmployees) {
                        accountableEmployeesNotKpiLink = task.accountableEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id && evaluations[0].results[i].role === 'Accountable') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }
                    if (task.consultedEmployees) {
                        consultedEmployeesNotKpiLink = task.consultedEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id  && evaluations[0].results[i].role === 'Consulted') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }
                } else {
                    // Nhân viên chưa liên kết KPI
                    responsibleEmployeesNotKpiLink = task.responsibleEmployees;
                    accountableEmployeesNotKpiLink = task.accountableEmployees;
                    consultedEmployeesNotKpiLink = task.consultedEmployees;
                }
            }
        }

        return {
            checkEvaluationTask: checkEvaluationTask,
            checkDeadlineForEvaluation: checkDeadlineForEvaluation,
            deadlineForEvaluation: deadlineForEvaluation,
            checkKpiLink: (responsibleEmployeesNotKpiLink.length !== 0) || (accountableEmployeesNotKpiLink.length !== 0) || (consultedEmployeesNotKpiLink.length !== 0),
            responsibleEmployeesNotKpiLink: responsibleEmployeesNotKpiLink,
            accountableEmployeesNotKpiLink: accountableEmployeesNotKpiLink,
            consultedEmployeesNotKpiLink: consultedEmployeesNotKpiLink
        }
    }

    render() {
        const { tasks, performtasks, translate } = this.props;
        const { currentUser, roles, currentRole, collapseInfo, showEdit, showEndTask, showEvaluate } = this.state
        const { showToolbar, id, isProcess } = this.props; // props form parent component ( task, id, showToolbar, onChangeTaskRole() )

        let task;
        let codeInProcess, typeOfTask, statusTask, checkInactive = true, evaluations, evalList = [];

        // Các biến dùng trong phần Nhắc Nhở
        let warning = false, checkConfirmTask, checkEvaluationTaskAction, checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation;

        if (isProcess) {
            task = this.props.task
        }
        else if (performtasks) {
            task = performtasks.task;
        }

        if (task) {
            codeInProcess = task.codeInProcess;
            if (codeInProcess) {
                let splitter = codeInProcess.split("_");
                typeOfTask = splitter[0];
            }
        }
        if (task) {
            statusTask = task.status;
        }
        if (task) {
            checkInactive = task.inactiveEmployees.indexOf(currentUser) === -1
        }; // return true if user is active user
        if (task && task.evaluations && task.evaluations.length !== 0) {
            evaluations = task.evaluations; //.reverse()
        }
        if (evaluations && evaluations.length > 0) {
            for (let i = 0; i < evaluations.length; i++) {
                let prevEval;
                let prevDate = task.startDate;
                let splitter = this.formatDate(evaluations[i].date).split("-");

                let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                let newMonth = dateOfPrevEval.getMonth() - 1;
                if (newMonth < 0) {
                    newMonth += 12;
                    dateOfPrevEval.setYear(dateOfPrevEval.getYear() - 1);
                }
                dateOfPrevEval.setMonth(newMonth);

                let monthOfPrevEval = dateOfPrevEval.getMonth();
                let yearOfPrevEval = dateOfPrevEval.getFullYear();

                prevEval = evaluations.find(e => (monthOfPrevEval === new Date(e.date).getMonth() && yearOfPrevEval === new Date(e.date).getFullYear()));

                if (prevEval) {
                    prevDate = prevEval.date;
                }

                evalList.push({ ...evaluations[i], prevDate: prevDate })
            }
        }


        // Xử lý dữ liệu phần Nhắc nhở
        checkConfirmTask = this.checkConfirmTask(task);
        checkEvaluationTaskAction = this.checkEvaluationTaskAction(task);
        checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation = this.checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation(task);

        warning = (checkConfirmTask && checkConfirmTask.checkConfirm)
            || (checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction)
            || (checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkEvaluationTask)
            || (checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkKpiLink)
            || (checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkDeadlineForEvaluation);

        return (
            <React.Fragment>
                {(showToolbar) &&
                    <div style={{ marginLeft: "-10px" }}>
                        <a className="btn btn-app" onClick={this.refresh} title="Refresh">
                            <i className="fa fa-refresh" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_refresh')}
                        </a>

                        {((currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                            <a className="btn btn-app" onClick={() => this.handleShowEdit(id, currentRole)} title="Chỉnh sửa thông tin chung">
                                <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_edit')}
                            </a>
                        }
                        {
                            performtasks?.task?.status !== "Finished" &&
                            <React.Fragment>
                                {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                                    <a className="btn btn-app" onClick={() => !performtasks.currentTimer && this.startTimer(task._id, currentUser)} title="Bắt đầu thực hiện công việc" disabled={performtasks.currentTimer}>
                                        <i className="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_start_timer')}
                                    </a>
                                }
                            </React.Fragment>
                        }


                        {currentRole === "accountable" && checkInactive && codeInProcess &&
                            (statusTask !== "Finished" &&
                                // <a className="btn btn-app" onClick={() => this.handleEndTask(id, "Inprocess", codeInProcess, typeOfTask)} title="Công việc đã kết thúc">
                                //     <i className="fa fa-times" style={{ fontSize: "16px" }}></i>{"Hủy kết thúc"}
                                // </a> :
                                <a className="btn btn-app" onClick={() => this.handleEndTask(id, "Finished", codeInProcess, typeOfTask)} title="Kết thúc công việc">
                                    <i className="fa fa-power-off" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_end')}
                                </a>
                            )
                        }

                        {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                            <React.Fragment>
                                {/* <a className="btn btn-app" onClick={() => this.handleShowEndTask(id, currentRole)} title="Kết thúc công việc">
                                    <i className="fa fa-power-off" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_end')}
                                </a> */}

                                <a className="btn btn-app" onClick={() => this.handleShowEvaluate(id, currentRole)} title="Đánh giá công việc">
                                    <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_evaluate')}
                                </a>
                            </React.Fragment>
                        }
                        {
                            (collapseInfo === false) ?
                                <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                                    <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_hide_info')}
                                </a> :
                                <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                                    <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_show_info')}
                                </a>
                        }

                        {roles && roles.length > 1 &&
                            <div className="dropdown" style={{ margin: "10px 0px 0px 10px", display: "inline-block" }}>
                                <a className="btn btn-app" style={{ margin: "-10px 0px 0px 0px" }} data-toggle="dropdown">
                                    <i className="fa fa-user" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_choose_role')}
                                </a>
                                <ul className="dropdown-menu">
                                    {roles.map(
                                        (item, index) => { return <li className={item.value === currentRole ? "active" : undefined} key={index}><a href="#" onClick={() => this.changeRole(item.value)}>{item.name}</a></li> }
                                    )}
                                </ul>
                            </div>
                        }
                    </div>
                }

                <div>
                    <div id="info" className="collapse in">
                    {/* Thông tin chung */}
                        {/** Nhắc nhở */}
                        {
                            warning
                            && <div className="description-box">
                                <h4 style={{ color: "red" }}>Nhắc nhở</h4>
                                {/** Xác nhận công việc */}
                                {
                                    checkConfirmTask && checkConfirmTask.checkConfirmCurrentUser
                                    && <div><strong>Bạn chưa xác nhận công việc này</strong></div>
                                }
                                {
                                    checkConfirmTask && checkConfirmTask.checkConfirmByRole
                                    && <div>
                                        <strong>Chưa xác nhận công việc</strong>
                                        <ul>
                                            {
                                                checkConfirmTask.responsibleEmployeesNotConfirm.length !== 0
                                                && <li><strong>Người thực hiện: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkConfirmTask.responsibleEmployeesNotConfirm.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                            {
                                                checkConfirmTask.accountableEmployeesNotConfirm.length !== 0
                                                && <li><strong>Người phê duyệt: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkConfirmTask.accountableEmployeesNotConfirm.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                            {
                                                checkConfirmTask.consultedEmployeesNotConfirm.length !== 0
                                                && <li><strong>Người hỗ trợ: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkConfirmTask.consultedEmployeesNotConfirm.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                }

                                {/** Chưa có đánh giá */}
                                {
                                    checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkEvaluationTask
                                    && <div><strong>Công việc chưa có đánh giá cho tháng này</strong></div>
                                }
                                
                                {/** Chưa đánh giá hoạt động */}
                                {
                                    checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction
                                    && <div>
                                        <strong>Hoạt động chưa được đánh giá tháng này</strong>
                                        <ul>
                                            {
                                                checkEvaluationTaskAction.taskActionNotEvaluate.length !== 0
                                                && checkEvaluationTaskAction.taskActionNotEvaluate.map(item => {
                                                    return <li>{item.name}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                }

                                {/** Chưa liên kết KPI */}
                                {
                                    checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkKpiLink
                                    && <div>
                                        <strong>Chưa liên kết KPI tháng này</strong>
                                        <ul>
                                            {
                                                checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.responsibleEmployeesNotKpiLink.length !== 0
                                                && <li><strong>Người thực hiện: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.responsibleEmployeesNotKpiLink.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                            {
                                                checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.accountableEmployeesNotKpiLink.length !== 0
                                                && <li><strong>Người phê duyệt: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.accountableEmployeesNotKpiLink.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                            {
                                                checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.consultedEmployeesNotKpiLink.length !== 0
                                                && <li><strong>Người hỗ trợ: </strong>
                                                    &nbsp;&nbsp;
                                                    {
                                                        checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.consultedEmployeesNotKpiLink.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            return <span key={index}>{seperator}{item.name}</span>
                                                        })
                                                    }
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                }

                                {/** Thời hạn chỉnh sửa thông tin */}
                                {
                                    checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.checkDeadlineForEvaluation
                                    && checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.deadlineForEvaluation !== -1
                                        ? <div><strong> Còn <span style={{ color: "red" }}>{checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.deadlineForEvaluation}</span> là đến hạn chỉnh sửa đánh giá công việc tháng này</strong></div>
                                        : checkEvaluationTaskAndKpiLinkAndDeadlineForEvaluation.deadlineForEvaluation === -1 && <strong>Đã quá hạn chỉnh sửa đánh giá công việc tháng này</strong>
                                        
                                }
                            </div>
                        }
                        
                        {/* Các trường thông tin cơ bản */}
                        {task &&
                            <div className="description-box">
                                <h4>{translate('task.task_management.detail_general_info')}</h4>

                                <div><strong>{translate('task.task_management.detail_link')}: &nbsp;&nbsp;</strong> <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a></div>
                                <div><strong>{translate('task.task_management.detail_time')}: &nbsp;&nbsp;</strong> {this.formatDate(task && task.startDate)} <i className="fa fa-fw fa-caret-right"></i> {this.formatDate(task && task.endDate)}</div>
                                <div><strong>{translate('task.task_management.unit_manage_task')}: &nbsp;&nbsp;</strong> {task && task.organizationalUnit ? task.organizationalUnit.name : translate('task.task_management.err_organizational_unit')}</div>
                                <div><strong>{translate('task.task_management.detail_priority')}: &nbsp;&nbsp;</strong> {task && this.formatPriority(task.priority)}</div>
                                <div><strong>{translate('task.task_management.detail_status')}: &nbsp;&nbsp;</strong> {task && this.formatStatus(task.status)}</div>
                                <div><strong>{translate('task.task_management.detail_progress')}: &nbsp;&nbsp;</strong> {task && task.progress}%</div>
                                {
                                    (task && task.taskInformations && task.taskInformations.length !== 0) &&
                                    task.taskInformations.map((info, key) => {
                                        if (info.type === "Date") {
                                            return <div key={key}><strong>{info.name}: &nbsp; &nbsp;</strong> {info.value ? this.formatDate(info.value) : translate('task.task_management.detail_not_hasinfo')}</div>
                                        }
                                        return <div key={key}><strong>{info.name}: &nbsp;&nbsp;</strong> {info.value ? info.value : translate('task.task_management.detail_not_hasinfo')}</div>
                                    })
                                }
                                
                                {/* Mô tả công việc */}
                                <div>
                                    <strong>{translate('task.task_management.detail_description')}:</strong>
                                            &nbsp;&nbsp;
                                            <span>
                                        {task && task.description}
                                    </span>
                                    <br />
                                </div>
                            </div>
                        }

                        <div>
                            {/* Vai trò */}
                            {task &&
                                <div className="description-box">
                                    <h4>{translate('task.task_management.role')}</h4>

                                    <div>
                                        {/* Người thực hiện */}
                                        <strong>{translate('task.task_management.responsible')}: </strong>
                                        &nbsp;&nbsp;
                                        <span>
                                            {
                                                (task && task.responsibleEmployees && task.responsibleEmployees.length !== 0) &&
                                                task.responsibleEmployees.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                        return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                    } else {
                                                        return <span key={index}>{seperator}{item.name}</span>
                                                    }
                                                })
                                            }
                                        </span>
                                        <br />

                                        {/* Người phê duyệt */}
                                        <strong>{translate('task.task_management.accountable')}: </strong>
                                        &nbsp;&nbsp;
                                        <span>
                                            {
                                                (task && task.accountableEmployees && task.accountableEmployees.length !== 0) &&
                                                task.accountableEmployees.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                        return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                    } else {
                                                        return <span key={index}>{seperator}{item.name}</span>
                                                    }
                                                })
                                            }
                                        </span>
                                        <br />

                                        {
                                            (task && task.consultedEmployees && task.consultedEmployees.length !== 0) &&
                                            <React-Fragment>
                                                {/* Người tư vấn */}
                                                <strong>{translate('task.task_management.consulted')}: </strong>
                                                &nbsp;&nbsp;
                                                <span>
                                                    {
                                                        (task && task.consultedEmployees.length !== 0) &&
                                                        task.consultedEmployees.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                                return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                            } else {
                                                                return <span key={index}>{seperator}{item.name}</span>
                                                            }
                                                        })
                                                    }
                                                </span>
                                                <br />
                                            </React-Fragment>
                                        }
                                        {
                                            (task && task.informedEmployees && task.informedEmployees.length !== 0) &&
                                            <React-Fragment>
                                                {/* Người hỗ trợ */}
                                                <strong>{translate('task.task_management.informed')}: </strong>
                                                &nbsp;&nbsp;
                                                <span>
                                                    {
                                                        (task && task.informedEmployees.length !== 0) &&
                                                        task.informedEmployees.map((item, index) => {
                                                            let seperator = index !== 0 ? ", " : "";
                                                            if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                                return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                            } else {
                                                                return <span key={index}>{seperator}{item.name}</span>
                                                            }
                                                        })
                                                    }
                                                </span>
                                                <br />
                                            </React-Fragment>
                                        }
                                    </div>
                                </div>
                            }
                            <div>
                                {/* Đánh giá công việc */}
                                <div>
                                    {(evalList) &&
                                        evalList.map((eva, keyEva) => {
                                            return (
                                                <div key={keyEva} className="description-box">
                                                    <h4>{translate('task.task_management.detail_eval')}&nbsp;{this.formatDate(eva.prevDate)} <i className="fa fa-fw fa-caret-right"></i> {this.formatDate(eva.date)}</h4>
                                                    {
                                                        eva.results.length !== 0 &&
                                                        <div>
                                                            <div><strong>{translate('task.task_management.detail_point')}</strong> ({translate('task.task_management.detail_auto_point')} - {translate('task.task_management.detail_emp_point')} - {translate('task.task_management.detail_acc_point')})</div>
                                                            <ul>
                                                                {(eva.results.length !== 0) ?
                                                                    eva.results.map((res, index) => {
                                                                        if (task.inactiveEmployees.indexOf(res.employee._id) !== -1) {
                                                                            return <li key={index}><strike>{res.employee.name}</strike>: &nbsp;&nbsp; {(res.automaticPoint !== null && res.automaticPoint !== undefined) ? res.automaticPoint : translate('task.task_management.detail_not_auto')} - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} - {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}</li>
                                                                        }
                                                                        else {
                                                                            return <li key={index}>{res.employee.name}: &nbsp;&nbsp; {(res.automaticPoint !== null && res.automaticPoint !== undefined) ? res.automaticPoint : translate('task.task_management.detail_not_auto')} - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} - {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}</li>
                                                                        }
                                                                    }) : <li>{translate('task.task_management.detail_not_eval')}</li>
                                                                }
                                                            </ul>
                                                        </div>
                                                    }
                                                    <div>
                                                        <div><strong>{translate('task.task_management.detail_info')}</strong></div>
                                                        <ul>
                                                            <li>{translate('task.task_management.detail_progress')}: &nbsp;&nbsp; {(eva.progress !== null && eva.progress !== undefined) ? `${eva.progress}%` : translate('task.task_management.detail_not_eval_on_month')}</li>
                                                            {
                                                                eva.taskInformations.map((info, key) => {
                                                                    if (info.type === "Date") {
                                                                        return <li key={key}>{info.name}: &nbsp;&nbsp; {info.value ? this.formatDate(info.value) : translate('task.task_management.detail_not_eval_on_month')}</li>
                                                                    }
                                                                    return <li key={key}>{info.name}: &nbsp;&nbsp; {info.value ? info.value : translate('task.task_management.detail_not_eval_on_month')}</li>
                                                                })
                                                            }
                                                        </ul>
                                                    </div>

                                                    {/* KPI */}
                                                    {(eva.results.length !== 0) ?
                                                        (
                                                            eva.results.map((item, key) => {
                                                                return (
                                                                    <div key={key}>
                                                                        <strong>KPI {item.employee.name}</strong>
                                                                        {(item.kpis.length !== 0) ?
                                                                            <ul>
                                                                                {
                                                                                    item.kpis.map((kpi, keyKpi) => {
                                                                                        return <li key={keyKpi}>{kpi.name}</li>
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            : <span>:&nbsp;&nbsp; {translate('task.task_management.detail_not_kpi')}</span>
                                                                        }
                                                                    </div>)
                                                            })
                                                        ) : <div><strong>{translate('task.task_management.detail_all_not_kpi')}</strong></div>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                    {(task && (!task.evaluations || task.evaluations.length === 0)) && <dt>{translate('task.task_management.detail_none_eval')}</dt>}

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                {
                    (id && showEdit === id) && currentRole === "responsible" &&
                    <ModalEditTaskByResponsibleEmployee
                        id={id}
                        task={task && task}
                        role={currentRole}
                        title={translate('task.task_management.detail_resp_edit')}
                        perform={`edit-${currentRole}`}
                    />
                }

                {
                    (id && showEdit === id) && currentRole === "accountable" &&
                    <ModalEditTaskByAccountableEmployee
                        id={id}
                        task={task && task}
                        role={currentRole}
                        title={translate('task.task_management.detail_acc_edit')}
                        perform={`edit-${currentRole}`}
                    />
                }

                {
                    (id && showEvaluate === id) &&
                    <EvaluationModal
                        id={id}
                        task={task && task}
                        role={currentRole}
                        title={translate('task.task_management.detail_cons_eval')}
                        perform='evaluate'
                    />
                }
                {
                    (id && showEndTask === id) &&
                    <SelectFollowingTaskModal
                        id={id}
                        task={task && task}
                        role={currentRole}
                        typeOfTask={typeOfTask}
                        codeInProcess={codeInProcess}
                        title={"Chọn công việc thực hiện tiếp theo"}
                        perform='selectFollowingTask'
                    />
                }


            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const { tasks, performtasks, user } = state;
    return { tasks, performtasks, user };

}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    getSubTask: taskManagementActions.getSubTask,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getTaskLog: performTaskAction.getTaskLog,
    editStatusTask: performTaskAction.editStatusOfTask,
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };
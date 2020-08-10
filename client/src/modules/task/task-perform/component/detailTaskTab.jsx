import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from './../redux/actions';
import { taskManagementActions } from './../../task-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { ModalEditTaskByResponsibleEmployee } from './modalEditTaskByResponsibleEmployee';
import { ModalEditTaskByAccountableEmployee } from './modalEditTaskByAccountableEmployee';
import { EvaluationModal } from './evaluationModal';
import { getStorage } from '../../../../config';

import './detailTaskTab.css';

class DetailTaskTab extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;
        var idUser = getStorage("userId");
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
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
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

    handleShowEndTask = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEndTask: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}-stop`).modal('show');

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

    render() {
        const { tasks, performtasks, translate } = this.props;
        const { currentUser, roles, currentRole, collapseInfo, showEdit, showEndTask, showEvaluate } = this.state
        const { showToolbar, id } = this.props; // props form parent component ( task, id, showToolbar, onChangeTaskRole() )

        let task;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) {
            task = tasks.task;
        }

        let statusTask
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;

        let checkInactive = true;
        if (task) checkInactive = task.inactiveEmployees.indexOf(currentUser) === -1; // return true if user is active user

        let evaluations;
        if (task && task.evaluations && task.evaluations.length !== 0) evaluations = task.evaluations; //.reverse()

        let evalList = [];
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

                        {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                            <a className="btn btn-app" onClick={() => !performtasks.currentTimer && this.startTimer(task._id, currentUser)} title="Bắt đầu thực hiện công việc" disabled={performtasks.currentTimer}>
                                <i className="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_start_timer')}
                            </a>
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
                        {/* Các trường thông tin cơ bản */}
                        {task &&
                            <div className="description-box">
                                <div><strong>{translate('task.task_management.detail_link')}: &nbsp;&nbsp;</strong> <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a></div>
                                <div><strong>{translate('task.task_management.detail_priority')}: &nbsp;&nbsp;</strong> {task && this.formatPriority(task.priority)}</div>
                                <div><strong>{translate('task.task_management.detail_status')}: &nbsp;&nbsp;</strong> {task && this.formatStatus(task.status)}</div>
                                <div><strong>{translate('task.task_management.detail_time')}: &nbsp;&nbsp;</strong> {this.formatDate(task && task.startDate)} <i className="fa fa-fw fa-caret-right"></i> {this.formatDate(task && task.endDate)}</div>

                                <div><strong>{translate('task.task_management.detail_progress')}: &nbsp;&nbsp;</strong> {task && task.progress}%</div>
                                {
                                    (task && task.taskInformations.length !== 0) &&
                                    task.taskInformations.map((info, key) => {
                                        if (info.type === "Date") {
                                            return <div key={key}><strong>{info.name}: &nbsp; &nbsp;</strong> {info.value ? this.formatDate(info.value) : translate('task.task_management.detail_not_hasinfo')}</div>
                                        }
                                        return <div key={key}><strong>{info.name}: &nbsp;&nbsp;</strong> {info.value ? info.value : translate('task.task_management.detail_not_hasinfo')}</div>
                                    })
                                }
                            </div>
                        }

                        <div>
                            {/* Thông tin chung */}
                            <div className="description-box">
                                <h4>{translate('task.task_management.detail_general_info')}</h4>

                                {/* Description */}
                                <div>
                                    <strong>{translate('task.task_management.detail_description')}:</strong>
                                        &nbsp;&nbsp;
                                        <span>
                                        {task && task.description}
                                    </span>
                                    <br />
                                </div>

                                <div>
                                    {/* Người thực hiện */}
                                    <strong>{translate('task.task_management.responsible')}: </strong>
                                        &nbsp;&nbsp;
                                        <span>
                                        {
                                            (task && task.responsibleEmployees.length !== 0) &&
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
                                            (task && task.accountableEmployees.length !== 0) &&
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
                                        (task && task.consultedEmployees.length !== 0) &&
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
                                        (task && task.informedEmployees.length !== 0) &&
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
                                                            <li>{translate('task.task_management.detail_progress')}: &nbsp;&nbsp; {eva.progress}%</li>
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
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };
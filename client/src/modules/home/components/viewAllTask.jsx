import React, { useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';
import dayjs from 'dayjs';
import { getRoleInTask, checkPrioritySetColor, formatPriority, getProjectName } from '../../../helpers/taskModuleHelpers';

const ViewAllTasks = (props) => {
    const [state, setState] = useState({
        userId: localStorage.getItem("userId")
    })

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }
    const { translate, project } = props;
    const { noneUpdateTask, notLinkedTasks, taskHasActionsAccountable, taskHasActionsResponsible, taskHasNotEvaluationResultIncurrentMonth, unconfirmedTask, taskHasNotApproveResquestToClose } = props.listAlarmTask;

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={'modal-view-all-task'} isLoading={false}
                formID={`modal-view-all-task`}
                title={"Nhắc việc"}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className="qlcv">
                    <div className="nav-tabs-custom" >
                        <ul className="alarm-tabs nav nav-tabs">
                            <li className="active"><a className="alarm-tabs-type" href="#allGeneralNoneUpdate" data-toggle="tab" >{`${translate('task.task_dashboard.none_update_recently')} `} <span>{`(${noneUpdateTask ? noneUpdateTask.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralUnconfirm" data-toggle="tab" >Chưa xác nhận thực hiện<span>{`(${unconfirmedTask ? unconfirmedTask.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralTaskNotKpi" data-toggle="tab" >Chưa liên kết với KPI tháng này<span>{`(${notLinkedTasks ? notLinkedTasks.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralTaskHasActionsResponsible" data-toggle="tab" >Chưa được đánh giá hoạt động<span>{`(${taskHasActionsResponsible ? taskHasActionsResponsible.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralTaskHasActionsAccountable" data-toggle="tab" >Cần đánh giá công việc<span>{`(${taskHasActionsAccountable ? taskHasActionsAccountable.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralTaskHasEvaluationInMonth" data-toggle="tab" >Chưa có kết quả đánh giá tháng hiện tại<span>{`(${taskHasNotEvaluationResultIncurrentMonth ? taskHasNotEvaluationResultIncurrentMonth.length : 0})`}</span></a></li>
                            <li><a className="alarm-tabs-type" href="#allGeneralTaskHasNotApproveRequestToClose" data-toggle="tab" >Chưa phê duyệt kết thúc<span>{`(${taskHasNotApproveResquestToClose ? taskHasNotApproveResquestToClose.length : 0})`}</span></a></li>
                        </ul>
                        <div className="tab-content" id="general-tasks-wraper">
                            <div className="tab-pane active notifi-tab-pane" id="allGeneralNoneUpdate">
                                {
                                    noneUpdateTask &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-noneupdate" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (noneUpdateTask.length !== 0) ?
                                                    noneUpdateTask.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-noneupdate" href={`#collapse-noneupdate${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                                <small className="label label-primary" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>
                                                                    <i className="fa fa-clock-o" /> &nbsp;
                                                                    {translate('task.task_dashboard.updated')} {obj.updatedToNow}
                                                                    {translate('task.task_dashboard.day_ago')}
                                                                </small>
                                                            </span>
                                                            <div id={`collapse-noneupdate${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="tab-pane notifi-tab-pane" id="allGeneralUnconfirm">
                                {
                                    unconfirmedTask &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-unconfirm" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (unconfirmedTask.length !== 0) ?
                                                    unconfirmedTask.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-unconfirm" href={`#collapse-unconfirm${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                                <small className="label label-primary" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.createdToNow} {translate('task.task_dashboard.day_ago')}</small>
                                                            </span>
                                                            <div id={`collapse-unconfirm${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane notifi-tab-pane" id="allGeneralTaskNotKpi">
                                {
                                    notLinkedTasks &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-notlinkkpi" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (notLinkedTasks.length !== 0) ?
                                                    notLinkedTasks.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-notlinkkpi" href={`#collapse-notlinkkpi${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                            </span>
                                                            <div id={`collapse-notlinkkpi${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane notifi-tab-pane" id="allGeneralTaskHasActionsResponsible">
                                {
                                    taskHasActionsResponsible &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-hasactionres" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (taskHasActionsResponsible.length !== 0) ?
                                                    taskHasActionsResponsible.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-hasactionres" href={`#collapse-hasactionres${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                            </span>
                                                            <div id={`collapse-hasactionres${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane notifi-tab-pane" id="allGeneralTaskHasActionsAccountable">
                                {
                                    taskHasActionsAccountable &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-hasactionacc" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (taskHasActionsAccountable.length !== 0) ?
                                                    taskHasActionsAccountable.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-hasactionacc" href={`#collapse-hasactionacc${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                            </span>
                                                            <div id={`collapse-hasactionacc${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane notifi-tab-pane" id="allGeneralTaskHasEvaluationInMonth">
                                {
                                    taskHasNotEvaluationResultIncurrentMonth &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-notevaluation" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (taskHasNotEvaluationResultIncurrentMonth.length !== 0) ?
                                                    taskHasNotEvaluationResultIncurrentMonth.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-notevaluation" href={`#collapse-notevaluation${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                            </span>
                                                            <div id={`collapse-notevaluation${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane notifi-tab-pane" id="allGeneralTaskHasNotApproveRequestToClose">
                                {
                                    taskHasNotApproveResquestToClose &&
                                    <div className="faqs-page block ">
                                        <div className="panel-group" id="accordion-notevaluation" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                            {
                                                (taskHasNotApproveResquestToClose.length !== 0) ?
                                                    taskHasNotApproveResquestToClose.map((obj, index) => (
                                                        <div className="panel panel-default" key={index}>
                                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-notevaluation" href={`#collapse-requested-to-close${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                                <span className="index">{index + 1}</span>
                                                                <span className="task-name">{obj.name}</span>
                                                                {
                                                                    obj.taskProject &&
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                                }
                                                            </span>
                                                            <div id={`collapse-requested-to-close${index}`} className="panel-collapse collapse" role="tabpanel">
                                                                <div className="panel-body">
                                                                    <div className="time-todo-range">
                                                                        <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                    </div>
                                                                    <div className="priority-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                        <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                    </div>
                                                                    <div className="progress-task-wraper">
                                                                        <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                        <div className="progress-task">
                                                                            <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                            <span className="perc">{obj.progress}%</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="role-in-task">
                                                                        <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                        <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                    </div>
                                                                    <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { project } = state;
    return { project };
}

export default connect(mapState, null)(withTranslate(ViewAllTasks));
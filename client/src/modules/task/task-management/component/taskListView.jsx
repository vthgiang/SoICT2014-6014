import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import dayjs from 'dayjs';
import './taskListView.css'
import { getRoleInTask, checkPrioritySetColor, formatPriority, getProjectName } from '../../../../helpers/taskModuleHelpers';
function TaskListView(props) {

    const [state, setState] = useState([]);
    const [userId,] = useState(localStorage.getItem("userId"));
    const { translate, project, performtasks } = props;
    useDeepCompareEffect(() => {
        const { data } = props;
        setState(data);
    }, [props.data]);

    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }
    return (
        <div className="faqs-page block ">
            <div className="panel-group" id="accordion-urgent" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                {
                    (state.length !== 0) ?
                        state.map((obj, index) => (
                            <div className="panel panel-default" key={index}>
                                <span role="button" className="task-item" >
                                    <div className="collapsed task-name" data-toggle="collapse" data-parent="#accordion-urgent" href={`#collapse-tasks${index}`} aria-expanded="true" aria-controls="collapse1a" >
                                        <span className="index">{index + 1}</span>
                                        <span className="task-name">{obj.name}</span>
                                        {
                                            obj.taskProject &&
                                            <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                        }
                                    </div>

                                    <div className="action">
                                        {/* edit */}
                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcEdit(obj._id)} className="edit" data-toggle="modal" >
                                            <i className="material-icons" style={{ color: "#FFC107", marginRight: "5px" }}></i>
                                        </a>

                                        {/* Bấm giờ */}
                                        <a
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => !performtasks.currentTimer && props.funcStartTimer(obj._id)}
                                            className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === obj._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
                                        >
                                            <i className="material-icons" style={{ marginRight: "5px" }}>timer</i>
                                        </a>

                                        {/* delele */}
                                        {
                                            (obj.accountableEmployees && obj.accountableEmployees.filter(o => o._id === userId).length > 0) &&
                                            <a style={{ cursor: 'pointer' }} onClick={() => props.funcDelete(obj._id)} className="delete" >
                                                <i className="material-icons" style={{ color: "#E34724", marginRight: "5px" }}></i>
                                            </a>
                                        }

                                        {/* Lưu kho */}
                                        {
                                            obj.isArchived === true ?
                                                <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox" >
                                                    <i className="material-icons">restore_page</i>
                                                </a>
                                                :
                                                <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox" >
                                                    <i className="material-icons" style={{ color: "darkred", marginRight: "5px" }}>all_inbox</i>
                                                </a>
                                        }
                                    </div>
                                </span>
                                <div id={`collapse-tasks${index}`} className="panel-collapse collapse" role="tabpanel">
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
                                            <span>{getRoleInTask(userId, obj, translate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                }
            </div>
        </div>
    )


}

function mapStateToProps(state) {
    const { tasks, performtasks } = state;
    return { tasks, performtasks };
}

const mapDispatchToProps = {
}



export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaskListView));
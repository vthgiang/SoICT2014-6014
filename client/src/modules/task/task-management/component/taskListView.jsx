import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import dayjs from 'dayjs';
import _cloneDeep from 'lodash/cloneDeep';
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

    function splitToChunks(array, parts) {
        let result = [];
        for (let i = parts; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    }

    let stateNew = _cloneDeep(state);
    stateNew = splitToChunks(stateNew, 3);
    // console.log('stateNew', stateNew)
    return (
        < div className="content-list-view" >
            {
                state?.length > 0 ?
                    <div className="grid-wraper">
                        <section className="gird">
                            {
                                (stateNew && stateNew[0].length !== 0) ?
                                    stateNew[0].map((obj, index) => {
                                        let totalEmployeesInTask = [];
                                        if (obj?.responsibleEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.responsibleEmployees]
                                        if (obj?.accountableEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.accountableEmployees]
                                        if (obj?.consultedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.consultedEmployees]
                                        if (obj?.informedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.informedEmployees]

                                        return <div className="item" key={index}>
                                            <span className="task-name">{obj.name}</span>
                                            <div className="time-todo-range">
                                                <span style={{ marginRight: '10px', display: "block" }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
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

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <span style={{ marginRight: '10px' }}>Thành viên tham gia: </span>
                                                {
                                                    totalEmployeesInTask.length > 0 &&
                                                    totalEmployeesInTask.map((o, index) => {
                                                        if (index < 4)
                                                            return <img key={index} src={process.env.REACT_APP_SERVER + o.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                    })
                                                }
                                                {
                                                    totalEmployeesInTask.length > 4 &&
                                                    <span style={{ fontWeight: "bold" }}>+ {totalEmployeesInTask.length - 4}</span>
                                                }

                                            </div>

                                            <div className="action">
                                                {/* edit */}
                                                <a style={{ cursor: 'pointer' }} onClick={() => props.funcEdit(obj._id)} className="edit" data-toggle="modal" title="Thực hiện công viêc" >
                                                    <i className="material-icons" style={{ color: "#FFC107", marginRight: "5px" }}></i>
                                                </a>

                                                {/* Bấm giờ */}
                                                <a
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => !performtasks.currentTimer && props.funcStartTimer(obj._id)}
                                                    title="Bấm giờ công việc"
                                                    className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === obj._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
                                                >
                                                    <i className="material-icons" style={{ marginRight: "5px" }}>timer</i>
                                                </a>

                                                {/* delele */}
                                                {
                                                    (obj.accountableEmployees && obj.accountableEmployees.filter(o => o._id === userId).length > 0) &&
                                                    <a style={{ cursor: 'pointer' }} onClick={() => props.funcDelete(obj._id)} className="delete" title="Xóa công việc">
                                                        <i className="material-icons" style={{ color: "#E34724", marginRight: "5px" }}></i>
                                                    </a>
                                                }

                                                {/* Lưu kho */}
                                                {
                                                    obj.isArchived === true ?
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox">
                                                            <i className="material-icons">restore_page</i>
                                                        </a>
                                                        :
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox" title="Lưu kho" >
                                                            <i className="material-icons" style={{ color: "darkred", marginRight: "5px" }}>all_inbox</i>
                                                        </a>
                                                }
                                            </div>
                                        </div>
                                    })
                                    : null
                            }
                        </section>
                        <section className="gird">
                            {
                                (stateNew && stateNew[1].length !== 0) ?
                                    stateNew[1].map((obj, index) => {
                                        let totalEmployeesInTask = [];
                                        if (obj?.responsibleEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.responsibleEmployees]
                                        if (obj?.accountableEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.accountableEmployees]
                                        if (obj?.consultedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.consultedEmployees]
                                        if (obj?.informedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.informedEmployees]

                                        return <div className=" item2" key={index}>
                                            <span className="task-name">{obj.name}</span>
                                            <div className="time-todo-range">
                                                <span style={{ marginRight: '10px', display: "block" }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
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

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <span style={{ marginRight: '10px' }}>Thành viên tham gia: </span>
                                                {
                                                    totalEmployeesInTask.length > 0 &&
                                                    totalEmployeesInTask.map((o, index) => {
                                                        if (index < 4)
                                                            return <img key={index} src={process.env.REACT_APP_SERVER + o.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                    })
                                                }
                                                {
                                                    totalEmployeesInTask.length > 4 &&
                                                    <span style={{ fontWeight: "bold" }}>+ {totalEmployeesInTask.length - 4}</span>
                                                }

                                            </div>

                                            <div className="action">
                                                {/* edit */}
                                                <a style={{ cursor: 'pointer' }} onClick={() => props.funcEdit(obj._id)} className="edit" data-toggle="modal" title="Thực hiện công viêc" >
                                                    <i className="material-icons" style={{ color: "#FFC107", marginRight: "5px" }}></i>
                                                </a>

                                                {/* Bấm giờ */}
                                                <a
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => !performtasks.currentTimer && props.funcStartTimer(obj._id)}
                                                    title="Bấm giờ công việc"
                                                    className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === obj._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
                                                >
                                                    <i className="material-icons" style={{ marginRight: "5px" }}>timer</i>
                                                </a>

                                                {/* delele */}
                                                {
                                                    (obj.accountableEmployees && obj.accountableEmployees.filter(o => o._id === userId).length > 0) &&
                                                    <a style={{ cursor: 'pointer' }} onClick={() => props.funcDelete(obj._id)} className="delete" title="Xóa công việc">
                                                        <i className="material-icons" style={{ color: "#E34724", marginRight: "5px" }}></i>
                                                    </a>
                                                }

                                                {/* Lưu kho */}
                                                {
                                                    obj.isArchived === true ?
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox">
                                                            <i className="material-icons">restore_page</i>
                                                        </a>
                                                        :
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox" title="Lưu kho" >
                                                            <i className="material-icons" style={{ color: "darkred", marginRight: "5px" }}>all_inbox</i>
                                                        </a>
                                                }
                                            </div>
                                        </div>
                                    })
                                    : null
                            }
                        </section>
                        <section className="gird">
                            {
                                (stateNew && stateNew[2].length !== 0) ?
                                    stateNew[2].map((obj, index) => {
                                        let totalEmployeesInTask = [];
                                        if (obj?.responsibleEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.responsibleEmployees]
                                        if (obj?.accountableEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.accountableEmployees]
                                        if (obj?.consultedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.consultedEmployees]
                                        if (obj?.informedEmployees?.length > 0)
                                            totalEmployeesInTask = [...totalEmployeesInTask, ...obj.informedEmployees]

                                        return <div className=" item3" key={index}>
                                            <span className="task-name">{obj.name}</span>
                                            <div className="time-todo-range">
                                                <span style={{ marginRight: '10px', display: "block" }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
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

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <span style={{ marginRight: '10px' }}>Thành viên tham gia: </span>
                                                {
                                                    totalEmployeesInTask.length > 0 &&
                                                    totalEmployeesInTask.map((o, index) => {
                                                        if (index < 4)
                                                            return <img key={index} src={process.env.REACT_APP_SERVER + o.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                    })
                                                }
                                                {
                                                    totalEmployeesInTask.length > 4 &&
                                                    <span style={{ fontWeight: "bold" }}>+ {totalEmployeesInTask.length - 4}</span>
                                                }

                                            </div>

                                            <div className="action">
                                                {/* edit */}
                                                <a style={{ cursor: 'pointer' }} onClick={() => props.funcEdit(obj._id)} className="edit" data-toggle="modal" title="Thực hiện công viêc" >
                                                    <i className="material-icons" style={{ color: "#FFC107", marginRight: "5px" }}></i>
                                                </a>

                                                {/* Bấm giờ */}
                                                <a
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => !performtasks.currentTimer && props.funcStartTimer(obj._id)}
                                                    title="Bấm giờ công việc"
                                                    className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === obj._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
                                                >
                                                    <i className="material-icons" style={{ marginRight: "5px" }}>timer</i>
                                                </a>

                                                {/* delele */}
                                                {
                                                    (obj.accountableEmployees && obj.accountableEmployees.filter(o => o._id === userId).length > 0) &&
                                                    <a style={{ cursor: 'pointer' }} onClick={() => props.funcDelete(obj._id)} className="delete" title="Xóa công việc">
                                                        <i className="material-icons" style={{ color: "#E34724", marginRight: "5px" }}></i>
                                                    </a>
                                                }

                                                {/* Lưu kho */}
                                                {
                                                    obj.isArchived === true ?
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox">
                                                            <i className="material-icons">restore_page</i>
                                                        </a>
                                                        :
                                                        <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(obj._id)} className="all_inbox" title="Lưu kho" >
                                                            <i className="material-icons" style={{ color: "darkred", marginRight: "5px" }}>all_inbox</i>
                                                        </a>
                                                }
                                            </div>
                                        </div>
                                    })
                                    : null
                            }
                        </section>
                    </div>
                    : <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }


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
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ShowMoreShowLess } from '../../../../common-components/index';
import { DetailTaskTab } from '../../../task/task-perform/component/detailTaskTab';
import { getColor, getRankProb, roundProb } from '../TaskPertHelper'
import parse from 'html-react-parser';
import dayjs from 'dayjs'
import {PertModel} from './pertModel'
import { RiskModel } from './riskModel';
import { ProbDiagram } from './diagram/probDiagram';
const TaskDetail = (props) => {
    const { taskData, isProcess, translate, action, taskPertBayes, riskDistribution, idProcess } = props
    const [state, setState] = useState({
        taskClassName: '',
        task:undefined
    })
    useEffect(()=>{
        console.log('change',taskData)
        console.log('idProcess',idProcess   )
        setState({
            ...state,
            task:taskData
        })
    },[taskData])
    const{task} = state
    const getTaskClassName = (classNum) => {
        if (classNum == 1) return 'Các công việc ảnh hưởng tới yếu tố con người'
        if (classNum == 2) return 'Các công việc ảnh hưởng tới yếu tố con người và thiết bị'
        if (classNum == 3) return 'Các công việc ảnh hưởng tới các yếu tố sản phẩm'
        if (classNum == 4) return 'Các công việc chịu ảnh hưởng bởi các yếu tố : Thiết bị và môi trường'
    }


    const taskStatusColor = (status) => {
        switch (status) {
            case "inprocess":
                return "#385898";
            case "canceled":
                return "#e86969";
            case "delayed":
                return "#db8b0b";
            case "finished":
                return "#31b337";
            default:
                return "#333";
        }
    }
    const taskPriorityColor = (priority) => {
        switch (priority) {
            case 5:
                return "#ff0707";
            case 4:
                return "#ff5707";
            case 3:
                return "#28A745";
            case 2:
                return "#ffa707";
            default:
                return "#808080"
        }
    }
    const formatPriority = (data) => {
        const { translate } = props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.average');
        if (data === 3) return translate('task.task_management.standard');
        if (data === 4) return translate('task.task_management.high');
        if (data === 5) return translate('task.task_management.urgent');
    }

    const formatStatus = (data) => {
        const { translate } = props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }
    const formatDate = (date) => {
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
    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }
    const showPertCPM = (e) => {
        window.$(`#modal-show-pert-data`).modal("show");

    }
    const showRiskModel = (e) => {
        window.$(`#modal-show-risk-data`).modal("show");
    }
    const showTaskRiskModel = (e) => {
        window.$(`#modal-show-task-risk-data`).modal("show");
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-task-${action}`}
                title={translate('process_analysis.task_detail.title')}
                hasSaveButton={false}
                size={100}>
                {taskPertBayes && <PertModel taskPert={taskPertBayes}></PertModel>}
                {task && taskPertBayes && riskDistribution.length != 0 && <RiskModel riskDistribution={riskDistribution} task={taskPertBayes}></RiskModel>}
                
                {task &&
                    <div className="row">
                        <div className="col-sm-7">
                            <div className="description-box" style={{minHeight:300}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                                    <h4>{translate('process_analysis.task_detail.probability_analysis_result')}</h4>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                                    <div className="col-sm-3">
                                        <p>{translate('process_analysis.task_detail.pert')}:</p>
                                    </div>

                                    <div className="progress-task col-sm-6" style={{ width: '30%', padding: '0px 0px 0px 0px', margin: '0' }}>
                                        <div className="fillmult" data-width={`${taskPertBayes && roundProb(taskPertBayes.pertProb)}%`} style={{ width: `${taskPertBayes && roundProb(taskPertBayes.pertProb)}%`, backgroundColor: '#3c8dbc' }}></div>
                                        <span className="perc"> {taskPertBayes && roundProb(taskPertBayes.pertProb)}%</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <a href="#" class="small-box-footer" style={{ fontStyle: 'italic' }} onClick={showPertCPM}>
                                        {translate('process_analysis.task_detail.view_pert_cpm_result')} <i class="fa fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                                    <div className="col-sm-3">
                                        <p>{translate('process_analysis.task_detail.risk_probability')}</p>
                                    </div>

                                    <div className="progress-task col-sm-6" style={{ width: '30%', padding: '0px 0px 0px 0px', margin: '0' }}>
                                        <div className="fillmult" data-width={`${taskPertBayes && roundProb(taskPertBayes.riskProb)}%`} style={{ width: `${taskPertBayes && roundProb(taskPertBayes.riskProb)}%`, backgroundColor: '#3c8dbc' }}></div>
                                        <span className="perc"> {taskPertBayes && roundProb(taskPertBayes.riskProb)}%</span>
                                    </div>
                                    <div className="col-sm-3">
                                        <a href="#" class="small-box-footer" style={{ fontStyle: 'italic' }} onClick={showRiskModel}>
                                        {translate('process_analysis.task_detail.view_risk_model')}<i class="fa fa-arrow-circle-right"></i>
                                        </a>
                                    </div>

                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                                    <div className="col-sm-3">
                                        <p>{translate('process_analysis.task_detail.result_of_new_model')} :</p>
                                    </div>

                                    <div className="progress-task col-sm-6" style={{ width: '30%', padding: '0px 0px 0px 0px', margin: '0' }}>
                                        <div className="fillmult" data-width={`${taskPertBayes && roundProb(taskPertBayes.prob)}%`} style={{ width: `${taskPertBayes && roundProb(taskPertBayes.prob)}%`, backgroundColor: '#3c8dbc' }}></div>
                                        <span className="perc"> {taskPertBayes && roundProb(taskPertBayes.prob)}%</span>
                                    </div>
                                    {/* <div className="col-sm-3">
                                <a href="#" class="small-box-footer" style={{fontStyle:'italic'}} onClick={showTaskRiskModel}>
                                    Xem mô hình chi tiết <i class="fa fa-arrow-circle-right"></i>
                                </a>
                            </div> */}
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="description-box" style={{minHeight:300}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                                    <h4>{translate('process_analysis.task_detail.probability_in_time')}</h4>
                                </div>
                                <ProbDiagram idProcess={idProcess} task={task}></ProbDiagram>
                            </div>
                        </div>

                    </div>
                }
                {task &&
                    <div className="description-box">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                            <h4>{translate('task.task_management.detail_general_info')}</h4>
                        </div>

                        <div><strong>{translate('task.task_management.detail_link')}:</strong> <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a></div>
                        {/* <div><strong>{'Lớp công việc'}:</strong> {task && getTaskClassName(task.class)}</div> */}
                        <div><strong>{translate('task.task_management.detail_time')}:</strong> {dayjs(task && task.startDate).format("DD/MM/YYYY")} <i className="fa fa-fw fa-caret-right"></i> {dayjs(task && task.endDate).format("DD/MM/YYYY")} </div>
                        <div><strong>{translate('task.task_management.unit_manage_task')}:</strong> {task && task.organizationalUnit ? task.organizationalUnit.name : translate('task.task_management.err_organizational_unit')}</div>
                        <div>
                            <strong>{translate('task.task_management.collaborated_with_organizational_units')}: </strong>
                            <span>
                                {task.collaboratedWithOrganizationalUnits.length !== 0
                                    ? <span>
                                        {
                                            task.collaboratedWithOrganizationalUnits.map((item, index) => {
                                                let seperator = index !== 0 ? ", " : "";
                                                return <span key={index}>{seperator}{item.organizationalUnit && item.organizationalUnit.name}</span>
                                            })
                                        }
                                    </span>
                                    : <span>{translate('task.task_management.not_collaborated_with_organizational_units')}</span>
                                }
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <strong>{translate('task.task_management.detail_priority')}:</strong>
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                <span className="material-icons" style={{ fontSize: "17px", color: taskPriorityColor(task?.priority) }}>priority_high</span>
                                <span> {task && formatPriority(task.priority)}</span>
                            </div>

                        </div>
                        <div><strong>{translate('task.task_management.detail_status')}:</strong> <span style={{ color: taskStatusColor(task?.status) }}>{task && formatStatus(task.status)}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center' }}><strong>{translate('task.task_management.detail_progress')}:</strong>
                            <div className="progress-task" style={{ width: '30%' }}>
                                <div className="fillmult" data-width={`${task && task.progress}%`} style={{ width: `${task && task.progress}%`, backgroundColor: task && task.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                <span className="perc"> {task && task.progress}%</span>
                            </div>
                        </div>
                        {
                            (task && task.taskInformations && task.taskInformations.length !== 0) &&
                            task.taskInformations.map((info, key) => {
                                if (info.type === "date") {
                                    return <div key={key}><strong>{info.name}:</strong> {info.value ? formatDate(info.value) : translate('task.task_management.detail_not_hasinfo')}</div>
                                }
                                return <div key={key}>
                                    <strong>{info.name}:</strong>
                                    {
                                        info.value ?
                                            info.value : Number(info.value) === 0 ? info.value :
                                                translate('task.task_management.detail_not_hasinfo')}
                                </div>
                            })
                        }

                        {/* Mô tả công việc */}
                        <div>
                            <strong>{translate('task.task_management.detail_description')}:</strong>
                            <ShowMoreShowLess
                                id={"task-description"}
                                isHtmlElement={true}
                                characterLimit={200}
                            >
                                {task && parse(task.description)}
                            </ShowMoreShowLess>
                        </div>
                    </div>
                }
                {/* Vai trò */}
                {task &&
                    <div className="description-box">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '17px', marginRight: '5px' }} className="material-icons">
                                people_alt
                                    </span>
                            <h4>
                                {translate('task.task_management.role')}
                            </h4>
                        </div>

                        {/* Người thực hiện */}
                        <strong>{translate('task.task_management.responsible')}:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                task?.responsibleEmployees?.length > 0 && task.responsibleEmployees.map((item, index) => {
                                    // Nếu người này không còn trong công việc
                                    if (task?.inactiveEmployees.some(o => o._id === item._id)) {
                                        return (
                                            <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>

                                                <span>{item.name}</span>
                                            </a>
                                        )
                                    }

                                    return <span key={index} className="raci-style">
                                        <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                        <span>{item.name}</span>
                                    </span>
                                })
                            }
                        </div>

                        {/* Người phê duyệt */}
                        <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.accountable')}:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                task?.accountableEmployees?.length > 0 && task.accountableEmployees.map((item, index) => {
                                    // Nếu người này không còn trong công việc
                                    if (task?.inactiveEmployees.some(o => o._id === item._id)) {
                                        return (
                                            <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                <span>{item.name}</span>
                                            </a>
                                        )
                                    }

                                    return <span key={index} className="raci-style">
                                        <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                        <span>{item.name}</span>
                                    </span>
                                })
                            }
                        </div>

                        {
                            (task && task.consultedEmployees && task.consultedEmployees.length !== 0) &&
                            <div>
                                {/* Người hỗ trợ */}
                                <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.consulted')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        task?.consultedEmployees?.length > 0 && task.consultedEmployees.map((item, index) => {
                                            // Nếu người này không còn trong công việc
                                            if (task?.inactiveEmployees.some(o => o._id === item._id)) {
                                                return (
                                                    <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                        <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </a>
                                                )
                                            }

                                            return <span key={index} className="raci-style">
                                                <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                <span>{item.name}</span>
                                            </span>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            (task && task.informedEmployees && task.informedEmployees.length !== 0) &&
                            <div>
                                {/* Người quan sát */}
                                <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.informed')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        task?.informedEmployees?.length > 0 && task.informedEmployees.map((item, index) => {
                                            // Nếu người này không còn trong công việc
                                            if (task?.inactiveEmployees.some(o => o._id === item._id)) {
                                                return (
                                                    <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                        <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </a>
                                                )
                                            }

                                            return <span key={index} className="raci-style">
                                                <img src='http://localhost:8000/upload/avatars/user.png' className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                <span>{item.name}</span>
                                            </span>
                                        })
                                    }
                                </div>
                            </div>
                        }



                    </div>
                }
            </DialogModal>
        </React.Fragment >
    )
}


const TaskDetailConnected = connect(null, null)(withTranslate(TaskDetail));
export { TaskDetailConnected as TaskDetail };
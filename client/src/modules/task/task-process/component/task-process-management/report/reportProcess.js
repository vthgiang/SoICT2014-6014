import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DatePicker, TreeTable ,DataTableSetting} from "../../../../../../common-components";
import { formatPriority, getTotalTimeSheetLogs, formatStatus, } from "../../../../task-management/component/functionHelpers.js"
import { formatTaskStatus, getCurrentProjectDetails, renderProgressBar, renderStatusColor } from '../../../../../project/projects/components/functionHelper';
import { ReportGant } from "./reportGant";
import "./reportProcess.css"
import moment from 'moment';
import GanttTasksProject from "../../../../../project/projects/components/ganttTasksProject";
import { ReportTask } from "./reportTask";

function areEqual(prevProps, nextProps) {
    if (JSON.stringify(prevProps.listTask) === JSON.stringify(nextProps.listTask)) {
        return true
    } else {
        return false
    }
}

function ReportProcess(props) {
    const [nameTask, setNameTask] = useState("Tất cả công việc")
    const handleDisplayType = (value) => {
        setNameTask(value)
    }
    const processPreceedingTasks = (preceedingTasks) => {
        if (!props.listTask || preceedingTasks.length === 0) return '';
        const resultArr = preceedingTasks.map(preceedingTaskItem => {
            return props.listTask.find(item => item._id === preceedingTaskItem.task)?.name;
        })
        return resultArr.join(", ");
    }
    const showData = (lists = [], nameTask) => {
        let list1=lists;
        let result = null
        switch (nameTask) {
            case "Tất cả công việc":
                break;
            case "Công việc đang làm":
                lists = lists.filter(value => value.status == 'inprocess')
                break;
            case "Công việc đã hoàn thành":
                lists = lists.filter(value => value.status == 'finished')
                break;
            case "Công việc trễ hạn":
                lists=[]
                list1.forEach(value => {
                    let end = moment(value.endDate);
                    let endT = moment(value.actualEndDate);
                    let now = moment(new Date());
                    let currentMode ="hour"
                    if (value.status == "finished") {
                        let uptonow1 = now.diff(end, currentMode);
                        let uptonow2 = now.diff(endT, currentMode);
                        if (uptonow1 > uptonow2) {
                            lists.push(value)
                        }
                    } 
                })
                break;
            default:
            // code block
        }
        if (lists && lists.length !== 0) {
            result  = lists.map((taskItem, index) => {
                return(
                <tr key={index}>
                    <td style={{ color: '#385898' }}>{taskItem?.name}</td>
                    <td style={{ maxWidth: 350 }}>{processPreceedingTasks(taskItem?.preceedingTasks)}</td>
                    <td>{taskItem?.responsibleEmployees.map(o => o.name).join(", ")}</td>
                    <td>{taskItem?.accountableEmployees?.map(o => o.name).join(", ")}</td>
                    <td style={{ color: renderStatusColor(taskItem) }}>{formatTaskStatus(translate, taskItem?.status)}</td>
                    <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{taskItem?.actualStartDate && moment(taskItem?.actualStartDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{taskItem?.actualEndDate && moment(taskItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{getTotalTimeSheetLogs(taskItem?.timesheetLogs)}</td>
                    <td>{renderProgressBar(taskItem?.progress, taskItem)}</td>
                    {nameTask==="Công việc trễ hạn" && <td><i class="material-icons">help_outline</i></td>}
                    {/* <td>{taskItem?.progress}%</td> */}
                   
                </tr>)
            })}
        return result
    }
    
    const { translate } = props
    return (
        <React.Fragment>
            <div>
                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng bảng" onClick={() => handleDisplayType('Tất cả công việc')}><i className="fa fa-table"></i>Tất cả công việc</button>
                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng cây" onClick={() => handleDisplayType('Công việc đang làm')}><i className="fa fa-sitemap"></i>Công việc đang làm</button>
                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng danh sách" onClick={() => handleDisplayType('Công việc đã hoàn thành')}><i className="fa fa-list"></i>Công việc đã hoàn thành</button>
                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng danh sách" onClick={() => handleDisplayType('Công việc trễ hạn')}><i className="fa fa-list"></i>Công việc trễ hạn</button>
            </div>
            <div className="box-header with-border">
                <h3 class="title">{nameTask}</h3>
            </div>
            
            <table id="listTaskProcess1"className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>{translate('task.task_management.col_name')}</th>
                        <th>{translate('project.task_management.preceedingTask')}</th>
                        <th>{translate('task.task_management.responsible')}</th>
                        <th>{translate('task.task_management.accountable')}</th>
                        <th>{translate('task.task_management.col_status')}</th>
                        <th>Thời điểm bắt đầu dự kiến</th>
                        <th>Thời điểm kết thúc dự kiến</th>
                        <th>Thời điểm bắt đầu thực tế</th>
                        <th>Thời điểm kết thúc thực tế</th>
                        <th>Tổng thời gian bấm giờ</th>
                        <th>{translate('task.task_management.col_progress')}</th>
                        {nameTask==="Công việc trễ hạn" && <th>chi tiết trễ hạn</th>}
                       {/* <th style={{ width: "120px", textAlign: "center" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                tableId={"listTaskProcess2"}
                                columnArr={[
                                    translate('task.task_management.col_name'),
                                    translate('project.task_management.preceedingTask'),
                                    translate('task.task_management.responsible'),
                                    translate('task.task_management.accountable'),
                                    translate('task.task_management.col_status'),
                                    'Thời điểm bắt đầu',
                                    'Thời điểm kết thúc dự kiến',
                                    'Thời điểm kết thúc thực tế',
                                    'Thời điểm bấm giờ',
                                    translate('task.task_management.col_progress'),
                                ]}
                                //setLimit={setLimit}
                            />
                        </th>*/}
                    </tr>
                </thead>
                <tbody>
                    {showData(props.listTask,nameTask)}
                </tbody>
            </table>

             {/* PaginateBar 
            // {tasks && tasks.isProjectPaginateLoading ?
            //     <div className="table-info-panel">{translate('confirm.loading')}</div> :
            //     (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            // }
            // <PaginateBar
            //     pageTotal={totalPage ? totalPage : 0}
            //     currentPage={page}
            //     display={lists && lists.length !== 0 && lists.length}
            //     total={tasks && tasks.totalDocs}
            //     func={setCurrentPage}
            // />
             
            

            <GanttTasksProject currentProjectTasks={props.listTask} />*/}

            <div className="box-header with-border">
                <h3 class="title">Biểu đồ gantt công việc</h3>
            </div>

            <ReportGant convertDayToHour={props.convertDayToHour} officeHours={props.officeHours} listTask={props.listTask} />
            {props.processTemplate &&
                <ReportTask convertDayToHour={props.convertDayToHour} officeHours={props.officeHours} listTask={props.listTask} listTaskTemplate={props.processTemplate?.tasks}/>
            
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, auth, role, taskProcess } = state;
    return { user, auth, role, taskProcess };
}

const actionCreators = {
    //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedReportProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ReportProcess, areEqual)));
export { connectedReportProcess as ReportProcess };

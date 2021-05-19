import { TaskDialog } from './taskImpotanceDialog';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';

import { kpiMemberActions } from '../redux/actions';

import { ExportExcel, ToolTip, SlimScroll } from '../../../../../common-components';

import { DialogModal } from '../../../../../common-components/index';
import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { EmployeeKpiOverviewModal } from "../../../employee/management/component/employeeKpiOverviewModal";

// import './tableCSS.css';

function EmployeeKpiEvaluateModal(props) {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const tableId = "employee-kpi-evaluate-modal";
    getTableConfiguration(tableId);

    const [state, setState] = useState({
        organizationalUnit: "",
        content: "",
        contentName: "",
        name: "",
        description: "",
        point: 0,
        status: 0,
        value: 0,
        valueNow: 0,
        dataStatus: DATA_STATUS.NOT_AVAILABLE,
        type: 0,
        tableId,
        listKpiId: "list-kpi",
        detailKpiId: "detail-kpi",
    })

    const { kpimembers } = props;
    const { translate, employeeKpiSet } = props;
    const { taskId, content, contentName, 
        perPage, points, tasks, 
        taskImportanceDetail, listKpiId, 
        detailKpiId
    } = state;
    let list, myTask, exportData, currentKpi;

    useEffect(() => {
        if (props.employeeKpiSet && props.employeeKpiSet._id !== state.id) {
            setState({
                ...state,
                id: props.employeeKpiSet._id,
            })
        }

        SlimScroll.removeVerticalScrollStyleCSS(listKpiId)
        SlimScroll.addVerticalScrollStyleCSS(listKpiId, 450, true)

        SlimScroll.removeVerticalScrollStyleCSS(detailKpiId)
        SlimScroll.addVerticalScrollStyleCSS(detailKpiId, 500, true)
    })

    useEffect( () => {
        const { id, dataStatus } = state;
        if (props.employeeKpiSet && props.employeeKpiSet._id !== id) {
            if (props.employeeKpiSet._id) {
                props.getKpisByKpiSetId(props.employeeKpiSet._id);
            }
        }

         if (dataStatus === DATA_STATUS.QUERYING) {
            if (props.kpimembers.tasks) {
                let tasks = props.kpimembers.tasks;
                let importanceLevels = {};
                tasks.forEach(element => {
                    importanceLevels[element.taskId] = element.results.taskImportanceLevel;
                });
                setState({
                    ...state,
                    tasks: tasks,
                    points: importanceLevels,
                    dataStatus: DATA_STATUS.FINISHED,
                });
            }
        }
    
    })

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    function formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const handleChangeContent = (id, employeeId, kpiType, name) => {
        async function fecth() {
        let date = props.employeeKpiSet.date;
        await props.getTaskById(id, employeeId, date, kpiType);
        await setState({
            ...state,
            content: id,
            contentName: name,
            type: kpiType,
            dataStatus: DATA_STATUS.QUERYING,
        });
    }
    fecth()
    }

    const handleSetPointKPI = () => {
        
        let date = props.employeeKpiSet.date;
        let employeeId = props.employeeKpiSet.creator._id;
        let { tasks, points, type, content } = state;
        if (tasks && tasks.length > 0) {
            let data = [];
            tasks.forEach(element => {
                data.push({
                    taskId: element.taskId,
                    date: date,
                    point: points[element.taskId],
                    type: type,
                    role: element && element.results && element.results.role,
                    employeeId: employeeId
                })
            });
            props.setPointKPI(content, type, data);
        }
        else {
            props.setPointKPI(content, type, [{
                date: date,
                type: type,
                employeeId: employeeId
            }]);

        }
    }

    const handleSetPointAllKPI = () => {
        let employeeId = props.employeeKpiSet.creator._id;
        let { employeeKpiSet } = props;

        let kpis = employeeKpiSet.kpis.map(element => ({
            id: element._id,
            type: element.type
        }));
        props.setPointAllKPI(employeeId, employeeKpiSet._id, employeeKpiSet.date, kpis);

    }

    const setValueSlider = (e, id) => {
        let value = e.target.value;
        let points = state.points;
        points[id] = value;
        setState({
            ...state,
            points: points,
        })
    }

    const showDetailTaskImportanceCal = async (item) => {
        await setState( {
            ...state,
            taskImportanceDetail: item
        })

        window.$(`#modal-taskimportance-auto`).modal('show')
    }

    const handleClickTaskName = async (id) => {
        setState( {
            ...state,
            taskId: id,
        });
        window.$(`#modal-detail-task-kpi-evaluation`).modal('show');
    }

    const handleEvaluateTab = () => {
        SlimScroll.removeVerticalScrollStyleCSS(listKpiId)
        SlimScroll.addVerticalScrollStyleCSS(listKpiId, 450, true)

        SlimScroll.removeVerticalScrollStyleCSS(detailKpiId)
        SlimScroll.addVerticalScrollStyleCSS(detailKpiId, 500, true)
    }

    /**Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (dataTask, currentKpiName, employeeName) => {

        let fileName = "Thông tin KPI " + (currentKpiName ? currentKpiName : "") + " của " + (employeeName ? employeeName : "");
        let tableName = 'Danh sách công việc ứng với KPI ' + (currentKpiName ? currentKpiName : "") + " của " + (employeeName ? employeeName : "");
        if (dataTask) {

            dataTask = dataTask.map((x, index) => {

                let name = x.name;
                let startTaskD = new Date(x.startDate);
                let endTaskD = new Date(x.endDate);
                let startApproveD = new Date(x.preEvaDate);
                let endApproveD = new Date(x.date);
                let automaticPoint = (x.results.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.results.automaticPoint);
                let employeePoint = (x.results.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.results.employeePoint);
                let approverPoint = (x.results.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.results.approvedPoint);
                let status = x.status;
                let contributionPoint = parseInt(x.results.contribution);
                let importantLevel = parseInt(x.results.taskImportanceLevel);


                return {
                    STT: index + 1,
                    name: name,
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    startTaskDate: startTaskD,
                    endTaskDate: endTaskD,
                    startApproveDate: startApproveD,
                    endApproveDate: endApproveD,
                    contributionPoint: contributionPoint,
                    importantLevel: importantLevel
                };

            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            tableName: tableName,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên hoạt động" },
                                { key: "startTaskDate", value: "Ngày bắt đầu công việc" },
                                { key: "endTaskDate", value: "Ngày kết thúc công việc" },
                                { key: "startApproveDate", value: "Ngày bắt đầu đánh giá" },
                                { key: "endApproveDate", value: "Ngày kết thúc đánh giá" },
                                { key: "status", value: "Trạng thái" },
                                { key: "contributionPoint", value: "Đóng góp (%)" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                                { key: "importantLevel", value: "Độ quan trọng" }
                            ],
                            data: dataTask
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    const formatTaskStatus = (translate, status) => {
        switch (status) {
            case "inprocess":
                return translate('task.task_management.inprocess');
            case "wait_for_approval":
                return translate('task.task_management.wait_for_approval');
            case "finished":
                return translate('task.task_management.finished');
            case "delayed":
                return translate('task.task_management.delayed');
            case "canceled":
                return translate('task.task_management.canceled');
        }
    }

    const formatTitleWeeklyEvaluate = (title) => {
        switch (title) {
            case "week1":
                return translate('kpi.evaluation.employee_evaluation.week1')
                break
            case "week2":
                return translate('kpi.evaluation.employee_evaluation.week2')
                break
            case "week3":
                return translate('kpi.evaluation.employee_evaluation.week3')
                break
            case "week4":
                return translate('kpi.evaluation.employee_evaluation.week4')
                break
        }
    }

    const showWeeklyPoint = (weeklyEvaluate) => {
        let weeklyPointHtml = ""

        if (weeklyEvaluate?.length > 0) {
            weeklyEvaluate.map(item => {
                weeklyPointHtml = weeklyPointHtml + `<li>${formatTitleWeeklyEvaluate(item?.title)}: <strong>${item?.automaticPoint}</strong> - <strong>${item?.employeePoint}</strong> - <strong>${item?.approvedPoint}</strong></li>`
            })
        } else {
            weeklyPointHtml = `<strong>${translate('task.task_management.not_eval')}</strong>`
        }

        Swal.fire({
            html: `<h3 style="color: red"><div>Kết quả KPI tuần</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>${translate('kpi.evaluation.employee_evaluation.weekly_point_field')}</b></p>
            <ul>${weeklyPointHtml}</ul>
            </div>`,
            width: "40%",
        })
    }

    if (kpimembers.tasks) {
        myTask = kpimembers.tasks;

    }
    if (kpimembers.currentKPI) {
        list = kpimembers.currentKPI.kpis;
    }
    if (employeeKpiSet && employeeKpiSet.creator && employeeKpiSet.creator.name && myTask) {
        exportData = convertDataToExportData(myTask, contentName, employeeKpiSet.creator.name);
    }
    currentKpi = list && list.length ? list.filter(item => item._id == content)[0] : "";

    return (
        <DialogModal
            modalID={"employee-kpi-evaluation-modal"}
            title={employeeKpiSet?.creator?.name && `KPI ${employeeKpiSet.creator.name}, ${translate('kpi.evaluation.employee_evaluation.month')} ${formatMonth(employeeKpiSet.date)}`}
            hasSaveButton={false}
            size={100}
        >
            <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#overview" data-toggle="tab">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.overview')}</a></li>
                    <li><a href="#evaluate" data-toggle="tab" onClick={() => handleEvaluateTab()}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation')}</a></li>
                </ul>
                <div className="tab-content">
                    {/* Tổng quan KPI */}
                    <div className={"active tab-pane"} id="overview">
                        <EmployeeKpiOverviewModal />
                    </div>

                    {/* Đánh giá KPI */}
                    <div className={"tab-pane row row-equal-height"} id="evaluate">
                        <div className="col-xs-12 col-sm-4">
                            <div className="form-group">
                                <button className="btn btn-success" style={{ width: "100%" }} onClick={() => handleSetPointAllKPI()}>
                                    {translate('kpi.evaluation.employee_evaluation.cal_all_kpis')}
                                </button>
                            </div>
                            <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 800 }}>{translate('kpi.evaluation.employee_evaluation.KPI_list')}</h3>
                                </div>
                                <div id={listKpiId} className="box-body no-padding">
                                    <ul className="nav nav-pills nav-stacked">
                                        {list && list.map((item, index) =>
                                            <li key={index} className={content === item._id ? "active" : undefined}>
                                                <a style={{ cursor: 'pointer' }} onClick={() => handleChangeContent(item._id, employeeKpiSet.creator._id, item.type, item.name)}>
                                                    {item.name}
                                                    <span className="label label-primary pull-right">{item?.arrtarget?.length}</span>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 qlcv">
                            <div className="form-inline pull-right">
                                {
                                    currentKpi &&
                                    <button className="btn btn-success" onClick={() => handleSetPointKPI()}>
                                        {translate('kpi.evaluation.employee_evaluation.calc_kpi_point')}
                                        <ToolTip
                                            type="icon_tooltip"
                                            dataTooltip={[
                                                ` ${translate('kpi.evaluation.employee_evaluation.update_task_importance')} ${currentKpi ? currentKpi.name : ""}`,
                                            ]}
                                        />
                                    </button>
                                }
                                {exportData && <ExportExcel id="export-employee-kpi-evaluate-detail-kpi" exportData={exportData} style={{ marginTop: 5 }} />}
                            </div>
                            {list && list.map(item => {
                                if (item._id === content) 
                                    return <div id={detailKpiId} key={item._id}>
                                        <h4>{`${translate('kpi.evaluation.employee_evaluation.KPI_info')} "${item.name}"`}</h4>
                                        <div style={{ lineHeight: 2 }}>
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.criteria')}:</label>
                                                <span> {parse(item.criteria)}</span>
                                            </div>
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.weight')}:</label>
                                                <span> {item.weight}/100</span>
                                            </div>
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.point_field')}:</label>
                                                <span> {item.automaticPoint ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                                <span> - {item.employeePoint ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                                <span> - {item.approvedPoint ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                            </div>
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.weekly_point')}:</label>
                                                <a style={{ cursor: 'pointer' }} onClick={() => showWeeklyPoint(item?.weeklyEvaluate)}> {translate('general.detail')}</a>
                                            </div>
                                            {item.updatedAt &&
                                                <div>
                                                    <label>{translate('kpi.evaluation.employee_evaluation.lastest_evaluation')}: </label>
                                                    <span> {formatDate(item.updatedAt)}</span>
                                                </div>
                                            }
                                        </div>
                                        <br /><br />
                                        <h4>
                                            {translate('kpi.evaluation.employee_evaluation.task_list')} ({kpimembers?.tasks?.length})
                                        </h4>
                                        <div>
                                            <table id={tableId} className="table table-hover table-bordered  table-striped mb-0" >
                                                <thead>
                                                    <tr>
                                                        <th title="STT" style={{ width: "50px" }} className="col-fixed">Stt</th>
                                                        <th title="Tên công việc">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                                        <th title="Thời gian thực hiện">{translate('kpi.evaluation.employee_evaluation.work_duration_time')}</th>
                                                        <th title="Thời gian đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate_time')}</th>
                                                        <th title="Trạng thái">{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                                        <th title="Đóng góp (%)">{translate('kpi.evaluation.employee_evaluation.contribution')} (%)</th>
                                                        <th title="Điểm">{translate('kpi.evaluation.employee_evaluation.point')}</th>
                                                        <th title="Độ quan trọng">{translate('kpi.evaluation.employee_evaluation.importance_level')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {
                                                        (kpimembers.tasks && Array.isArray(kpimembers.tasks)) && kpimembers.tasks?.length > 0 &&
                                                        (kpimembers.tasks.map((itemTask, index) =>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td><a style={{ cursor: 'pointer' }} onClick={() => handleClickTaskName(itemTask.taskId)}>{itemTask.name}</a><a target="_blank" href={`/task?taskId=${itemTask.taskId}`}><i className="fa fa-arrow-circle-right"></i></a></td>
                                                                <td>{formatDate(itemTask.startDateTask)}<br /> <i className="fa fa-angle-double-down"></i><br /> {formatDate(itemTask.endDateTask)}</td>
                                                                <td>{itemTask.startDate ? formatDate(itemTask.startDate) : ""}<br /> <i className="fa fa-angle-double-down"></i><br /> {itemTask.endDate ? formatDate(itemTask.endDate) : ""}</td>
                                                                <td>{formatTaskStatus(translate, itemTask.status)}</td>
                                                                <td>{itemTask.results.contribution ? itemTask.results.contribution : 0}%</td>
                                                                <td>{itemTask.results.automaticPoint + '-' + itemTask.results.employeePoint + '-' + itemTask.results.approvedPoint}</td>
                                                                <td>
                                                                    {points && tasks && 
                                                                        <React.Fragment>
                                                                            <input type="range"
                                                                                min='0'
                                                                                max='10'
                                                                                name={`taskImportanceLevel${itemTask.taskId}`}
                                                                                value={points[itemTask.taskId] || 0}
                                                                                onChange={(e) => setValueSlider(e, itemTask.taskId)}
                                                                            />
                                                                            <div>
                                                                                {translate('kpi.evaluation.employee_evaluation.new_value')}: {points[itemTask.taskId]}
                                                                            </div>
                                                                            <div>
                                                                                {translate('kpi.evaluation.employee_evaluation.old_value')}: {itemTask.results.taskImportanceLevel}
                                                                            </div>
                                                                            <div>
                                                                                <a href="#modal-taskimportance-auto" onClick={() => showDetailTaskImportanceCal(itemTask)}>
                                                                                    {translate('kpi.evaluation.employee_evaluation.auto_value')}: {itemTask.taskImportanceLevelCal}
                                                                                </a>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }
                                                                </td>
                                                            </tr>))
                                                    }
                                                </tbody>
                                            </table>
                                            {!kpimembers?.tasks?.length && kpimembers?.taskLoading
                                                && <div className="table-info-panel">{translate('general.loading')}</div>
                                            }
                                            {!kpimembers?.tasks?.length && !kpimembers?.taskLoading
                                                && <div className="table-info-panel">{translate('general.no_data')}</div>
                                            }
                                        </div>
                                        {
                                            taskImportanceDetail &&
                                            <TaskDialog
                                                task={taskImportanceDetail}
                                            />

                                        }
                                        {<ModalDetailTask action={'kpi-evaluation'} id={taskId} />}
                                    </div>;
                                return true;
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </DialogModal>
    );
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getTaskById: kpiMemberActions.getTaskById,
    setPointKPI: kpiMemberActions.setPointKPI,
    setPointAllKPI: kpiMemberActions.setPointAllKPI,
};
const connectedEmployeeKpiEvaluateModal = connect(mapState, actionCreators)(withTranslate(EmployeeKpiEvaluateModal));
export { connectedEmployeeKpiEvaluateModal as EmployeeKpiEvaluateModal };

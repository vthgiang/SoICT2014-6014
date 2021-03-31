import { TaskDialog } from './taskImpotanceDialog';
import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions } from '../redux/actions';
import { DataTableSetting, ExportExcel, ToolTip } from '../../../../../common-components';
import { DialogModal } from '../../../../../common-components/index';
import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
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
        tableId
    })

    const { kpimembers } = props;
    const { translate, employeeKpiSet } = props;
    const { taskId, content, contentName, perPage, points, tasks, taskImportanceDetail } = state;
    let list, myTask, exportData, currentKpi;

    useEffect(() => {
        if (props.employeeKpiSet && props.employeeKpiSet._id !== state.id) {
            setState({
                ...state,
                id: props.employeeKpiSet._id,
            })
        }
    })

    useEffect(() => {
        const { id, dataStatus } = state;
        if (props.employeeKpiSet && props.employeeKpiSet._id !== id) {
            if (props.employeeKpiSet._id) {
                props.getKpisByKpiSetId(props.employeeKpiSet._id);
            }
        }

        if (dataStatus === DATA_STATUS.QUERYING) {
            if (!props.kpimembers.tasks) {
                return false;
            } else {
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
        let date = props.employeeKpiSet.date;
        props.getTaskById(id, employeeId, date, kpiType);
        setState({
            ...state,
            content: id,
            contentName: name,
            type: kpiType,
            dataStatus: DATA_STATUS.QUERYING,
        });
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

        setState(state => {
            setState({
                ...state,
                points: points,
            })
        })
    }
    const showDetailTaskImportanceCal = async (item) => {
        await setState(state => {
            setState({
                ...state,
                taskImportanceDetail: item
            })
        })

        window.$(`#modal-taskimportance-auto`).modal('show')
    }

    const handleClickTaskName = async (id) => {
        setState(state => {
            setState({
                ...state,
                taskId: id,
            })
        });
        window.$(`#modal-detail-task-kpi-evaluation`).modal('show');
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
            case "requested_to_close":
                return translate('task.task_management.requested_to_close');
        }
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
            title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, ${translate('kpi.evaluation.employee_evaluation.month')} ${formatMonth(employeeKpiSet.date)}`}
            hasSaveButton={false}
            size={100}
        >
            <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#overview" data-toggle="tab">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.overview')}</a></li>
                    <li><a href="#evaluate" data-toggle="tab">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation')}</a></li>
                </ul>
                <div className="tab-content">
                    {/* Tổng quan KPI */}
                    <div className={"active tab-pane"} id="overview">
                        <EmployeeKpiOverviewModal />
                    </div>

                    {/* Đánh giá KPI */}
                    <div className={"tab-pane"} id="evaluate">
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
                                <div className="box-body no-padding" style={{ height: "calc(60vh - 110px)", overflow: "auto" }}>
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
                                if (item._id === content) return <React.Fragment key={item._id}>
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
                                        {item.updatedAt &&
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.lastest_evaluation')}: </label>
                                                <span> {formatDate(item.updatedAt)}</span>
                                            </div>
                                        }
                                    </div>
                                    <br /><br />
                                    <h4 style={{ marginBottom: '-15px' }}>{translate('kpi.evaluation.employee_evaluation.task_list')} ({kpimembers?.tasks?.length})</h4>
                                    <div class="table-wrapper-scroll-y my-custom-scrollbar" style={{ height: "calc(80vh - 160px)", overflow: "auto" }}>
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
                                                    <th title="Độ quan trọng">{translate('kpi.evaluation.employee_evaluation.importance_level')}
                                                        <DataTableSetting
                                                            className="pull-right"
                                                            tableId={tableId}
                                                            tableContainerId="tree-table-container"
                                                            tableWidth="1300px"
                                                            columnArr={[
                                                                'STT',
                                                                'Tên công việc',
                                                                'Thời gian thực hiện',
                                                                'Thời gian đánh giá',
                                                                'Trạng thái',
                                                                'Đóng góp (%)',
                                                                'Điểm',
                                                                'Độ quan trọng']}
                                                            linePerPageOption={false}
                                                        />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    (kpimembers.tasks && Array.isArray(kpimembers.tasks)) && kpimembers.tasks?.length > 0 ?
                                                        (kpimembers.tasks.map((itemTask, index) =>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td><a style={{ cursor: 'pointer' }} onClick={() => handleClickTaskName(itemTask.taskId)}>{itemTask.name}</a></td>
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
                                                                                value={points[itemTask.taskId]}
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
                                                            </tr>)) : <tr><td colSpan={8}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                    {
                                        taskImportanceDetail &&
                                        <TaskDialog
                                            task={taskImportanceDetail}
                                        />

                                    }
                                    {<ModalDetailTask action={'kpi-evaluation'} id={taskId} />}
                                </React.Fragment>;
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

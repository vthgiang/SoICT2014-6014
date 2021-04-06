import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components/index';
import { DataTableSetting, ExportExcel } from '../../../../../common-components';

import { kpiMemberActions } from '../../../evaluation/employee-evaluation/redux/actions';

import { TaskDialog } from '../../../evaluation/employee-evaluation/component/taskImpotanceDialog';
import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { EmployeeKpiOverviewModal } from './employeeKpiOverviewModal';
import parse from 'html-react-parser';

function ModalDetailKPIPersonal(props) {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    const [state, setState] = useState({
        organizationalUnit: "",
        content: "",
        name: "",
        description: "",
        point: 0,
        status: 0,
        value: 0,
        valueNow: 0,
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    });

    var kpimember;
    var list, myTask = [];
    let exportData, content = state.content;
    const { kpimembers, translate } = props;
    let { employeeKpiSet } = props;
    const { taskId, taskImportanceDetail } = state;

    useEffect(() => {
        if (props.employeeKpiSet && props.employeeKpiSet._id !== state.id) {
            setState({
                ...state,
                id: props.employeeKpiSet._id,
            })
        }
    }, [props.employeeKpiSet])

    useEffect(() => {
        if (props.employeeKpiSet && props.employeeKpiSet._id !== state.id) {
            if (props.employeeKpiSet._id) {
                props.getKpisByKpiSetId(props.employeeKpiSet._id);
            }
        }

        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (!props.kpimembers.tasks) {
            } else { // Dữ liệu đã về
                let tasks = props.kpimembers.tasks;
                setState({
                    ...state,
                    tasks: tasks,
                    dataStatus: DATA_STATUS.FINISHED,
                });
            }
        }
    }, [props.employeeKpiSet, state.dataStatus]);

    function formatDate(date) {
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

    function formatMonth(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
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
    };

    /**Hiển thị nội dung 1 mục tiêu KPI mới khi click vào tên mục tiêu đó */
    const handleChangeContent = (id, employeeId, kpiType) => {
        let date = props.employeeKpiSet.date;
        props.getTaskById(id, employeeId, date, kpiType);
        setState({
            ...state,
            content: id,
            dataStatus: DATA_STATUS.QUERYING,
        });
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (dataKpi, dataDetailKpi) => {

        let fileName = "Thông tin chi tiết KPI cá nhân ";
        let kpiData = [], detailData;

        if (dataKpi) {
            fileName += " " + dataKpi.name;
            let dataObject = {
                kpiName: dataKpi.name,
                kpiCriteria: parse(dataKpi.criteria),
                kpiWeight: parseInt(dataKpi.weight),
                automaticPoint: (dataKpi.automaticPoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.automaticPoint),
                employeePoint: (dataKpi.employeePoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.employeePoint),
                approverPoint: (dataKpi.approvedPoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.approvedPoint),
                sheetTitle: "Thông tin chi tiết KPI " + dataKpi.name
            }
            kpiData.push(dataObject);
        }

        if (dataDetailKpi) {
            detailData = dataDetailKpi.map((x, index) => {
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
                    importantLevel: importantLevel,

                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: kpiData[0] && kpiData[0].sheetTitle,
                    tables: [
                        {
                            tableName: 'Thông tin chung KPI ' + (kpiData[0] && kpiData[0].kpiName),
                            columns: [
                                { key: "kpiName", value: "Tên KPI cá nhân" },
                                { key: "kpiCriteria", value: "Tiêu chí đánh giá" },
                                { key: "kpiWeight", value: "Trọng số (/100)" },
                                { key: "automaticPoint", value: "Điểm tự động" },
                                { key: "employeePoint", value: "Điểm tự đánh giá" },
                                { key: "approverPoint", value: "Điểm người phê duyệt đánh giá" },
                            ],
                            data: kpiData
                        },
                        {
                            tableName: 'Danh sách công việc ứng với KPI: ',
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên hoạt động" },
                                { key: "startTaskDate", value: "Ngày bắt đầu công việc" },
                                { key: "endTaskDate", value: "Ngày kết thúc công việc" },
                                { key: "startApproveDate", value: "Ngày bắt đầu đánh giá" },
                                { key: "endApproveDate", value: "Ngày kết thúc đánh giá" },
                                { key: "status", value: "Trạng thái" },
                                { key: "contributionPoint", value: "Đóng góp (%)" },
                                { key: "automaticPoint", value: "Điểm tự động" },
                                { key: "employeePoint", value: "Điểm tự đánh giá" },
                                { key: "approverPoint", value: "Điểm được phê duyệt" },
                                { key: "importantLevel", value: "Độ quan trọng" }

                            ],
                            data: detailData
                        }
                    ]
                },
            ]
        }
        return exportData;

    };

    const handleClickTaskName = async (id) => {
        setState({
            ...state,
            taskId: id,
        });
        window.$(`#modal-detail-task-kpi-detail`).modal('show');
    };

    const showDetailTaskImportanceCal = async (item) => {
        await setState({
            ...state,
            taskImportanceDetail: item
        })

        window.$(`#modal-taskimportance-auto`).modal('show')
    };

    if (kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;
    kpimember = kpimembers && kpimembers.kpimembers;

    if (kpimembers.currentKPI) {
        list = kpimembers.currentKPI.kpis;
    }

    if (myTask) {
        let dataKpi;
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i]._id === content) {
                    dataKpi = list[i];
                }
            }
        }
        exportData = convertDataToExportData(dataKpi, myTask);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-KPI-personal`}
                title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, ${translate('general.month')} ${formatMonth(employeeKpiSet.date)}`}
                hasSaveButton={false}
                size={100}
            >
                <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#overview" data-toggle="tab">{translate('menu.kpi_personal_overview')}</a></li>
                        <li><a href="#detail" data-toggle="tab">{translate('menu.kpi_member_detail')}</a></li>
                    </ul>
                    <div className="tab-content">
                        {/* Tổng quan KPI */}
                        <div className={"active tab-pane"} id="overview">
                            <EmployeeKpiOverviewModal />
                        </div>

                        {/* Chi tiết KPI */}
                        <div className={"tab-pane"} id="detail">
                            <div className="col-xs-12 col-sm-4">
                                <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                                    {/**Danh sách các mục tiêu của tập KPI đang xem */}
                                    <div className="box-header with-border">
                                        <h3 className="box-title" style={{ fontWeight: 800 }}>{translate('kpi.evaluation.employee_evaluation.KPI_list')}</h3>
                                    </div>

                                    {/**Xử lí khi người dùng muốn xem chi tiết mục tiêu */}
                                    <div className="box-body no-padding" style={{ height: "calc(60vh - 110px)", overflow: "auto" }}>
                                        <ul className="nav nav-pills nav-stacked">
                                            {list && list.map((item, index) =>
                                                <li key={index} className={state.content === item._id ? "active" : ""}>
                                                    <a style={{ cursor: "pointer" }} onClick={() => handleChangeContent(item._id, employeeKpiSet.creator._id, item.type)}>
                                                        {item.name}&nbsp;
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/**Nội dung chi tiết của 1 mục tiêu */}
                            <div className="col-xs-12 col-sm-8 qlcv">
                                {list && list.map(item => {
                                    if (item._id === state.content) return (
                                        <React.Fragment key={item._id}>
                                            <h4>{translate('kpi.evaluation.employee_evaluation.KPI_info') + " " + item.name}</h4>
                                            {exportData && <ExportExcel id="export-employee-kpi-management-detail-kpi" exportData={exportData} style={{ marginTop: 5 }} />}
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
                                                    <span> {item.automaticPoint ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                                    <span> - {item.employeePoint ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                                    <span> - {item.approvedPoint ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                                </div>

                                                {item.updatedAt &&
                                                    <div>
                                                        <label>{translate('kpi.evaluation.employee_evaluation.lastest_evaluation')}: </label>
                                                        <span> {formatDate(item.updatedAt)}</span>
                                                    </div>
                                                }
                                            </div>
                                            <br />
                                            <br />


                                            <h4>
                                                {translate('kpi.evaluation.employee_evaluation.task_list')}
                                                <DataTableSetting className="pull-right" tableId="employeeKpiEvaluate" tableContainerId="tree-table-container" tableWidth="1300px"
                                                    columnArr={[
                                                        translate('kpi.evaluation.employee_evaluation.index'),
                                                        translate('task.task_management.name'),
                                                        translate('kpi.evaluation.employee_evaluation.work_duration_time'),
                                                        translate('kpi.evaluation.employee_evaluation.evaluate_time'),
                                                        translate('kpi.evaluation.employee_evaluation.status'),
                                                        translate('kpi.evaluation.employee_evaluation.contribution'),
                                                        translate('kpi.evaluation.employee_evaluation.point'),
                                                        translate('kpi.evaluation.employee_evaluation.importance_level')]}
                                                    limit={state.perPage}
                                                    hideColumnOption={true}
                                                />
                                            </h4>
                                            <div className="table-wrapper-scroll-y my-custom-scrollbar" style={{ height: "calc(80vh - 160px)", overflow: "auto" }}>
                                                {/**Table danh sách công việc của mục tiêu */}
                                                <table id="employeeKpiEvaluate" className="table table-striped table-hover table-bordered" style={{ marginBottom: 0 }}>
                                                    <thead>
                                                        <tr>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.index')} style={{ width: "40px" }} className="col-fixed">{translate('kpi.evaluation.employee_evaluation.index')}</th>
                                                            <th title={translate('task.task_management.name')}>{translate('task.task_management.name')}</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.work_duration_time')}>{translate('kpi.evaluation.employee_evaluation.work_duration_time')}</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.evaluate_time')}>{translate('kpi.evaluation.employee_evaluation.evaluate_time')}</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.status')}>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.contribution')}>{translate('kpi.evaluation.employee_evaluation.contribution')} (%)</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.point')}>{translate('kpi.evaluation.employee_evaluation.point')}</th>
                                                            <th title={translate('kpi.evaluation.employee_evaluation.importance_level')}>{translate('kpi.evaluation.employee_evaluation.importance_level')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            (kpimembers?.tasks?.length > 0 && Array.isArray(kpimembers.tasks)) 
                                                                && (kpimembers.tasks.map((itemTask, index) =>
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td><a style={{ cursor: 'pointer' }} onClick={() => handleClickTaskName(itemTask.taskId)}>{itemTask.name}</a></td>
                                                                        <td>{formatDate(itemTask.startDateTask)}<br /> <i className="fa fa-angle-double-down"></i><br /> {formatDate(itemTask.endDateTask)}</td>
                                                                        <td>{itemTask.startDate ? formatDate(itemTask.startDate) : ""}<br /> <i className="fa fa-angle-double-down"></i><br /> {itemTask.endDate ? formatDate(itemTask.endDate) : ""}</td>
                                                                        <td>{formatTaskStatus(translate, itemTask.status)}</td>
                                                                        <td>{itemTask.results.contribution ? itemTask.results.contribution : 0}%</td>
                                                                        <td>{itemTask.results.automaticPoint + '-' + itemTask.results.employeePoint + '-' + itemTask.results.approvedPoint}</td>
                                                                        <td>
                                                                            <div>
                                                                                {translate('kpi.evaluation.employee_evaluation.evaluated_value')}: {itemTask.results.taskImportanceLevel}
                                                                            </div>
                                                                            <div>
                                                                                <a href="#modal-taskimportance-auto" onClick={() => showDetailTaskImportanceCal(itemTask)}>
                                                                                    {translate('kpi.evaluation.employee_evaluation.auto_value')}: {itemTask.taskImportanceLevelCal}
                                                                                </a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>)
                                                                )
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
                                        </React.Fragment>);
                                    return true;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
            {<ModalDetailTask action={'kpi-detail'} id={taskId} />}
        </React.Fragment>
    );
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getTaskById: kpiMemberActions.getTaskById,
};
const connectedModalDetailKPIPersonal = connect(mapState, actionCreators)(withTranslate(ModalDetailKPIPersonal));
export { connectedModalDetailKPIPersonal as ModalDetailKPIPersonal };

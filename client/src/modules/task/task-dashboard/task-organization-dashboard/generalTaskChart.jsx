import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { connect } from 'react-redux';
import dayjs from 'dayjs'
import { SlimScroll, DataTableSetting, TreeTable } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import './generalTaskChart.css';
import ViewAllGeneralTask from './viewAllGeneralTask';
import _cloneDeep from 'lodash/cloneDeep';
// import useDeepCompareEffect from 'use-deep-compare-effect'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'



const GeneralTaskChart = (props) => {
    const tableId = "general-list-task";
    const defaultConfig = { hiddenColumns: ["5", "6", "7", "8"] }

    getTableConfiguration(tableId, defaultConfig)

    const { translate, tasks } = props;
    const { taskDashboardCharts } = tasks
    const [state, setState] = useState({ dataTable: [] });
    // const [collapse, setCollapse] = useState({

    // });
    const [showDetailTask, setShowTask] = useState({
        tasks: [],
        nameUnit: "",
    });

    const checkExport = useRef(false);

    let column = [
        { name: translate('task.task_dashboard.unit'), key: "name" },
        { name: translate('task.task_dashboard.all_tasks'), key: "totalTask" },
        { name: translate('task.task_dashboard.all_tasks_inprocess'), key: "taskInprocess" },
        { name: translate('task.task_dashboard.all_tasks_finished'), key: "taskFinished" },
        { name: translate('task.task_dashboard.confirmed_task'), key: "confirmedTask" },
        { name: translate('task.task_dashboard.none_update_recently'), key: "noneUpdateTask" },
        { name: translate('task.task_dashboard.intime_task'), key: "intimeTask" },
        { name: translate('task.task_dashboard.delay_task'), key: "delayTask" },
        { name: translate('task.task_dashboard.overdue_task'), key: "overdueTask" }
    ];
    const { dataTable } = state

    useLayoutEffect(() => {
        if (checkExport) {
            dataTable && dataTable.length > 0 && convertDataExport(dataTable);
        }
    }, [JSON.stringify(dataTable)])

    useEffect(() => {
        let data1 = getData("general-task-chart")
        if (data1) {
            checkExport.current = true;
            setState({
                ...state,
                dataTable: data1
            })
        }

    }, [JSON.stringify(taskDashboardCharts)]);

    function getData(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data.dataChart
        }
        return dataChart;
    }

    const convertDataExport = (data) => {
        const { translate, unitNameSelected, startMonthTitle, endMonthTitle } = props;
        let newData = _cloneDeep(data);
        newData = newData.map((o, index) => ({
            STT: index + 1,
            unit: o.name ? o.name : "",
            allTask: o.totalTask ? o.totalTask.length : 0,
            allTaskInprocess: o.taskInprocess ? o.taskInprocess.length : 0,
            allTaskFinished: o.taskFinished ? o.taskFinished.length : 0,
            confirmedTask: o.confirmedTask ? o.confirmedTask.length : 0,
            noneUpdate: o.noneUpdateTask ? o.noneUpdateTask.length : 0,
            intimeTask: o.intimeTask ? o.intimeTask.length : 0,
            delayTask: o.delayTask ? o.delayTask.length : 0,
            overdueTask: o.overdueTask ? o.overdueTask.length : 0,
        }))
        const listUnitSelect = unitNameSelected && unitNameSelected.length > 0 ?
            unitNameSelected.map((o, index) => (
                { STT: index + 1, name: o }
            ))
            : [];

        let exportData = {
            fileName: `${translate('task.task_dashboard.general_unit_task_title_file_export')}`,
            dataSheets: [
                {
                    sheetName: 'sheet1',
                    sheetTitle: `${translate('task.task_dashboard.general_unit_task')} của ${props.unitNameSelected && props.unitNameSelected.length} đơn vị từ ${startMonthTitle} đến ${endMonthTitle} `,
                    tables: [
                        {
                            note: `Chú ý: Xem danh sách ${props.unitNameSelected && props.unitNameSelected.length} đơn vị ở sheet thứ 2 `,
                            noteHeight: 20,
                            columns: [
                                { key: "STT", value: 'STT', width: 7 },
                                { key: "unit", value: translate('task.task_dashboard.unit'), width: 20 },
                                { key: "allTask", value: translate('task.task_dashboard.all_tasks'), width: 20 },
                                { key: "allTaskInprocess", value: translate('task.task_dashboard.all_tasks_inprocess'), width: 25 },
                                { key: "allTaskFinished", value: translate('task.task_dashboard.all_tasks_finished') },
                                { key: "confirmedTask", value: translate('task.task_dashboard.confirmed_task') },
                                { key: "noneUpdate", value: translate('task.task_dashboard.none_update_recently') },
                                { key: "intimeTask", value: translate('task.task_dashboard.intime_task'), width: 25 },
                                { key: "delayTask", value: translate('task.task_dashboard.delay_task'), width: 25 },
                                { key: "overdueTask", value: translate('task.task_dashboard.overdue_task'), width: 25 },
                            ],
                            data: newData,
                        }
                    ]
                },
                {
                    sheetName: 'sheet2',
                    sheetTitle: `Danh sách ${props.unitNameSelected && props.unitNameSelected.length} đơn vị`,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "Số thứ tự" },
                                { key: "name", value: "Tên đơn vị" },
                            ],
                            data: listUnitSelect
                        }
                    ]
                }
            ]
        }
        if (exportData)
            props.handleDataExport(exportData)
    }

    // Xử lý click vào row unit show hide row children
    // const toggleCollapse = (idParent, parent) => {
    //     let cloneArr = _cloneDeep(state);
    //     // Chỉ có những row nào mà có parent, tức là tên unit
    //     if (parent) {
    //         cloneArr = cloneArr.map(obj => {
    //             // check con của unit click set laij biến show
    //             if (idParent === obj.parent) {
    //                 obj.show = !obj.show;
    //             }
    //             return obj;
    //         })
    //         // cập nhật state
    //         setState(cloneArr);

    //         let title = `collapse${idParent}`;
    //         setCollapse({
    //             ...collapse,
    //             [title]: !collapse.hasOwnProperty([title]) ? false : !collapse[title]
    //         })
    //     }
    // }

    const handleShowGeneralTask = (tasks, name, index, type) => {
        if (tasks?.length > 0) {
            setShowTask({
                ...showDetailTask,
                tasks: tasks,
                nameUnit: name,
                rowIndex: index,
                taskType: type,

            });
            window.$('#modal-view-all-general-task').modal('show');
        }
    }

    // const removeTaskStatusFinished = (data) => {
    //     if (data && data.length > 0) {
    //         return data.filter(o => o.status !== "finished");
    //     } else return data;
    // }


    const bindTextToEvent = (key, text, data, name = "", index = 0, bold = "bold") => {
        let textColor = "";
        switch (key) {
            case "name":
                return (
                    <span >{text}</span>
                )
            case "totalTask":
                textColor = "#777";
                break;
            case "taskFinished":
                textColor = "#28A745 ";
                break;
            case "intimeTask":
                textColor = "#3c763d";
                break;
            case "delayTask":
                textColor = "#f39c12 ";
                break;
            case "overdueTask":
                textColor = "#dd4b39 ";
                break;
            default:
                textColor = "#385898";
        }
        return (
            <a onClick={() => handleShowGeneralTask(data, name, index, key)} style={{ color: textColor, fontWeight: bold }}>{text}</a>
        )
    }
    let data = [];
    let dataTemp = dataTable?.filter(o => o.name);
    for (let i in dataTemp) {

        let bold = dataTemp[i].parent && dataTemp[i].parent !== true ? "normal" : "bold";
        data[i] = {
            ...dataTemp[i],
            name: bindTextToEvent("name", dataTemp[i].name, dataTemp[i], bold),
            totalTask: bindTextToEvent("totalTask", dataTemp[i].totalTask.length, dataTemp[i].totalTask, dataTemp[i].name, i, bold),
            taskInprocess: bindTextToEvent("taskInprocess", dataTemp[i].taskInprocess.length, dataTemp[i].taskInprocess, dataTemp[i].name, i, bold),
            taskFinished: bindTextToEvent("taskFinished", dataTemp[i].taskFinished.length, dataTemp[i].taskFinished, dataTemp[i].name, i, bold),
            confirmedTask: bindTextToEvent("confirmedTask", dataTemp[i].confirmedTask.length, dataTemp[i].confirmedTask, dataTemp[i].name, i, bold),
            noneUpdateTask: bindTextToEvent("noneUpdateTask", dataTemp[i].noneUpdateTask.length, dataTemp[i].noneUpdateTask, dataTemp[i].name, i, bold),
            intimeTask: bindTextToEvent("intimeTask", dataTemp[i].intimeTask.length, dataTemp[i].intimeTask, dataTemp[i].name, i, bold),
            delayTask: bindTextToEvent("delayTask", dataTemp[i].delayTask.length, dataTemp[i].delayTask, dataTemp[i].name, i, bold),
            overdueTask: bindTextToEvent("overdueTask", dataTemp[i].overdueTask.length, dataTemp[i].overdueTask, dataTemp[i].name, i, bold),
            parent: dataTemp[i].parent && dataTemp[i].parent !== true ? dataTemp[i].parent : null,
            _id: dataTemp[i]._id ? dataTemp[i]._id : -1
        }
    }
    return (
        <React.Fragment>
            <ViewAllGeneralTask showDetailTask={showDetailTask} />
            <div className="general_task_unit" id="general-list-task-wrapper" style={{ marginTop: '20px' }}>
                <TreeTable
                    tableId={tableId}
                    tableSetting={true}
                    rowPerPage={false}
                    behaviour="hide-children"
                    column={column}
                    data={data}
                    actions={false}
                />
            </div>
            {/* <div className="general_task_unit" id="general-list-task-wrapper">
                <table id='general-list-task' className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th title={translate('task.task_dashboard.unit')} style={{ width: '155px' }}>{translate('task.task_dashboard.unit')}</th>
                            <th title={translate('task.task_dashboard.all_tasks')}>{translate('task.task_dashboard.all_tasks')}</th>
                            <th title={translate('task.task_dashboard.all_tasks_inprocess')}>{translate('task.task_dashboard.all_tasks_inprocess')}</th>
                            <th title={translate('task.task_dashboard.all_tasks_finished')}>{translate('task.task_dashboard.all_tasks_finished')}</th>
                            <th title={translate('task.task_dashboard.confirmed_task')}>{translate('task.task_dashboard.confirmed_task')}</th>
                            <th title={translate('task.task_dashboard.none_update_recently')}>{translate('task.task_dashboard.none_update_recently')}</th>
                            <th title={translate('task.task_dashboard.intime_task')}>{translate('task.task_dashboard.intime_task')}</th>
                            <th title={translate('task.task_dashboard.delay_task')}>{translate('task.task_dashboard.delay_task')}</th>
                            <th title={translate('task.task_dashboard.overdue_task')}>{translate('task.task_dashboard.overdue_task')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.filter(o => o.name).map((x, index) => {
                                return (
                                    <tr key={index} style={{ fontWeight: x.organization ? 600 : 500, display: x.show ? "table-row" : "none", }} >
                                        <td style={{ display: x.parent === true ? 'flex' : 'table-cell', cursor: 'pointer', paddingLeft: x.parent === true ? '8px' : '30px' }} onClick={() => toggleCollapse(x?._id, x.parent)}>
                                            {
                                                x.parent === true && <span className="material-icons" style={{ fontWeight: "bold", marginRight: '5px' }}>
                                                    {collapse && collapse[`collapse${x?._id}`] === false ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                                                </span>
                                            }
                                            <span>{x.name}</span>
                                        </td>
                                        <td><a onClick={() => handleShowGeneralTask(x.totalTask, x.name, index, 'totalTask')} className="text-muted">{x.totalTask.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.taskInprocess, x.name, index, 'taskInprocess')}>{x.taskInprocess.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.taskFinished, x.name, index, 'taskFinished')} className="text-green">{x.taskFinished.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.confirmedTask, x.name, index, 'confirmedTask')}>{x.confirmedTask.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(removeTaskStatusFinished(x.noneUpdateTask), x.name, index, 'noneUpdateTask')}>{removeTaskStatusFinished(x.noneUpdateTask).length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.intimeTask, x.name, index, 'intimeTask')} className="text-success">{x.intimeTask.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.delayTask, x.name, index, 'delayTask')} className="text-yellow">{x.delayTask.length}</a></td>
                                        <td><a onClick={() => handleShowGeneralTask(x.overdueTask, x.name, index, 'overdueTask')} className="text-red">{x.overdueTask.length}</a></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div> */}
            <SlimScroll verticalScroll={true} outerComponentId={"general-list-task-wrapper"} maxHeight={500} activate={true} />
        </React.Fragment>
    )
}
function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {

};

export default connect(mapState, actionCreators)(withTranslate(GeneralTaskChart));
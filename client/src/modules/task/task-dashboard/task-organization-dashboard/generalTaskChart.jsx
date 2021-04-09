import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import moment from 'moment'
import { SlimScroll, DataTableSetting } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import './generalTaskChart.css';
import ViewAllGeneralTask from './viewAllGeneralTask';
import _cloneDeep from 'lodash/cloneDeep';
import useDeepCompareEffect from 'use-deep-compare-effect'

const GeneralTaskChart = (props) => {
    const { translate } = props;
    const dataTable = []
    const [state, setstate] = useState([]);
    const [collapse, setCollapse] = useState({

    });
    const [showDetailTask, setShowTask] = useState({
        tasks: [],
        nameUnit: "",
    });

    const checkExport = useRef(false);

    const countTask = (tasklist, name) => {
        let confirmedTask = [], noneUpdateTask = [], intimeTask = [], delayTask = [], overdueTask = [], taskFinished = [], taskInprocess = [];

        for (let i in tasklist) {
            let start = moment(tasklist[i]?.startDate);
            let end = moment(tasklist[i]?.endDate);
            let lastUpdate = moment(tasklist[i]?.updatedAt);
            let now = moment(new Date());
            let duration = end.diff(start, 'days');
            let uptonow = now.diff(lastUpdate, 'days');
            if (tasklist[i]?.confirmedByEmployees?.length) {
                confirmedTask = [...confirmedTask, tasklist[i]];
            }
            if (uptonow >= 7) {
                noneUpdateTask = [...noneUpdateTask, tasklist[i]];
            }
            if (tasklist[i]?.status === 'inprocess') {
                if (now > end) {
                    // Quá hạn
                    overdueTask = [...overdueTask, tasklist[i]];
                }
                else {
                    let processDay = Math.floor(tasklist[i]?.progress * duration / 100);
                    let startToNow = now.diff(start, 'days');

                    if (startToNow > processDay) {
                        // Trễ hạn
                        delayTask = [...delayTask, tasklist[i]];
                    }
                    else if (startToNow <= processDay) {
                        // Đúng hạn
                        intimeTask = [...intimeTask, tasklist[i]];
                    }
                }
            }
            if (tasklist[i] && tasklist[i].status === "finished") {
                taskFinished = [...taskFinished, tasklist[i]];
            }
            if (tasklist[i] && tasklist[i].status === "inprocess") {
                taskInprocess = [...taskInprocess, tasklist[i]];
            }
        }
        return {
            name: name ? name : "",
            totalTask: tasklist,
            confirmedTask,
            noneUpdateTask,
            intimeTask,
            delayTask,
            overdueTask,
            taskFinished,
            taskInprocess,
            organization: true,
            show: true,
        }
    }

    const processTask = (task) => {
        let propNames = ['totalTask'];
        let start = moment(task?.startDate);
        let end = moment(task?.endDate);
        let lastUpdate = moment(task?.updatedAt);
        let now = moment(new Date());
        let duration = end.diff(start, 'days');
        let uptonow = now.diff(lastUpdate, 'days');
        if (task?.confirmedByEmployees?.length) {
            propNames.push('confirmedTask');
        }
        if (uptonow >= 7) {
            propNames.push('noneUpdateTask');
        }
        if (task?.status === 'inprocess') {
            if (now > end) {
                // Quá hạn
                propNames.push('overdueTask');
            }
            else {
                let processDay = Math.floor(task?.progress * duration / 100);
                let startToNow = now.diff(start, 'days');

                if (startToNow > processDay) {
                    // Trễ hạn
                    propNames.push('delayTask');
                }
                else if (startToNow <= processDay) {
                    // Đúng hạn
                    propNames.push('intimeTask');
                }
            }
        }

        if (task && task.status === "finished") {
            propNames.push('taskFinished');
        }
        if (task && task.status === "inprocess") {
            propNames.push('taskInprocess');
        }
        return propNames

    }

    const freshListEmployee = (listEmployee) => {
        let arr = [];
        let result = [];
        listEmployee && listEmployee.forEach((x, index) => {
            if (x.managers) {
                for (const [key, value] of Object.entries(x.managers)) {
                    if (value.members && value.members.length > 0) {
                        value.members.forEach((o) => {
                            arr = [...arr, o];
                        });
                    }
                }
            }

            if (x.deputyManagers) {
                for (const [key, value] of Object.entries(x.deputyManagers)) {
                    if (value.members && value.members.length > 0) {
                        value.members.forEach((o) => {
                            arr = [...arr, o];
                        });
                    }
                }
            }

            if (x.employees) {
                for (const [key, value] of Object.entries(x.employees)) {
                    if (value.members && value.members.length > 0) {
                        value.members.forEach((o) => {
                            arr = [...arr, o];
                        });
                    }
                }
            }

            // Lọc các nhân viên trùng nhau sau khi thực hiện ở trên
            // vì 1 nhân viên có thể có nhiều chức ở các đơn vị khác nhau nên chỉ lọc lấy 1 cái
            const seen = new Set();
            const filteredArr = arr.filter((el) => {
                const duplicate = seen.has(el._id);
                seen.add(el._id);
                return !duplicate;
            });
            result = [...filteredArr];
        })
        return result;
    }


    useLayoutEffect(() => {
        if (checkExport) {
            state && state.length > 0 && convertDataExport(state);
        }
    }, [state])

    useDeepCompareEffect(() => {
        console.count();
        const { tasks, units, unitSelected, employees } = props;
        const allTasks = tasks?.tasks;

        const listEmployee = {};
        //Lay cac cong viec cua cac unit da chon
        const tasksOfSelectedUnit = allTasks?.filter(x =>
            unitSelected?.includes(x?.organizationalUnit?._id))

        // Dem cong viec cua tat ca cac unit da chon
        let dataRow = countTask(tasksOfSelectedUnit, 'Tổng');
        dataTable.push(dataRow);

        // Dem cong viec cua tung unit da chon
        let listUnit = [];
        units && units.forEach(unit => {
            if (unitSelected?.includes(unit && unit.id)) {
                listUnit.push(unit);
            }
        });

        const employeesNew = freshListEmployee(employees);
        if (employeesNew && employeesNew.length) {
            for (let i in employeesNew) {
                let x = employeesNew[i]
                listEmployee[x._id] = x.name;
            }
        }

        let data = {};
        for (let i in tasksOfSelectedUnit) {
            let result = processTask(tasksOfSelectedUnit[i])
            let unitName = tasksOfSelectedUnit?.[i]?.organizationalUnit?.name;

            for (let j in result) {
                if (data && !data?.[unitName]) {
                    data[unitName] = {};
                }
                if (data?.[unitName] && !data?.[unitName]?.[result?.[j]]) {
                    data[unitName][result[j]] = [];
                }

                if (data[unitName]) {
                    data[unitName][result[j]] = [...data[unitName][result[j]], tasksOfSelectedUnit[i]];
                    data[unitName].name = unitName;
                }

                let resEmployee = tasksOfSelectedUnit[i].responsibleEmployees;
                let employeeInTask = [];

                for (let e in resEmployee) {
                    employeeInTask.push(resEmployee[e].id)
                }
                // Loc cac id trung nhau
                let uniqueEmployeeId = Array.from(new Set(employeeInTask));

                for (let k in uniqueEmployeeId) {
                    let idEmployee = uniqueEmployeeId[k];
                    if (data?.[unitName] && !data[unitName][idEmployee]) {
                        data[unitName][idEmployee] = {}
                    }
                    if (data?.[unitName]?.[idEmployee] && !data[unitName][idEmployee][result?.[j]]) {
                        data[unitName][idEmployee][result[j]] = [];
                    }
                    if (data?.[unitName]?.[idEmployee]) {
                        data[unitName][idEmployee][result[j]] = [...data[unitName][idEmployee][result[j]], tasksOfSelectedUnit[i]];
                        data[unitName][idEmployee].name = idEmployee;
                    }
                }
            }
        }


        for (let i in listUnit) {
            let unitName = listUnit?.[i]?.name;
            if (!Object.keys(data).includes(unitName)) {
                dataTable.push({
                    parent: true,
                    _id: unitName,
                    confirmedTask: [],
                    delayTask: [],
                    intimeTask: [],
                    name: unitName,
                    noneUpdateTask: [],
                    overdueTask: [],
                    totalTask: [],
                    taskFinished: [],
                    taskInprocess: [],
                    organization: true,
                    show: true,
                });
            }
            else {
                let unit = data[unitName];
                // Thêm số công việc của cả phòng vào mảng dataTable
                dataTable.push({
                    parent: true,
                    _id: unitName,
                    confirmedTask: unit.confirmedTask ? unit.confirmedTask : [],
                    delayTask: unit.delayTask ? unit.delayTask : [],
                    intimeTask: unit.intimeTask ? unit.intimeTask : [],
                    name: unitName,
                    noneUpdateTask: unit.noneUpdateTask ? unit.noneUpdateTask : [],
                    overdueTask: unit.overdueTask ? unit.overdueTask : [],
                    totalTask: unit.totalTask ? unit.totalTask : [],
                    taskFinished: unit.taskFinished ? unit.taskFinished : [],
                    taskInprocess: unit.taskInprocess ? unit.taskInprocess : [],
                    organization: true,
                    show: true,
                });
                // Thêm số công việc tuwngf nhaan vieen trong phòng vào mảng dataTable
                for (let key in unit) {
                    if (unit[key].name) {
                        dataTable.push({
                            _id: unit?.[key]?.name,
                            parent: unitName,
                            confirmedTask: unit?.[key]?.confirmedTask ? unit[key].confirmedTask : [],
                            delayTask: unit?.[key]?.delayTask ? unit[key].delayTask : [],
                            intimeTask: unit?.[key]?.intimeTask ? unit[key].intimeTask : [],
                            name: listEmployee?.[unit?.[key].name],
                            noneUpdateTask: unit?.[key]?.noneUpdateTask ? unit[key].noneUpdateTask : [],
                            overdueTask: unit?.[key]?.overdueTask ? unit[key].overdueTask : [],
                            totalTask: unit?.[key]?.totalTask ? unit[key].totalTask : [],
                            taskFinished: unit?.[key]?.taskFinished ? unit[key].taskFinished : [],
                            taskInprocess: unit?.[key]?.taskInprocess ? unit[key].taskInprocess : [],
                            organization: false,
                            show: false,
                        });
                    }
                }
            }
        }

        checkExport.current = true;

        setstate(dataTable);
    }, [props.tasks]);


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
    const toggleCollapse = (idParent, parent) => {
        let cloneArr = _cloneDeep(state);
        // Chỉ có những row nào mà có parent, tức là tên unit
        if (parent) {
            cloneArr = cloneArr.map(obj => {
                // check con của unit click set laij biến show
                if (idParent === obj.parent) {
                    obj.show = !obj.show;
                }
                return obj;
            })
            // cập nhật state
            setstate(cloneArr);

            let title = `collapse${idParent}`;
            setCollapse({
                ...collapse,
                [title]: !collapse.hasOwnProperty([title]) ? false : !collapse[title]
            })
        }
    }

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

    const removeTaskStatusFinished = (data) => {
        if (data && data.length > 0) {
            return data.filter(o => o.status !== "finished");
        } else return data;
    }

    return (
        <React.Fragment>
            <ViewAllGeneralTask showDetailTask={showDetailTask} />
            <DataTableSetting className="pull-right" tableId='general-list-task' tableContainerId="tree-table-container" tableWidth="1300px"
                columnArr={[
                    translate('task.task_dashboard.unit'),
                    translate('task.task_dashboard.all_tasks'),
                    translate('task.task_dashboard.all_tasks_inprocess'),
                    translate('task.task_dashboard.all_tasks_finished'),
                    translate('task.task_dashboard.confirmed_task'),
                    translate('task.task_dashboard.none_update_recently'),
                    translate('task.task_dashboard.intime_task'),
                    translate('task.task_dashboard.delay_task'),
                    translate('task.task_dashboard.overdue_task')
                ]}
                linePerPageOption={false}
            />
            <div className="general_task_unit" id="general-list-task-wrapper">
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
                            state.map((x, index) => {
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
            </div>
            <SlimScroll verticalScroll={true} outerComponentId={"general-list-task-wrapper"} maxHeight={500} activate={true} />
        </React.Fragment>
    )
}

export default withTranslate(GeneralTaskChart);
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { DataTableSetting, TreeTable } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

const GeneralTaskChart = (props) => {
    const { translate } = props;
    const dataTable = []
    const [state, setstate] = useState([]);


    const countTask = (tasklist, name) => {
        let confirmedTask = 0, noneUpdateTask = 0, intimeTask = 0, delayTask = 0, overdueTask = 0, taskFinished = 0, taskInprocess = 0;

        for (let i in tasklist) {
            let start = moment(tasklist[i]?.startDate);
            let end = moment(tasklist[i]?.endDate);
            let lastUpdate = moment(tasklist[i]?.updatedAt);
            let now = moment(new Date());
            let duration = end.diff(start, 'days');
            let uptonow = now.diff(lastUpdate, 'days');
            if (tasklist[i]?.confirmedByEmployees?.length) {
                confirmedTask++;
            }
            if (uptonow >= 7) {
                noneUpdateTask++;
            }
            if (tasklist[i]?.status === 'inprocess') {
                if (now > end) {
                    // Quá hạn
                    overdueTask++;
                }
                else {
                    let processDay = Math.floor(tasklist[i]?.progress * duration / 100);
                    let startToNow = now.diff(start, 'days');

                    if (startToNow > processDay) {
                        // Trễ hạn
                        delayTask++;
                    }
                    else if (startToNow <= processDay) {
                        // Đúng hạn
                        intimeTask++;
                    }
                }
            }
            if (tasklist[i] && tasklist[i].status === "finished") {
                taskFinished++;
            }
            if (tasklist[i] && tasklist[i].status === "inprocess") {
                taskInprocess++;
            }
        }
        return {
            parent: null,
            _id: 'parent',
            name: name ? name : "",
            totalTask: tasklist.length,
            confirmedTask,
            noneUpdateTask,
            intimeTask,
            delayTask,
            overdueTask,
            taskFinished,
            taskInprocess,
            organization: true
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

    useEffect(() => {
        const { tasks, units, unitSelected, employees } = props;
        const allTasks = tasks?.tasks;

        const listEmployee = {};
        //Lay cac cong viec cua cac unit da chon
        const tasksOfSelectedUnit = allTasks.filter(x =>
            unitSelected.includes(x?.organizationalUnit?._id))

        // Dem cong viec cua tat ca cac unit da chon
        let dataRow = countTask(tasksOfSelectedUnit, 'Tổng');
        dataTable.push(dataRow);

        // Dem cong viec cua tung unit da chon
        let listUnit = [];
        units && units.forEach(unit => {
            if (unitSelected.includes(unit?.id)) {
                listUnit.push(unit);
            }
        });

        if (employees && employees.length) {
            for (let i in employees) {
                let x = employees[i].userId
                listEmployee[x.id] = x.name;
            }
        }

        let data = {};
        for (let i in tasksOfSelectedUnit) {
            let result = processTask(tasksOfSelectedUnit[i])
            let unitName = tasksOfSelectedUnit[i].organizationalUnit.name;

            for (let j in result) {
                if (!data[unitName]) {
                    data[unitName] = {};
                }
                if (!data[unitName][result[j]]) {
                    data[unitName][result[j]] = 0;
                }
                data[unitName][result[j]]++;
                data[unitName].name = unitName;

                let resEmployee = tasksOfSelectedUnit[i].responsibleEmployees;
                let employeeInTask = [];

                for (let e in resEmployee) {
                    employeeInTask.push(resEmployee[e].id)
                }
                // Loc cac id trung nhau
                let uniqueEmployeeId = Array.from(new Set(employeeInTask));

                for (let k in uniqueEmployeeId) {
                    let idEmployee = uniqueEmployeeId[k];
                    if (!data[unitName][idEmployee]) {
                        data[unitName][idEmployee] = {}
                    }
                    if (!data[unitName][idEmployee][result[j]]) {
                        data[unitName][idEmployee][result[j]] = 0;
                    }
                    data[unitName][idEmployee][result[j]]++;
                    data[unitName][idEmployee].name = idEmployee;
                }
            }
        }


        for (let i in listUnit) {
            let unitName = listUnit[i]?.name;
            if (!Object.keys(data).includes(unitName)) {
                dataTable.push({
                    parent: null,
                    _id: unitName,
                    confirmedTask: 0,
                    delayTask: 0,
                    intimeTask: 0,
                    name: unitName,
                    noneUpdateTask: 0,
                    overdueTask: 0,
                    totalTask: 0,
                    taskFinished: 0,
                    taskInprocess: 0,
                    organization: true
                });
            }
            else {
                let unit = data[unitName];
                dataTable.push({
                    parent: null,
                    _id: unitName,
                    confirmedTask: unit.confirmedTask ? unit.confirmedTask : 0,
                    delayTask: unit.delayTask ? unit.delayTask : 0,
                    intimeTask: unit.intimeTask ? unit.intimeTask : 0,
                    name: unitName,
                    noneUpdateTask: unit.noneUpdateTask ? unit.noneUpdateTask : 0,
                    overdueTask: unit.overdueTask ? unit.overdueTask : 0,
                    totalTask: unit.totalTask ? unit.totalTask : 0,
                    taskFinished: unit.taskFinished ? unit.taskFinished : 0,
                    taskInprocess: unit.taskInprocess ? unit.taskInprocess : 0,
                    organization: true
                });
                for (let key in unit) {
                    if (unit[key].name) {
                        dataTable.push({
                            _id: unit[key].name,
                            parent: unitName,
                            confirmedTask: unit[key].confirmedTask ? unit[key].confirmedTask : 0,
                            delayTask: unit[key].delayTask ? unit[key].delayTask : 0,
                            intimeTask: unit[key].intimeTask ? unit[key].intimeTask : 0,
                            name: listEmployee[unit[key].name],
                            noneUpdateTask: unit[key].noneUpdateTask ? unit[key].noneUpdateTask : 0,
                            overdueTask: unit[key].overdueTask ? unit[key].overdueTask : 0,
                            totalTask: unit[key].totalTask ? unit[key].totalTask : 0,
                            taskFinished: unit[key].taskFinished ? unit[key].taskFinished : 0,
                            taskInprocess: unit[key].taskInprocess ? unit[key].taskInprocess : 0,
                            organization: false
                        });
                    }
                }
            }
        }

        setstate(dataTable);


    }, [props.employees]);


    let column = [
        { name: translate('task.task_dashboard.unit'), key: "unit" },
        { name: translate('task.task_dashboard.all_tasks'), key: "all_task" },
        { name: translate('task.task_dashboard.all_tasks_inprocess'), key: "all_task_inprocess" },
        { name: translate('task.task_dashboard.all_tasks_finished'), key: "all_task_finished" },
        { name: translate('task.task_dashboard.confirmed_task'), key: "confirmed_task" },
        { name: translate('task.task_dashboard.none_update_recently'), key: "none_update" },
        { name: translate('task.task_dashboard.intime_task'), key: "intime_task" },
        { name: translate('task.task_dashboard.delay_task'), key: "delay_task" },
        { name: translate('task.task_dashboard.overdue_task'), key: "overdue_task" },
    ];

    let data = [];
    if (state && state.length > 0) {
        for (let i in state) {
            data[i] = {
                _id: state[i]._id,
                unit: state[i].name,
                all_task: state[i].totalTask,
                all_task_inprocess: state[i].taskInprocess,
                all_task_finished: state[i].taskFinished,
                confirmed_task: state[i].confirmedTask,
                none_update: state[i].noneUpdateTask,
                intime_task: state[i].intimeTask,
                delay_task: state[i].delayTask,
                overdue_task: state[i].overdueTask,
                parent: state[i].parent,
            }
        }
    }

    return (
        <div style={{ height: "410px", overflowY: 'auto' }}>
            <TreeTable
                tableId="generalTaskUnit"
                behaviour="show-children"
                column={column}
                data={data}
                actions={false}
            />
        </div>

    )
}

export default withTranslate(GeneralTaskChart);

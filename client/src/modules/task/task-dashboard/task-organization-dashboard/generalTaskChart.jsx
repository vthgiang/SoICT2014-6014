import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { DataTableSetting } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

const GeneralTaskChart = (props) => {
    const { translate } = props;
    const dataTable = []
    const [state, setstate] = useState([]);


    const countTask = (tasklist, name) => {
        let confirmedTask = 0, noneUpdateTask = 0, intimeTask = 0, delayTask = 0, overdueTask = 0;

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
        }
        return {
            name: name ? name : "",
            totalTask: tasklist.length,
            confirmedTask,
            noneUpdateTask,
            intimeTask,
            delayTask,
            overdueTask,
            organization: true
        }
    }

    const processTask = (task) => {
        // let confirmedTask = 0, noneUpdateTask = 0, intimeTask = 0, delayTask = 0, overdueTask = 0;

        // for (let i in tasklist) {
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
        // }
        return propNames
        // {
        //     name: name ? name : "hello",
        //     totalTask: tasklist.length,
        //     confirmedTask,
        //     noneUpdateTask,
        //     intimeTask,
        //     delayTask,
        //     overdueTask
        // }
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

        console.log("===employee===", employees);
        if (employees && employees.length) {
            for (let i in employees) {
                let x = employees[i].userId
                listEmployee[x.id] = x.name;
            }
        }

        // console.log("selected unit task", listEmployee);
        // console.log("selected unit task", tasks);
        let data = {};
        for (let i in tasksOfSelectedUnit) {
            let result = processTask(tasksOfSelectedUnit[i])
            let unitName = tasksOfSelectedUnit[i].organizationalUnit.name;
            // console.log("nameeeeeeeee", unitName);

            for (let j in result) {
                // console.log("jjjjjjj", result[j]);
                if (!data[unitName]) {
                    data[unitName] = {};
                }
                if (!data[unitName][result[j]]) {
                    data[unitName][result[j]] = 0;
                }
                // else {
                data[unitName][result[j]]++;
                // data[unitName].unit = true;
                data[unitName].name = unitName;
                // }
                let resEmployee = tasksOfSelectedUnit[i].responsibleEmployees;
                let employeeInTask = [];

                for (let e in resEmployee) {
                    employeeInTask.push(resEmployee[e].id)
                }
                // employeeInTask = employeeInTask.concat(tasksOfSelectedUnit[i].accountableEmployees,
                //     tasksOfSelectedUnit[i].consultedEmployees,
                //     tasksOfSelectedUnit[i].informedEmployees)

                // Loc cac id trung nhau
                let uniqueEmployeeId = Array.from(new Set(employeeInTask));
                // console.log("unique", uniqueEmployeeId);

                for (let k in uniqueEmployeeId) {
                    let idEmployee = uniqueEmployeeId[k];
                    if (!data[unitName][idEmployee]) {
                        data[unitName][idEmployee] = {}
                    }
                    if (!data[unitName][idEmployee][result[j]]) {
                        data[unitName][idEmployee][result[j]] = 0;
                    }
                    // else {
                    data[unitName][idEmployee][result[j]]++;
                    data[unitName][idEmployee].name = idEmployee;
                }
                // data[unitName]


            }
        }


        for (let i in listUnit) {
            let tasksOfUnit = [], dataRow = [];

            // for (let j in tasksOfSelectedUnit) {
            //     if (tasksOfSelectedUnit[j]?.organizationalUnit?._id === listUnit[i]?.id) {
            //         tasksOfUnit.push(tasksOfSelectedUnit[j])
            //     }
            // }

            let unitName = listUnit[i]?.name;
            if (!Object.keys(data).includes(unitName)) {
                dataTable.push({
                    confirmedTask: 0,
                    delayTask: 0,
                    intimeTask: 0,
                    name: unitName,
                    noneUpdateTask: 0,
                    overdueTask: 0,
                    totalTask: 0,
                    organization: true
                });
            }
            else {
                // let add = {
                //     name: unitName,
                //     confirmedTask: 0, delayTask: 0, intimeTask: 0,
                //     noneUpdateTask: 0, overdueTask: 0, totalTask: 0,
                // }
                let unit = data[unitName];
                dataTable.push({
                    confirmedTask: unit.confirmedTask ? unit.confirmedTask : 0,
                    delayTask: unit.delayTask ? unit.delayTask : 0,
                    intimeTask: unit.intimeTask ? unit.intimeTask : 0,
                    name: unitName,
                    noneUpdateTask: unit.noneUpdateTask ? unit.noneUpdateTask : 0,
                    overdueTask: unit.overdueTask ? unit.overdueTask : 0,
                    totalTask: unit.totalTask ? unit.totalTask : 0,
                    organization: true
                });
                for (let key in unit) {
                    if (unit[key].name) {
                        dataTable.push({
                            confirmedTask: unit[key].confirmedTask ? unit[key].confirmedTask : 0,
                            delayTask: unit[key].delayTask ? unit[key].delayTask : 0,
                            intimeTask: unit[key].intimeTask ? unit[key].intimeTask : 0,
                            name: listEmployee[unit[key].name],
                            noneUpdateTask: unit[key].noneUpdateTask ? unit[key].noneUpdateTask : 0,
                            overdueTask: unit[key].overdueTask ? unit[key].overdueTask : 0,
                            totalTask: unit[key].totalTask ? unit[key].totalTask : 0,
                            organization: false
                        });
                    }
                }
            }
            // let dataRowUnit = countTask(tasksOfUnit, unitName);
            // dataTable.push(dataRowUnit);
        }
        console.log("=data cu======================", dataTable);

        // confirmedTask: 10
        // delayTask: 0
        // intimeTask: 0
        // name: "Tổng"
        // noneUpdateTask: 11
        // overdueTask: 11
        // totalTask: 11

        setstate(dataTable);


    }, [props.employees]);

    return (
        <div style={{ height: "300px", overflowY: 'auto' }}>
            <DataTableSetting className="pull-right" tableId='generalTaskUnit' tableContainerId="tree-table-container" tableWidth="1300px"
                columnArr={[
                    translate('task.task_dashboard.unit'),
                    translate('task.task_dashboard.all_tasks'),
                    translate('task.task_dashboard.confirmed_task'),
                    translate('task.task_dashboard.none_update_recently'),
                    translate('task.task_dashboard.intime_task'),
                    translate('task.task_dashboard.delay_task'),
                    translate('task.task_dashboard.overdue_task')]}
            />
            <table id='generalTaskUnit' className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th title={translate('task.task_dashboard.unit')}>{translate('task.task_dashboard.unit')}</th>
                        <th title={translate('task.task_dashboard.all_tasks')}>{translate('task.task_dashboard.all_tasks')}</th>
                        <th title={translate('task.task_dashboard.confirmed_task')}>{translate('task.task_dashboard.confirmed_task')}</th>
                        <th title={translate('task.task_dashboard.none_update_recently')}>{translate('task.task_dashboard.none_update_recently')}</th>
                        <th title={translate('task.task_dashboard.intime_task')}>{translate('task.task_dashboard.intime_task')}</th>
                        <th title={translate('task.task_dashboard.delay_task')}>{translate('task.task_dashboard.delay_task')}</th>
                        <th title={translate('task.task_dashboard.overdue_task')}>{translate('task.task_dashboard.overdue_task')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        state.map((x, index) => (
                            <tr key={index} style={{ fontWeight: x.organization ? 600 : 500 }}>
                                <td>{x.name}</td>
                                <td>{x.totalTask}</td>
                                <td>{x.confirmedTask}</td>
                                <td>{x.noneUpdateTask}</td>
                                <td>{x.intimeTask}</td>
                                <td>{x.delayTask}</td>
                                <td>{x.overdueTask}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    )
}

export default withTranslate(GeneralTaskChart);

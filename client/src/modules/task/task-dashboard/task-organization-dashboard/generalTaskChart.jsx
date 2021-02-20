import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { DataTableSetting } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

const GeneralTaskChart = (props) => {
    const { translate } = props;
    const dataTable = []
    const [state, setstate] = useState([]);

    // Dem so cong viec theo các tiêu chí
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
            name: name ? name : "hello",
            totalTask: tasklist.length,
            confirmedTask,
            noneUpdateTask,
            intimeTask,
            delayTask,
            overdueTask
        }
    }

    useEffect(() => {
        const { tasks, units, unitSelected, employees } = props;
        const allTasks = tasks?.tasks;

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

        for (let i in listUnit) {
            let tasksOfUnit = [], dataRow = [];

            for (let j in tasksOfSelectedUnit) {
                if (tasksOfSelectedUnit[j]?.organizationalUnit?._id === listUnit[i]?.id) {
                    tasksOfUnit.push(tasksOfSelectedUnit[j])
                }
            }

            let unitName = listUnit[i]?.name;
            let dataRowUnit = countTask(tasksOfUnit, unitName);
            dataTable.push(dataRowUnit);
        }

        setstate(dataTable);
    }, [props.employees]);

    return (
        <div style={{ fontWeight: 600 }}>
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
                            <tr key={index}>
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

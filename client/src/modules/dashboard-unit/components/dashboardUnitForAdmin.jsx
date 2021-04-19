import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, SelectMulti, CustomLegendC3js } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';


import c3 from 'c3';
import Swal from 'sweetalert2';
import "./dashboardUnit.css";

import ViewAllTaskUrgent from './viewAllTaskUrgent';
import ViewAllTaskNeedToDo from './viewAllTaskNeedToDo';

function DashboardUnitForAdmin(props) {
    const { translate, department, employeesManager, user, tasks, discipline } = props;

    const [state, setState] = useState({
        month: formatDate(Date.now(), true),
        organizationalUnits: null,

        // Biểu đồ khẩn cấp / cần làm
        currentDate: formatDate(Date.now(), false),
        listUnit: null,
        urgent: null,
        taskNeedToDo: null,
        arrayUnitForUrgentChart: [],
        listUnitSelect: []
    })
    const { listUnit, urgent, taskNeedToDo, 
        organizationalUnits, month, 
        currentDate, arrayUnitForUrgentChart,
        chartTaskNeedToDoData, chartUrgentData,
        clickUrgentChart, clickNeedTodoChart,
        listUnitSelect
    } = state
    
    if (tasks && tasks.organizationUnitTasksChart && props.childOrganizationalUnit
        && (!listUnit || !urgent || !taskNeedToDo)
    ) {
        setState({
            ...state,
            listUnit: props.childOrganizationalUnit,
            urgent: tasks.organizationUnitTasksChart.urgent,
            taskNeedToDo: tasks.organizationUnitTasksChart.taskNeedToDo,
        })
    }

    useEffect(() => {
        props.getAllUnit();
    }, [])

    useEffect(() => {
        setState({
            ...state,
            organizationalUnits: null
        })
    }, [department.list])

    useEffect(() => {
        if (!organizationalUnits && department?.list) {
            let unit = department.list.map(item => item?._id)
            let partMonth = month.split('-');
            let newMonth = [partMonth[1], partMonth[0]].join('-');
    
            /* Lấy danh sách nhân viên  */
            props.getAllEmployee({ organizationalUnits: unit, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });
    
            /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
            props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: unit });
            props.getTaskInOrganizationUnitByMonth(unit, newMonth, newMonth, "in_month");
    
            /** Lấy dữ liệu công việc sắp hết hạn */
            props.getTaskByUser({ organizationUnitId: unit, type: "organizationUnit", })
    
    
            let partDate = currentDate.split('-');
            let newDate = [partDate[2], partDate[1], partDate[0]].join('-');
            props.getTaskInOrganizationUnitByDateNow(unit, newDate)

            setState({
                ...state,
                organizationalUnits: unit,
                listUnitSelect: department.list.map(item => {
                    return { text: item?.name, value: item?._id }
                })
            })
        }
    })

    useEffect(() => {
        pieChartNeedTodo();
        pieChartUrgent();
    })


    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    function formatDate (date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    const removePreviousUrgentPieChart = () => {
        const chart = document.getElementById('pieChartUrgent');
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    const removePreviousNeedToDoPieChart = () => {
        const chart = document.getElementById('pieChartTaskNeedToDo')
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const pieChartUrgent = () => {
        removePreviousUrgentPieChart();
        let chartUrgentDataTmp = convertDataUrgentPieChart(tasks?.organizationUnitTasksChart?.urgent);

        const chartUrgent = c3.generate({
            bindto: document.getElementById('pieChartUrgent'),
            data: { // Dữ liệu biểu đồ
                columns: chartUrgentDataTmp,
                type: 'pie',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickUrgentChart: d,
                    })
                    window.$('#modal-view-all-task-urgent').modal('show');
                }.bind(this)
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: false
            }
        })
    }

    const pieChartNeedTodo = () => {
        removePreviousNeedToDoPieChart();
        let chartTaskNeedToDoDataTmp = convertDataTaskNeedToDoPieChart(tasks?.organizationUnitTasksChart?.taskNeedToDo);

        const chartTaskNeedToDo = c3.generate({
            bindto: document.getElementById('pieChartTaskNeedToDo'),
            data: { // Dữ liệu biểu đồ
                columns: chartTaskNeedToDoDataTmp,
                type: 'pie',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickNeedTodoChart: d,
                    })
                    window.$('#modal-view-all-task-need-to-do').modal('show');
                }.bind(this)
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: false
            }
        })
    }

    const handleSelectOrganizationalUnitUrgent = (value) => {
        setState({
            ...state,
            arrayUnitForUrgentChart: value,
        });
    }

    const convertDataUrgentPieChart = (data) => {
        let urgentPieChartData = [];

        // convert công việc khẩn cấp qua dạng c3js
        if (data && data.length > 0) {
            const result = data.reduce((total, value) => {
                total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                return total;
            }, [])

            for (let key in result) {
                urgentPieChartData = [...urgentPieChartData, [key, result[key]]]
            }
        }
        return urgentPieChartData;
    }

    const convertDataTaskNeedToDoPieChart = (data) => {
        let taskNeedToDoPieChartAxis = ['x'], taskNeedToDoPieChartData = [translate('dashboard_unit.urgent_task_amount')];
        // convert công việc cần làm qua dạng c3js
        if (data && data.length > 0) {
            const result2 = data.reduce((total, value) => {
                if (value?.organizationalUnit?.name) {
                    total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                }

                return total;
            }, [])

            for (let key in result2) {
                taskNeedToDoPieChartAxis.push(key)
                taskNeedToDoPieChartData.push(result2[key])
            }
        }

        return [
            taskNeedToDoPieChartAxis,
            taskNeedToDoPieChartData
        ];
    }

    const handleUpdateDataUrgent = () => {
        const { currentDate, arrayUnitForUrgentChart } = state;

        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        props.getTaskInOrganizationUnitByDateNow(arrayUnitForUrgentChart, newDate);
        setState({
            ...state,
            chartTaskNeedToDoData: null,
            chartUrgentData: null
        })
    }

    
    const handleClickshowTaskUrgent = () => {
        Swal.fire({
            html: `<h3 style="color: red"><div>Công việc được xem là khẩn cấp nếu: ?</div> </h3>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td>> 25 %</td>
                        <td>>= 50 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td>> 20 %</td>
                        <td>>= 40 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td>> 15 % </td>
                        <td>>= 30 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td>> 10 % </td>
                        <td>>= 20 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td>> 5 %</td>
                        <td>>= 10 %</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })
    }

    const handleClickshowTaskNeedToDo = () => {
        Swal.fire({
            html: `<h3 style="color: red"><div>Công việc được xem là cần làm nếu: ?</div> </h3>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td><= 25%</td>
                        <td>40% < x < 50%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td><= 20%</td>
                        <td>30% < x < 40%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td><= 15%</td>
                        <td>20% < x < 30%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td><= 10%</td>
                        <td>10% < x < 20%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td><= 5%</td>
                        <td>0% < x < 10%</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })

    }

    const getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.value === y)
                    data.push(x.text)
            })
        })
        return data;
    }
    
    const showUnitTask = (selectBoxUnit, idsUnit) => {
        const { translate } = props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

        

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        let taskListByStatus = tasks.organizationUnitTasksInMonth ? tasks.organizationUnitTasksInMonth.tasks : null;
        let listEmployee = user.employees;
        let employeeTasks = [];
        for (let i in listEmployee) {
            let tasks = [];
            let accountableTask = [], consultedTask = [], responsibleTask = [], informedTask = [];
            taskListByStatus && taskListByStatus.forEach(task => {
                if (task.accountableEmployees.includes(listEmployee[i].userId._id)) {
                    accountableTask = [...accountableTask, task._id]
                }
                if (task.consultedEmployees.includes(listEmployee[i].userId._id)) {
                    consultedTask = [...consultedTask, task._id]
                }
                if (task.responsibleEmployees.includes(listEmployee[i].userId._id)) {
                    responsibleTask = [...responsibleTask, task._id]
                }
                if (task.informedEmployees.includes(listEmployee[i].userId._id)) {
                    informedTask = [...informedTask, task._id]
                }
            });
            tasks = tasks.concat(accountableTask).concat(consultedTask).concat(responsibleTask).concat(informedTask);
            let totalTask = tasks.filter(function (item, pos) {
                return tasks.indexOf(item) === pos;
            })
            employeeTasks = [...employeeTasks, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalTask: totalTask.length }]
        };
        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);

        };

        return (
            <React.Fragment>
                <div className="qlcv">
                    <ViewAllTaskUrgent data={state.urgent} clickUrgentChart={clickUrgentChart} />
                    <ViewAllTaskNeedToDo data={state.taskNeedToDo} clickNeedTodoChart={clickNeedTodoChart} />
                    
                    {/* Biểu đồ só công việc khẩn cấp /  cần làm */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <div className="box-title" >
                                        {translate('dashboard_unit.urgent_need_to_do_chart')}
                                        {
                                            arrayUnitForUrgentChart && arrayUnitForUrgentChart.length < 2 ?
                                                <>
                                                    <span>{` ${translate('task.task_dashboard.of_unit')}`}</span>
                                                    <span>{` ${getUnitName(listUnitSelect, arrayUnitForUrgentChart).map(o => o).join(", ")}`}</span>
                                                </>
                                                :
                                                <span onClick={() => showUnitTask(listUnitSelect, arrayUnitForUrgentChart)} style={{ cursor: 'pointer' }}>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {arrayUnitForUrgentChart?.length}</a>
                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                </span>
                                        }
                                    </div>
                                </div>

                                <div className="box-body" style={{ marginBottom: 15 }}>
                                    {/* Seach theo thời gian */}
                                    <div className="qlcv">
                                        <div className="form-inline" >
                                            <div className="form-group">
                                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                                <SelectMulti id="multiSelectOrganizationalUnitInpriority"
                                                    items={listUnitSelect}
                                                    options={{
                                                        nonSelectedText: translate('page.non_unit'),
                                                        allSelectedText: translate('page.all_unit'),
                                                    }}
                                                    onChange={handleSelectOrganizationalUnitUrgent}
                                                    value={arrayUnitForUrgentChart}
                                                >
                                                </SelectMulti>
                                            </div>
                                            <button type="button" className="btn btn-success" onClick={handleUpdateDataUrgent}>{translate('general.search')}</button>
                                        </div>
                                    </div>

                                    <div className="row " >
                                        <div className="">
                                            <div className="col-md-6">
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: 0 }}>
                                                    <p className="pull-left" style={{ display: 'flex', alignItems: 'center' }}> <b style={{ marginTop: '10px', marginRight: '5px' }}>{translate('dashboard_unit.urgent_task_amount')}</b>
                                                        <span className="material-icons title-urgent " style={{ zIndex: 999, cursor: "pointer", fontSize: '15px', marginTop: '10px' }}
                                                            onClick={handleClickshowTaskUrgent}>
                                                            help
                                                        </span>
                                                    </p >
                                                    {
                                                        tasks.isLoading ? <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('general.loading')}</p>
                                                            : urgent && urgent.length > 0 
                                                                ? <div id="pieChartUrgent"></div>
                                                                : <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: 0 }}>
                                                    <p className="pull-left" style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <b style={{ marginTop: '10px', marginRight: '5px' }} >{translate('dashboard_unit.need_to_do_task_amount')}</b>
                                                        <span className="material-icons title-urgent " style={{ zIndex: 999, cursor: "pointer", fontSize: '15px', marginTop: '10px' }}
                                                            onClick={handleClickshowTaskNeedToDo}>
                                                            help
                                                        </span>
                                                    </p >
                                                    {
                                                        tasks.isLoading ?
                                                            <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('general.loading')}</p>
                                                            :
                                                            taskNeedToDo && taskNeedToDo.length > 0 
                                                                ? <div id="pieChartTaskNeedToDo"></div>
                                                                : <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
}

function mapState(state) {
    const { department, employeesManager, tasks, user, discipline } = state;
    return { department, employeesManager, tasks, user, discipline };
}

const actionCreators = {
    getAllUnit: DepartmentActions.get,

    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
    getTimesheets: TimesheetsActions.searchTimesheets,

    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByDateNow: taskManagementActions.getTaskByPriorityInOrganizationUnit,
};

const connectedDashboardUnitForAdmin = connect(mapState, actionCreators)(withTranslate(DashboardUnitForAdmin));
export { connectedDashboardUnitForAdmin as DashboardUnitForAdmin };
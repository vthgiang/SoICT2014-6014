import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, LazyLoadComponent } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';
import { customAxisC3js } from '../../../helpers/customAxisC3js';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';
import { AnnualLeaveActions } from '../../human-resource/annual-leave/redux/actions';

import { AnnualLeaveChartAndTable } from '../../human-resource/employee-dashboard/components/combinedContent';
import { LoadTaskOrganizationChart } from '../../task/task-dashboard/task-organization-dashboard/loadTaskOrganizationChart'
import ViewAllTaskUrgent from './viewAllTaskUrgent';
import ViewAllTaskNeedToDo from './viewAllTaskNeedToDo';
import StatisticsKpiUnits from '../../kpi/organizational-unit/dashboard/component/statisticsKpiUnits'

import c3 from 'c3';
import Swal from 'sweetalert2';
import "./dashboardUnit.css";

function DashboardUnitForAdmin(props) {
    const { translate, department, employeesManager, user, tasks } = props;

    const [state, setState] = useState({
        monthTitle: formatDate(Date.now(), true),
        month: formatDate(Date.now(), true, true),
        organizationalUnits: null,
        infoSearch: {
            organizationalUnits: null,
        },
        // Biểu đồ khẩn cấp / cần làm
        currentDate: formatDate(Date.now(), false),
        listUnit: null,
        urgent: null,
        taskNeedToDo: null,
        listUnitSelect: []
    })
    const { listUnit, urgent, taskNeedToDo, 
        organizationalUnits, monthTitle, month,
        currentDate, clickUrgentChart, clickNeedTodoChart,
        listUnitSelect, infoSearch
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
            organizationalUnits: null,
            infoSearch: {
                ...state.infoSearch,
                organizationalUnits: null,
            },
        })
    }, [department.list])

    useEffect(() => {
        if (!infoSearch?.organizationalUnits && department?.list) {
            let unit = department.list.map(item => item?._id)
    
            /* Lấy danh sách nhân viên  */
            props.getAllEmployee({ organizationalUnits: unit, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });
    
            /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
            props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: unit });
            props.getTaskInOrganizationUnitByMonth(unit, month, month, "in_month");
    
            /** Lấy dữ liệu công việc sắp hết hạn */
            props.getTaskByUser({ organizationUnitId: unit, type: "organizationUnit" })
    
            let partDate = currentDate.split('-');
            let newDate = [partDate[2], partDate[1], partDate[0]].join('-');
            props.getTaskInOrganizationUnitByDateNow(unit, newDate)

            setState({
                ...state,
                organizationalUnits: unit,
                infoSearch: {
                    ...state.infoSearch,
                    organizationalUnits: unit,
                },
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
    function formatDate (date, monthYear = false, yearMonth = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (yearMonth) {
                return [year, month].join('-');
            } else if (monthYear === true) {
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
                x: 'x',
                columns: chartUrgentDataTmp,
                type: 'bar',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickUrgentChart: chartUrgentDataTmp?.[0]?.[d?.index + 1]
                    })
                    window.$('#modal-view-all-task-urgent').modal('show');
                }.bind(this)
            },

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('pieChartUrgent', chartUrgentDataTmp?.[0]?.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                }
            },

            bar: {
                width: {
                    ratio: chartUrgentDataTmp?.length < 5 ? 0.3 : 0.7 // this makes bar width 50% of length between ticks
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (chartUrgentDataTmp?.[0]?.length > 1)
                            return chartUrgentDataTmp?.[0]?.[d + 1];
                    }
                }
            }
        })
    }

    const pieChartNeedTodo = () => {
        removePreviousNeedToDoPieChart();
        let chartTaskNeedToDoDataTmp = convertDataTaskNeedToDoPieChart(tasks?.organizationUnitTasksChart?.taskNeedToDo);

        const chartTaskNeedToDo = c3.generate({
            bindto: document.getElementById('pieChartTaskNeedToDo'),
            data: { // Dữ liệu biểu đồ
                x: 'x',
                columns: chartTaskNeedToDoDataTmp,
                type: 'bar',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickNeedTodoChart: chartTaskNeedToDoDataTmp?.[0]?.[d?.index + 1],
                    })
                    window.$('#modal-view-all-task-need-to-do').modal('show');
                }.bind(this)
            },

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('pieChartTaskNeedToDo', chartTaskNeedToDoDataTmp?.[0]?.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },

                y: {
                    tick: {
                        format: function(d) {
                            if (d - parseInt(d) === 0) {
                                return d;
                            } else {
                                return "";
                            }
                        }
                    }
                }
            },

            bar: {
                width: {
                    ratio: chartTaskNeedToDoDataTmp?.length < 5 ? 0.3 : 0.7 // this makes bar width 50% of length between ticks
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (chartTaskNeedToDoDataTmp?.[0]?.length > 1)
                            return chartTaskNeedToDoDataTmp?.[0]?.[d + 1];
                    }
                }
            }
        })
    }

    const handleSelectOrganizationalUnitUrgent = (value) => {
        setState({
            ...state,
            infoSearch: {
                ...state.infoSearch,
                organizationalUnits: value,
            }
        });
    }

    const convertDataUrgentPieChart = (data) => {
        let urgentPieChartDataAxis = ['x'], urgentPieChartDataData = [translate('dashboard_unit.urgent_task_amount')];

        // convert công việc khẩn cấp qua dạng c3js
        if (data && data.length > 0) {
            const result = data.reduce((total, value) => {
                if (value?.organizationalUnit?.name) {
                    total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                }
                return total;
            }, [])

            for (let key in result) {
                urgentPieChartDataAxis.push(key)
                urgentPieChartDataData.push(result[key])
            }
        }
        return [
            urgentPieChartDataAxis,
            urgentPieChartDataData
        ];
    }

    const convertDataTaskNeedToDoPieChart = (data) => {
        let taskNeedToDoPieChartAxis = ['x'], taskNeedToDoPieChartData = [translate('dashboard_unit.need_to_do_task_amount')];
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
        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        setState({
            ...state,
            organizationalUnits: state.infoSearch?.organizationalUnits,
        })
        props.getTaskInOrganizationUnitByDateNow(infoSearch?.organizationalUnits, newDate);
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
        let listEmployee = user?.employees;
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
                <div className="qlcv" style={{ marginBottom: "10px" }}>
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInpriority"
                                items={listUnitSelect}
                                options={{
                                    nonSelectedText: translate('page.non_unit'),
                                    allSelectedText: translate('page.all_unit'),
                                }}
                                onChange={handleSelectOrganizationalUnitUrgent}
                                value={infoSearch?.organizationalUnits}
                            >
                            </SelectMulti>
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleUpdateDataUrgent}>{translate('general.search')}</button>
                    </div>
                </div>

                <div className="qlcv">
                    <ViewAllTaskUrgent data={tasks?.organizationUnitTasksChart?.urgent} clickUrgentChart={clickUrgentChart} />
                    <ViewAllTaskNeedToDo data={tasks?.organizationUnitTasksChart?.taskNeedToDo} clickNeedTodoChart={clickNeedTodoChart} />
                    
                    {/* Biểu đồ só công việc khẩn cấp /  cần làm */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <div className="box-title" >
                                        {translate('dashboard_unit.urgent_chart')}
                                        {
                                            organizationalUnits && organizationalUnits.length < 2 ?
                                                <>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <span>{` ${getUnitName(listUnitSelect, organizationalUnits).map(o => o).join(", ")}`}</span>
                                                </>
                                                :
                                                <span onClick={() => showUnitTask(listUnitSelect, organizationalUnits)} style={{ cursor: 'pointer' }}>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnits?.length}</a>
                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                </span>
                                        }
                                    </div>
                                </div>

                                <div className="box-body" style={{ marginBottom: 15 }}>
                                    <div className="row " >
                                        <div className="">
                                            <div className="col-md-12">
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: 0 }}>
                                                    <p className="pull-left" style={{ display: 'flex', alignItems: 'center' }}> <b style={{ marginTop: '10px', marginRight: '5px' }}>{translate('dashboard_unit.urgent_task_amount')}</b>
                                                        <span className="material-icons title-urgent " style={{ zIndex: 999, cursor: "pointer", fontSize: '15px', marginTop: '10px' }}
                                                            onClick={handleClickshowTaskUrgent}>
                                                            help
                                                        </span>
                                                    </p >
                                                    {
                                                        tasks.isLoading ? <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('general.loading')}</p>
                                                            : tasks?.organizationUnitTasksChart?.urgent?.length > 0 
                                                                ? <div id="pieChartUrgent"></div>
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

                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <div className="box-title" >
                                        {translate('dashboard_unit.need_to_do_chart')}
                                        {
                                            organizationalUnits && organizationalUnits.length < 2 ?
                                                <>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <span>{` ${getUnitName(listUnitSelect, organizationalUnits).map(o => o).join(", ")}`}</span>
                                                </>
                                                :
                                                <span onClick={() => showUnitTask(listUnitSelect, organizationalUnits)} style={{ cursor: 'pointer' }}>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnits?.length}</a>
                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                </span>
                                        }
                                    </div>
                                </div>

                                <div className="box-body" style={{ marginBottom: 15 }}>
                                    <div className="row " >
                                        <div className="col-md-12">
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
                                                        tasks?.organizationUnitTasksChart?.taskNeedToDo?.length > 0 
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

                    <LazyLoadComponent>
                        <AnnualLeaveChartAndTable
                            defaultUnit={true} 
                            organizationalUnits={organizationalUnits}
                            childOrganizationalUnit={listUnitSelect?.map(item => {
                                return {
                                    id: item?.value,
                                    name: item?.text
                                }
                            })}
                        />
                    </LazyLoadComponent>

                    {/*Dashboard tải công việc */}
                    <div className="row">
                        <div className="col-xs-12">
                            <LazyLoadComponent once={true}>
                                <LoadTaskOrganizationChart
                                    getUnitName={getUnitName}
                                    showUnitTask={showUnitTask}
                                    tasks={tasks?.organizationUnitTasks}
                                    listEmployee={user && user.employees}
                                    units={listUnitSelect.map(item => { return { id: item?.value, name: item?.text } })}
                                    startMonth={month}
                                    endMonth={month}
                                    startMonthTitle={monthTitle}
                                    idsUnit={organizationalUnits}
                                    employeeLoading={user?.employeeLoading}
                                    typeChart={"followUnit"}
                                />
                            </LazyLoadComponent>
                        </div>
                    </div>

                    {/* Thống kê KPI */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ thống kê điểm KPI {monthTitle} giữa các đơn vị </div>
                                </div>
                                <div className="box-body">
                                    {
                                        organizationalUnits &&
                                        <StatisticsKpiUnits organizationalUnitIds={organizationalUnits} monthStatistics={month} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
}

function mapState(state) {
    const { department, employeesManager, tasks, user } = state;
    return { department, employeesManager, tasks, user };
}

const actionCreators = {
    getAllUnit: DepartmentActions.get,

    getAllEmployee: EmployeeManagerActions.getAllEmployee,

    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,

    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getTaskInOrganizationUnitByDateNow: taskManagementActions.getTaskByPriorityInOrganizationUnit,
};

const connectedDashboardUnitForAdmin = connect(mapState, actionCreators)(withTranslate(DashboardUnitForAdmin));
export { connectedDashboardUnitForAdmin as DashboardUnitForAdmin };
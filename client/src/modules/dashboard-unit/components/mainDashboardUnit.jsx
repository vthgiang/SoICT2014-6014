import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TabEmployeeCapacity, TabIntegratedStatistics, TabTask } from './combinedContent';
import { TabHumanResource, TabSalary, TabAnualLeave } from '../../human-resource/employee-dashboard/components/combinedContent';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible, CustomLegendC3js } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

import c3 from 'c3';
import Swal from 'sweetalert2';
import "./dashboardUnit.css";

import ViewAllTaskUrgent from './viewAllTaskUrgent';
import ViewAllTaskNeedToDo from './viewAllTaskNeedToDo';
import { CurrentTaskTimesheetLogInOrganizationalUnit } from './currentTaskTimesheetLogInOrganizationalUnit';
class MainDashboardUnit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            month: this.formatDate(Date.now(), true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            arrayUnitShow: [this.props.childOrganizationalUnit[0].id],

            // Biểu đồ khẩn cấp / cần làm
            currentDate: this.formatDate(Date.now(), false),
            listUnit: [],
            urgent: [],
            taskNeedToDo: [],
            arrayUnitForUrgentChart: [this.props.childOrganizationalUnit[0].id],
        }
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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

    /**
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
    };

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {
        const { department, childOrganizationalUnit } = this.props;
        let { month, arrayUnitShow } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.setState({
            organizationalUnits: arrayUnitShow,
            monthShow: month
        });

        let arrayUnit = arrayUnitShow;
        if (arrayUnitShow.length === department.list.length) {
            arrayUnitShow = department.list.map(x => x._id);
            arrayUnit = undefined;
        } else if (arrayUnitShow.length === 0) {
            arrayUnitShow = childOrganizationalUnit.map(x => x.id);
            arrayUnit = childOrganizationalUnit.map(x => x.id);
        }



        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: arrayUnit, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'], page: 0, limit: 10000, birthdate: newMonth, organizationalUnits: arrayUnitShow });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: arrayUnitShow });
        this.props.getTaskInOrganizationUnitByMonth(arrayUnitShow, newMonth, newMonth, "in_month");

        /** Lấy dữ liệu công việc sắp hết hạn */
        this.props.getTaskByUser({ organizationUnitId: arrayUnitShow, type: "organizationUnit", })

        // this.props.searchAnnualLeaves({ organizationalUnits: arrayUnitShow, month: newMonth });
        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: arrayUnitShow, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: arrayUnitShow, month: newMonth, page: 0,
            limit: 100000,
        });

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    removePreviousUrgentPieChart() {
        const chart = this.refs.pieChartUrgent;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    removePreviousNeedToDoPieChart() {
        const chart = this.refs.pieChartTaskNeedToDo;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    pieChartUrgent = (data) => {
        this.removePreviousUrgentPieChart();
        this.chartUrgent = c3.generate({
            bindto: this.refs.pieChartUrgent,
            data: { // Dữ liệu biểu đồ
                columns: data,
                type: 'pie',
                labels: true,
                onclick: function (d, e) {
                    this.setState({
                        ...this.state,
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

    pieChartNeedTodo = (data) => {
        this.removePreviousNeedToDoPieChart();
        this.chartTaskNeedToDo = c3.generate({
            bindto: this.refs.pieChartTaskNeedToDo,
            data: { // Dữ liệu biểu đồ
                columns: data,
                type: 'pie',
                labels: true,
                onclick: function (d, e) {
                    this.setState({
                        ...this.state,
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

    handleSelectOrganizationalUnitUrgent = (value) => {
        this.setState({
            arrayUnitForUrgentChart: value,
        });
    }

    convertDataUrgentPieChart = (data) => {
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

    convertDataTaskNeedToDoPieChart = (data) => {
        let taskNeedToDoPieChart = [];
        // convert công việc cần làm qua dạng c3js
        if (data && data.length > 0) {
            const result2 = data.reduce((total, value) => {
                if (value?.organizationalUnit?.name) {
                    total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                }

                return total;
            }, [])

            for (let key in result2) {
                taskNeedToDoPieChart = [...taskNeedToDoPieChart, [key, result2[key]]]
            }
        }

        return taskNeedToDoPieChart;
    }

    handleUpdateDataUrgent = () => {
        const { currentDate, arrayUnitForUrgentChart } = this.state;

        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        this.props.getTaskInOrganizationUnitByDateNow(arrayUnitForUrgentChart, newDate);
        this.setState(state => {
            return {
                ...state,
                chartTaskNeedToDoData: null,
                chartUrgentData: null
            }
        })
    }

    static getDerivedStateFromProps(props, state) {
        const { tasks } = props;

        if (tasks && tasks.organizationUnitTasksChart && props.childOrganizationalUnit) {
            return {
                ...state,
                listUnit: props.childOrganizationalUnit,
                urgent: tasks.organizationUnitTasksChart.urgent,
                taskNeedToDo: tasks.organizationUnitTasksChart.taskNeedToDo,
            }
        } else {
            return null;
        }
    }

    componentDidUpdate() {
        if (this.state.chartTaskNeedToDoData || this.state.chartUrgentData) {
            this.pieChartNeedTodo(this.state.chartTaskNeedToDoData);
            this.pieChartUrgent(this.state.chartUrgentData);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { tasks } = this.props;
        const { chartTaskNeedToDoData, chartUrgentData } = this.state;

        if (!chartTaskNeedToDoData && tasks?.organizationUnitTasksChart?.taskNeedToDo) {
            let chartTaskNeedToDoDataTmp = this.convertDataTaskNeedToDoPieChart(tasks?.organizationUnitTasksChart?.taskNeedToDo);
            this.setState(state => {
                return {
                    ...state,
                    chartTaskNeedToDoData: chartTaskNeedToDoDataTmp
                }
            })
        }
        if (!chartUrgentData && tasks?.organizationUnitTasksChart?.urgent) {
            let chartUrgentDataTmp = this.convertDataUrgentPieChart(tasks?.organizationUnitTasksChart?.urgent);
            this.setState(state => {
                return {
                    ...state,
                    chartUrgentData: chartUrgentDataTmp
                }
            })
        }

        return true
    }

    componentDidMount() {
        const { organizationalUnits, month, currentDate, arrayUnitForUrgentChart } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'], page: 0, limit: 10000, birthdate: newMonth, organizationalUnits: organizationalUnits });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: organizationalUnits });
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, newMonth, newMonth, "in_month");

        /** Lấy dữ liệu công việc sắp hết hạn */
        this.props.getTaskByUser({ organizationUnitId: organizationalUnits, type: "organizationUnit", })

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: organizationalUnits, month: newMonth, page: 0,
            limit: 100000,
        });


        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');
        this.props.getTaskInOrganizationUnitByDateNow(arrayUnitForUrgentChart, newDate)
    }

    handleClickshowTaskUrgent = () => {
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

    handleClickshowTaskNeedToDo = () => {
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

    getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.value === y)
                    data.push(x.text)
            })
        })
        return data;
    }
    
    showUnitTask = (selectBoxUnit, idsUnit) => {
        const { translate } = this.props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = this.getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    render() {
        const { translate, department, employeesManager, user, tasks, discipline } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { monthShow, month, organizationalUnits, arrayUnitShow, listUnit, 
            taskNeedToDo, urgent, arrayUnitForUrgentChart, TaskUrgentIsHovering, 
            TaskNeedToDoIsHovering, clickUrgentChart, clickNeedTodoChart,
            chartUrgentData, chartTaskNeedToDoData
        } = this.state;

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        // Item select box chọn đơn vị
        let listUnitSelect = listUnit.map(item => ({ value: item.id, text: item.name }));

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
                    <ViewAllTaskUrgent data={this.state.urgent} clickUrgentChart={clickUrgentChart} />
                    <ViewAllTaskNeedToDo data={this.state.taskNeedToDo} clickNeedTodoChart={clickNeedTodoChart} />
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
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <span>{` ${this.getUnitName(listUnitSelect, arrayUnitForUrgentChart).map(o => o).join(", ")}`}</span>
                                                </>
                                                :
                                                <span onClick={() => this.showUnitTask(listUnitSelect, arrayUnitForUrgentChart)} style={{ cursor: 'pointer' }}>
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
                                                    onChange={this.handleSelectOrganizationalUnitUrgent}
                                                    value={arrayUnitForUrgentChart}
                                                >
                                                </SelectMulti>
                                            </div>
                                            <button type="button" className="btn btn-success" onClick={this.handleUpdateDataUrgent}>{translate('general.search')}</button>
                                        </div>
                                    </div>

                                    <div className="row " >
                                        <div className="">
                                            <div className="col-md-6">
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: 0 }}>
                                                    <p className="pull-left" style={{ display: 'flex', alignItems: 'center' }}> <b style={{ marginTop: '10px', marginRight: '5px' }}>{translate('dashboard_unit.urgent_task_amount')}</b>
                                                        <span className="material-icons title-urgent " style={{ zIndex: 999, cursor: "pointer", fontSize: '15px', marginTop: '10px' }}
                                                            onClick={this.handleClickshowTaskUrgent}>
                                                            help
                                                        </span>
                                                    </p >
                                                    {
                                                        tasks.isLoading ? <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('general.loading')}</p>
                                                            : urgent && urgent.length > 0 ?
                                                                <section id={"pieChartUrgent"} className="c3-chart-container">
                                                                    <div ref="pieChartUrgent"></div>
                                                                    <CustomLegendC3js
                                                                        chart={this.chartUrgent}
                                                                        chartId={"pieChartUrgent"}
                                                                        legendId={"pieChartUrgentLegend"}
                                                                        title={chartUrgentData && `${translate('general.list_unit')} (${chartUrgentData.length})`}
                                                                        dataChartLegend={chartUrgentData && chartUrgentData.map(item => item[0])}
                                                                    />
                                                                </section>
                                                                : <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: 0 }}>
                                                    <p className="pull-left" style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <b style={{ marginTop: '10px', marginRight: '5px' }} >{translate('dashboard_unit.need_to_do_task_amount')}</b>
                                                        <span className="material-icons title-urgent " style={{ zIndex: 999, cursor: "pointer", fontSize: '15px', marginTop: '10px' }}
                                                            onClick={this.handleClickshowTaskNeedToDo}>
                                                            help
                                                        </span>
                                                    </p >
                                                    {
                                                        tasks.isLoading ?
                                                            <p style={{ marginTop: '60px', textAlign: "center" }}>{translate('general.loading')}</p>
                                                            :
                                                            taskNeedToDo && taskNeedToDo.length > 0 ?
                                                                <section id={"pieChartTaskNeedToDo"} className="c3-chart-container">
                                                                    <div ref="pieChartTaskNeedToDo"></div>
                                                                    <CustomLegendC3js
                                                                        chart={this.chartTaskNeedToDo}
                                                                        chartId={"pieChartTaskNeedToDo"}
                                                                        legendId={"pieChartTaskNeedToDoLegend"}
                                                                        title={chartTaskNeedToDoData && `${translate('general.list_unit')} (${chartTaskNeedToDoData.length})`}
                                                                        dataChartLegend={chartTaskNeedToDoData && chartTaskNeedToDoData.map(item => item[0])}
                                                                    />
                                                                </section>
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

                    {/* Danh sách nhân viên đang bấm giờ */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-solid">
                                <CurrentTaskTimesheetLogInOrganizationalUnit
                                    listUnitSelect={listUnitSelect}
                                    getUnitName={this.getUnitName}
                                    showUnitTask={this.showUnitTask}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{
                                    nonSelectedText: translate('page.non_unit'),
                                    allSelectedText: translate('page.all_unit'),
                                }}
                                onChange={this.handleSelectOrganizationalUnit}
                                value={arrayUnitShow}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                            <DatePicker
                                id="monthInDashboardUnit"
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleSelectMonth}
                                deleteValue={false}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                    </div>

                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#task" data-toggle="tab" onClick={() => this.handleNavTabs()}>Công việc</a></li>
                            <li><a href="#employee-capacity" data-toggle="tab" onClick={() => this.handleNavTabs()}>Năng lực nhân viên</a></li>
                            <li><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                            <li><a href="#integrated-statistics" data-toggle="tab">Thống kê tổng hợp</a></li>
                        </ul>
                        <div className="tab-content ">
                            <div className="tab-pane active" id="task">
                                <TabTask childOrganizationalUnit={childOrganizationalUnit} />
                            </div>
                            {/* Tab năng lực nhân viên*/}
                            <div className="tab-pane" id="employee-capacity">
                                <LazyLoadComponent>
                                    <TabEmployeeCapacity organizationalUnits={organizationalUnits} month={monthShow} allOrganizationalUnits={childOrganizationalUnit.map(x => x.id)} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane" id="human-resourse">
                                <div className="row qlcv" style={{ marginTop: '10px' }}>
                                    <div className="col-md-3 col-sm-6 col-xs-6">
                                        <div className="info-box with-border">
                                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Số nhân viên</span>
                                                <span className="info-box-number">
                                                    {listAllEmployees.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                        <div className="info-box with-border">
                                            <span className="info-box-icon bg-yellow"><i className="fa fa-tasks"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Số sinh nhật</span>
                                                <span className="info-box-number">
                                                    {employeesManager.listEmployees ? employeesManager.listEmployees.length : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                        <div className="info-box with-border">
                                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Số khen thưởng</span>
                                                <span className="info-box-number">
                                                    {discipline.totalListCommendation ? discipline.totalListCommendation.length : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                        <div className="info-box with-border">
                                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Số kỷ luật</span>
                                                <span className="info-box-number">
                                                    {discipline.totalListDiscipline ? discipline.totalListDiscipline.length : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <TabHumanResource childOrganizationalUnit={childOrganizationalUnit} defaultUnit={true} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <TabAnualLeave childOrganizationalUnit={childOrganizationalUnit} defaultUnit={true} />
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <TabSalary childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab thống kê tổng hợp*/}
                            <div className="tab-pane" id="integrated-statistics">
                                <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} employeeTasks={employeeTasks} listEmployee={listEmployee} organizationalUnits={organizationalUnits}/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, employeesManager, tasks, user, discipline } = state;
    return { department, employeesManager, tasks, user, discipline };
}

const actionCreators = {
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

const mainDashboardUnit = connect(mapState, actionCreators)(withTranslate(MainDashboardUnit));
export { mainDashboardUnit as MainDashboardUnit };
/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskManagementActions } from '../../task/task-management/redux/actions';

import { DatePicker, CustomLegendC3js } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs'
import { compactString } from '../../../helpers/stringMethod';

class TaskOrganizationalUnitsChart extends Component {
    constructor(props) {
        super(props);
        const { childOrganizationalUnit, month } = this.props
        const startDate = ['01', new Date().getFullYear()].join('-');
        this.infoSearch = {
            startDate: startDate,
            endDate: this.formatDate(Date.now(), true)
        }
        this.chart = React.createRef();

        this.state = {
            singleUnit: childOrganizationalUnit?.length < 2 ? true : false,
            month: month,
            startDate: this.infoSearch.startDate,
            startDateShow: startDate,
            endDate: this.infoSearch.endDate,
            endDateShow: this.formatDate(Date.now(), true),
            totalTask: true,
            barChart: true,
            advancedMode: false,
            searchAdvanceMode: false,
        }
    }

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
    }

    /**
     * Function format dữ liệu String tháng năm thành năm ngày
     * @param {*} date: String mốn format
     */
    formatString(String) {
        let part = String.split('-');
        return [part[1], part[0]].join('-');
    }


    componentDidMount() {
        const { childOrganizationalUnit } = this.props;
        const { startDate, endDate, singleUnit, month } = this.state;
        let childOrganizationalUnitId = childOrganizationalUnit.map(x => x.id);

        if (singleUnit) {
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
        } else {
            // nhiều đơn vị thì truy vấn trong 1 tháng
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, month, month);
        }
    }

    isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { startDate, endDate } = this.state;

        if (nextProps.tasks?.organizationUnitTasks && !this.isEqual(nextProps.tasks?.organizationUnitTasks?.tasks, this.state.taskOfUnists) &&
            nextProps.user?.employeesOfUnitsUserIsManager?.length !== 0) {
            this.setState({
                taskOfUnists: nextProps.tasks?.organizationUnitTasks?.tasks
            })
            return true;
        };
        if (nextState.startDateShow !== this.state.startDateShow || nextState.endDateShow !== this.state.endDateShow) {
            return true;
        }

        if (JSON.stringify(nextProps.childOrganizationalUnit) !== JSON.stringify(this.props.childOrganizationalUnit) || nextProps.month !== this.props.month) {
            let childOrganizationalUnitId = nextProps.childOrganizationalUnit.map(x => x.id);
            let singleUnit = nextProps.childOrganizationalUnit?.length <= 1

            this.setState(state => {
                return {
                    ...state,
                    singleUnit: singleUnit,
                }
            })

            // Nếu số đơn vị >1, chỉ truy vấn dữ lieuẹ trong 1 tháng (dùng cho biểu đồ)
            if (singleUnit) {
                this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
            } else {
                this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, nextProps.month, nextProps.month);
            }
            return true
        }

        return true;
    }

    componentDidUpdate = (prevProps, prevState) => {
        // Khi bấm chọn advance(nang cao) thì chỉ hiện box search, ko render lại chart. (khi bấm nâng cao thì prevState.advancedMode = false . this.state.advancedMode = true )
        if (prevState.advancedMode === this.state.advancedMode)
            this.renderChart()
    }

    setDataLineChart = () => {
        const { tasks, user } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { startDate, endDate, totalTask } = this.state;

        const period = dayjs(this.formatString(endDate)).diff(this.formatString(startDate), 'month');

        let arrMonth = [];
        for (let i = 0; i <= period; i++) {
            arrMonth = [
                ...arrMonth,
                dayjs(this.formatString(startDate)).add(i, 'month').format("YYYY-MM-DD"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];
        }

        let listTask = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : [];
        let employeeOfUnits = {};
        if (!totalTask) {
            childOrganizationalUnit && childOrganizationalUnit.forEach(unit => {
                let roleInUnit = unit.managers.concat(unit.deputyManagers).concat(unit.employees);
                employeeOfUnits[unit.id] = user?.employees?.filter(e => {
                    if (e?.roleId?.length > 0) {
                        let check = false
                        e.roleId.map(item => {
                            if (roleInUnit.includes(item?._id)) {
                                check = true
                            }
                        })

                        return check
                    }

                    return false
                })
            })
        }

        let data = [["x", ...arrMonth]];
        childOrganizationalUnit && childOrganizationalUnit.forEach((x, index) => {
            let taskOfUnist = [];
            if (listTask.length !== 0) {
                taskOfUnist = listTask.filter(t => t.organizationalUnit?._id === x.id);
            }
            let row = [...arrMonth];
            row = row.map(r => {
                let taskOfUnistInMonth = taskOfUnist.filter(t => {
                    let date = new Date(r)
                    let endMonth = new Date(date.setMonth(date.getMonth() + 1))
                    let endDate = new Date(endMonth.setDate(endMonth.getDate() - 1))
                    if (new Date(r).getTime() <= new Date(t.startDate).getTime() && new Date(t.startDate).getTime() <= new Date(endDate) ||
                        new Date(r).getTime() <= new Date(t.endDate).getTime() && new Date(t.endDate).getTime() <= new Date(endDate) ||
                        new Date(t.startDate).getTime() >= new Date(r).getTime() && new Date(endDate).getTime() >= new Date(t.endDate).getTime()) {
                        return true;
                    }
                    return false;
                });
                if (!totalTask) {
                    return (taskOfUnistInMonth.length / employeeOfUnits?.[x?.id]?.length).toFixed(1);
                }
                return taskOfUnistInMonth.length;
            })
            data = [...data, [x.name, ...row]]
        })
        return data
    }

    setSingleDataChart = () => {
        const { tasks, user } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { startDate, endDate } = this.state;

        const period = dayjs(this.formatString(endDate)).diff(this.formatString(startDate), 'month');

        let arrMonth = [];
        for (let i = 0; i <= period; i++) {
            arrMonth = [
                ...arrMonth,
                dayjs(this.formatString(startDate)).add(i, 'month').format("YYYY-MM-DD"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];
        }


        let listTask = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : [];
        let employees = user.employees;
        let employeeOfUnits = {};
        childOrganizationalUnit && childOrganizationalUnit.forEach(unit => {
            let roleInUnit = unit.managers.concat(unit.deputyManagers).concat(unit.employees)
            employeeOfUnits[unit.id] = employees?.filter(e => {
                if (e?.roleId?.length > 0) {
                    let check = false
                    e.roleId.map(item => {
                        if (roleInUnit.includes(item?._id)) {
                            check = true
                        }
                    })

                    return check
                }

                return false
            })
        })

        let title = ["x", ...arrMonth];
        let totalTask = ["Số công việc"], taskPerEmployeeOfUnit = ["Công việc trên đầu người"];

        childOrganizationalUnit && childOrganizationalUnit.forEach((x, index) => {
            let taskOfUnist = [];
            if (listTask.length !== 0) {
                taskOfUnist = listTask.filter(t => t.organizationalUnit?._id === x.id);
            }
            let row = [...arrMonth];
            row = row.map(r => {
                let taskOfUnistInMonth = taskOfUnist.filter(t => {
                    let date = new Date(r)
                    let endMonth = new Date(date.setMonth(date.getMonth() + 1))
                    let endDate = new Date(endMonth.setDate(endMonth.getDate() - 1))
                    if (new Date(r).getTime() <= new Date(t.startDate).getTime() && new Date(t.startDate).getTime() <= new Date(endDate) ||
                        new Date(r).getTime() <= new Date(t.endDate).getTime() && new Date(t.endDate).getTime() <= new Date(endDate) ||
                        new Date(t.startDate).getTime() >= new Date(r).getTime() && new Date(endDate).getTime() >= new Date(t.endDate).getTime()) {
                        return true;
                    }
                    return false;
                });

                let taskPerEmployee = taskOfUnistInMonth?.length / employeeOfUnits?.[x?.id]?.length

                taskPerEmployeeOfUnit.push(taskPerEmployee && !isNaN(taskPerEmployee) ? taskPerEmployee.toFixed(1) : 0);
                totalTask.push(taskOfUnistInMonth.length);
            })
        })

        return [
            title,
            totalTask,
            taskPerEmployeeOfUnit
        ]
    }

    setMultiDataChart = () => {
        const { tasks, user } = this.props;
        let { childOrganizationalUnit } = this.props;

        let listTask = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : [];
        let employees = user.employees;
        let employeeOfUnits = {};


        childOrganizationalUnit && childOrganizationalUnit.forEach(unit => {
            let roleInUnit = unit.managers.concat(unit.deputyManagers).concat(unit.employees)
            employeeOfUnits[unit.id] = employees?.filter(e => {
                if (e?.roleId?.length > 0) {
                    let check = false
                    e.roleId.map(item => {
                        if (roleInUnit.includes(item?._id)) {
                            check = true
                        }
                    })

                    return check
                }

                return false
            })
        })

        let title = [];
        let shortTitle = ["x"];
        let totalTask = ["Số công việc"], taskPerEmployeeOfUnit = ["Công việc trên đầu người"];


        childOrganizationalUnit && childOrganizationalUnit.forEach((unit, index) => {
            let taskOfUnist = [];
            if (listTask.length !== 0) {
                taskOfUnist = listTask.filter(t => t.organizationalUnit?._id === unit.id);
            }
            let taskPerEmployee = taskOfUnist?.length / employeeOfUnits?.[unit?.id]?.length

            title.push(unit?.name)
            shortTitle.push(compactString(unit?.name, 10))
            totalTask.push(taskOfUnist?.length)
            taskPerEmployeeOfUnit.push(taskPerEmployee && !isNaN(taskPerEmployee) ? taskPerEmployee.toFixed(1) : 0)
        })

        return {
            data: [
                shortTitle,
                totalTask,
                taskPerEmployeeOfUnit
            ],
            title
        }
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.taskUnitsChart;
        if (chart) {
            while (chart && chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu biểu đồ
     */
    renderChart = () => {
        const { singleUnit, barChart, advancedMode, searchAdvanceMode } = this.state

        this.removePreviousChart();
        let dataChart, title;

        if (singleUnit) { // chế độ 1 unit
            if (barChart || !barChart)
                dataChart = this.setSingleDataChart();
        } else {
            // dạng nhiều đơn vị và không ở chế độ nâng cao
            if (!advancedMode || (advancedMode && !searchAdvanceMode)) {
                if (barChart || !barChart) {
                    const data = this.setMultiDataChart()
                    title = data.title;
                    dataChart = data.data;
                }
            }
            // dạng nhiều đơn vị và ở chế độ nâng cao/ bấm tìm kiếm mới thay đổi chart
            if (advancedMode && searchAdvanceMode) {
                // linechart
                dataChart = this.setDataLineChart();
            }
        }
        this.chart.current = c3.generate({
            bindto: this.refs.taskUnitsChart,
            data: {
                x: 'x',
                columns: dataChart,
                type: singleUnit ? (barChart ? 'bar' : 'line') : (!advancedMode ? barChart ? 'bar' : 'line' : 'line'),
                labels: true,
            },
            bar: {
                width: {
                    ratio: 0.3
                }
            },
            axis: {
                x: {
                    type: singleUnit ? 'timeseries' : ((advancedMode && searchAdvanceMode) ? 'timeseries' : 'categories'),
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        multiline: false
                    },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            },
            zoom: {
                enabled: true
            },
            tooltip: {
                format: !singleUnit && !advancedMode && {
                    title: function (d, index) { return title[index]; }
                }
            },
            legend: {
                show: (!singleUnit && advancedMode && searchAdvanceMode) ? false : true
            }
        });
    };

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    handleStartMonthChange = (value) => {
        this.infoSearch = {
            ...this.infoSearch,
            startDate: value
        }
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    handleEndMonthChange = (value) => {
        this.infoSearch = {
            ...this.infoSearch,
            endDate: value
        }
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i].startingDate !== items2[i].startingDate) {
                return false;
            }
        }
        return true;
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { startDate, endDate } = this.infoSearch;
        const { searchAdvanceMode, advancedMode } = this.state;


        let startDateCheck = new Date(this.formatString(startDate));
        let endDateCheck = new Date(this.formatString(endDate));
        const { translate } = this.props;
        if (startDateCheck && endDateCheck && startDateCheck.getTime() >= endDateCheck.getTime()) {
            Swal.fire({
                title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
            })
        } else {
            let { childOrganizationalUnit } = this.props;
            let childOrganizationalUnitId = childOrganizationalUnit.map(x => x.id);

            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
            if (advancedMode && !searchAdvanceMode) {
                this.setState({
                    startDateShow: startDate,
                    endDateShow: endDate,
                    startDate: startDate,
                    endDate: endDate,
                    taskOfUnists: [],
                    searchAdvanceMode: true,
                })
            } else {
                this.setState({
                    startDateShow: startDate,
                    endDateShow: endDate,
                    startDate: startDate,
                    endDate: endDate,
                    taskOfUnists: [],
                })
            }

        }
    }

    // ở advance = true sau khi bấm tìm kiếm thì mới hiện chọn tổng số cv/cv trên đầu ng, title chỉnh lại. bấm search mới thay đổi
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            totalTask: value
        })
    }

    handleChangeTypeChart = (value) => {
        this.setState({
            ...this.state,
            barChart: value
        })
    }

    handleToggleAdvanceMode = () => {
        const { advancedMode, startDate, endDate, searchAdvanceMode } = this.state;
        const { childOrganizationalUnit, month } = this.props;
        if (!advancedMode) {
            this.setState({
                ...this.state,
                advancedMode: !advancedMode,
                startDate: this.formatString(month),
                endDate: this.formatString(month),
            })
        } else {
            if (searchAdvanceMode) {
                // tắt advance mode thì quay về mặc định chế dộ multi unit. nếu đã bấm search ở chế dộ multi thì truy vấn dữ liệu cũ
                let childOrganizationalUnitId = childOrganizationalUnit.map(x => x.id);
                this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, month, month);

                this.setState({
                    ...this.state,
                    advancedMode: !advancedMode,
                    searchAdvanceMode: false,
                })
            } else {
                // nếu chưa bấm tìm kiếm truy vấn ở chế độ advancedMode thì chỉ cần ẩn hiện box search
                this.setState({
                    ...this.state,
                    advancedMode: !advancedMode,
                })
            }
        }

    }


    render() {
        const { translate, tasks } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { startDate, endDate, singleUnit, totalTask, barChart, advancedMode, searchAdvanceMode } = this.state;

        return (
            <div className="box box-solid" >
                <div className="box-header with-border" >
                    <div className="box-title" >
                        Tình hình làm việc
                        {
                            singleUnit ?
                                <>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <span style={{ fontWeight: 'bold' }}>{` ${childOrganizationalUnit?.[0]?.name ? childOrganizationalUnit?.[0]?.name : ""}`}</span>
                                    <span>{` từ ${startDate} đến ${endDate}`}</span>
                                </>
                                :
                                (advancedMode && searchAdvanceMode) ?
                                    <span onClick={() => showListInSwal(childOrganizationalUnit.map(item => item?.name), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {childOrganizationalUnit?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                        <span>{` từ ${startDate} đến ${endDate}`}</span>
                                    </span>
                                    :
                                    <span onClick={() => showListInSwal(childOrganizationalUnit.map(item => item?.name), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {childOrganizationalUnit?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                        <span>{` tháng ${this.formatString(this.state?.month)}`}</span>
                                    </span>
                        }
                    </div>
                    {
                        !singleUnit &&
                        <a title={advancedMode ? "Tắt chế độ nâng cao" : "Bật chế độ nâng cao"}><i className="fa fa-gear" onClick={this.handleToggleAdvanceMode} style={{ fontSize: 19, float: 'right', cursor: 'pointer' }}></i></a>
                    }
                </div>
                <div className="box-body" >
                    {
                        !advancedMode &&
                        <div className="box-tools pull-right" >
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${barChart ? "btn-danger" : "active"}`} onClick={() => this.handleChangeTypeChart(true)}>Bar Chart</button>
                                <button type="button" className={`btn btn-xs ${barChart ? 'active' : "btn-danger"}`} onClick={() => this.handleChangeTypeChart(false)}>Line Chart</button>
                            </div>
                        </div>
                    }
                    {(singleUnit || advancedMode)
                        && <div id="box-search" className="qlcv" style={{ marginBottom: 15 }} >
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label className="form-control-static" >Từ tháng</label>
                                    <DatePicker
                                        id="form-month-task"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={startDate}
                                        onChange={this.handleStartMonthChange}
                                    />
                                </div>
                            </div>
                            <div className="form-inline" >
                                <div className='form-group'>
                                    <label className="form-control-static" >Đến tháng</label>
                                    <DatePicker
                                        id="to-month-task"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={endDate}
                                        onChange={this.handleEndMonthChange}
                                    />
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} > {translate('general.search')} </button>
                                </div>
                            </div>
                        </div>
                    }

                    {tasks?.isLoading
                        ? <p>{translate('general.loading')}</p>
                        : tasks?.organizationUnitTasks?.tasks?.length > 0
                            ? <div className="" >
                                <p className="pull-left" > < b > ĐV tính: Số công việc </b></p>
                                {!singleUnit && advancedMode && searchAdvanceMode
                                    && <div className="box-tools pull-right" >
                                        <div className="btn-group pull-rigth">
                                            <button type="button" className={`btn btn-xs ${totalTask ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Tổng công việc</button>
                                            <button type="button" className={`btn btn-xs ${totalTask ? 'active' : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Công việc trên đầu người</button>
                                        </div>
                                    </div>
                                }
                                <section id={"taskUnitsChart"} className="c3-chart-container">
                                    <div ref="taskUnitsChart" style={{ marginBottom: "25px" }}></div>
                                    {!singleUnit && advancedMode && searchAdvanceMode && <CustomLegendC3js
                                        chart={this.chart.current}
                                        chartId={"taskUnitsChart"}
                                        legendId={"taskUnitsChartLegend"}
                                        title={this.props?.childOrganizationalUnit && `${translate('general.list_unit')} (${this.props?.childOrganizationalUnit?.length})`}
                                        dataChartLegend={this.props?.childOrganizationalUnit?.length && this.props.childOrganizationalUnit.map(item => item.name)}
                                    />}

                                </section>
                            </div>
                            : <p>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                    }
                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { tasks, user } = state;
    return { tasks, user };
}

const actionCreators = {
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
};

const taskOrganizationalUnitsChart = connect(mapState, actionCreators)(withTranslate(TaskOrganizationalUnitsChart));
export { taskOrganizationalUnitsChart as TaskOrganizationalUnitsChart };
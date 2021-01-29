/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

import { DatePicker, CustomLegendC3js } from '../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class TaskOrganizationalUnitsChart extends Component {
    constructor(props) {
        super(props);
        let startDate = ['01', new Date().getFullYear()].join('-');

        this.chart = null;
        this.dataChart = null;

        this.state = {
            totalTask: false,
            startDate: startDate,
            startDateShow: startDate,
            endDate: this.formatDate(Date.now(), true),
            endDateShow: this.formatDate(Date.now(), true)
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
        const { startDate, endDate } = this.state;
        let { childOrganizationalUnit } = this.props;
        childOrganizationalUnit = childOrganizationalUnit.map(x => x.id);
        this.props.getAllEmployeeOfUnitByIds(childOrganizationalUnit, "employeesOfUnistsUserIsManager");
        this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnit, this.formatString(startDate), this.formatString(endDate));
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
        if (nextProps.tasks.organizationUnitTasks && !this.isEqual(nextProps.tasks.organizationUnitTasks.tasks, this.state.taskOfUnists) &&
            nextProps.user.employeesOfUnitsUserIsManager.length !== 0) {
            this.setState({
                taskOfUnists: nextProps.tasks.organizationUnitTasks.tasks
            })
            return true;
        };
        if (nextState.startDateShow !== this.state.startDateShow || nextState.endDateShow !== this.state.endDateShow || nextState.totalTask !== this.state.totalTask) {
            return true;
        }
        return false;
    }

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    handleStartMonthChange = (value) => {
        this.setState({
            startDate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    handleEndMonthChange = (value) => {
        this.setState({
            endDate: value,
        })
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            totalTask: value
        })
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
    renderChart = (data) => {
        this.removePreviousChart();
        this.chart = c3.generate({
            bindto: this.refs.taskUnitsChart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: 'spline',
            },
            bar: {
                width: {
                    ratio: 0.8
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            },
        });

        setTimeout(function () {
            if (this.chart) {
                this.chart.load({
                    columns: data,
                });
            }
        }, 0);
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { startDate, endDate } = this.state;

        let startDateCheck = new Date(startDate);
        let endDateCheck = new Date(endDate);
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
            childOrganizationalUnit = childOrganizationalUnit.map(x => x.id);
            this.setState({
                startDateShow: startDate,
                endDateShow: endDate,
                taskOfUnists: []
            })
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnit, this.formatString(startDate), this.formatString(endDate));
        }
    }

    render() {
        const { translate, tasks, user } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { totalTask, startDate, endDate } = this.state;

        let endMonth = new Date(this.formatString(endDate)).getMonth();
        let endYear = new Date(this.formatString(endDate)).getFullYear();
        endMonth = endMonth + 1;
        let arrMonth = [];
        for (let i = 0; ; i++) {
            let month = endMonth - i;
            if (month > 0) {
                if (month.toString().length === 1) {
                    month = `${endYear}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${this.formatString(startDate)}-01` === month) {
                    break;
                }
            } else {
                let j = 1;
                for (j; ; j++) {
                    month = month + 12;
                    if (month > 0) {
                        break;
                    }
                }
                if (month.toString().length === 1) {
                    month = `${endYear - j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear - j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${this.formatString(startDate)}-01` === month) {
                    break;
                }
            }
        };
        let listTask = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : [];
        let employeesOfUnitsUserIsManager = user.employeesOfUnitsUserIsManager;
        let employeeOfUnits = [];
        if (totalTask) {
            childOrganizationalUnit.forEach(x => {
                let count = employeesOfUnitsUserIsManager.filter(e => e.idUnit.toString() === x.id.toString())
                employeeOfUnits = [...employeeOfUnits, count.length ? count.length : 1]
            })
        }

        let data = [["x", ...arrMonth]];
        childOrganizationalUnit.forEach((x, index) => {
            let taskOfUnist = [];
            if (listTask.length !== 0) {
                taskOfUnist = listTask.filter(t => t.organizationalUnit._id === x.id);
            }
            let row = [...arrMonth];
            row = row.map(r => {
                let taskOfUnistInMonth = taskOfUnist.filter(t => {
                    if (new Date(t.startDate).getTime() <= new Date(r).getTime() && new Date(r).getTime() <= new Date(t.endDate).getTime()) {
                        return true;
                    }
                    return false;
                });
                if (totalTask) {
                    return (taskOfUnistInMonth.length / employeeOfUnits[index]).toFixed(1);
                }
                return taskOfUnistInMonth.length;
            })
            data = [...data, [x.name, ...row]]
        })

        this.dataChart = data;
        this.renderChart(data)

        return (
            <div className="box box-solid" >
                <div className="box-header with-border" >
                    <h3 className="box-title" > Tình hình làm việc các đơn vị</h3>
                </div>
                <div className="box-body" >
                    <div className="qlcv" style={{ marginBottom: 15 }} >
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
                    <div className="" >
                        <p className="pull-left" > < b > ĐV tính: Số công việc </b></p >
                        <div className="box-tools pull-right" >
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${totalTask ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Tổng công việc</button>
                                <button type="button" className={`btn btn-xs ${totalTask ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Công việc trên đầu người</button>
                            </div>
                        </div>
                        <div ref="taskUnitsChart" ></div>
                        <section id={"taskUnitsChart"} className="c3-chart-container">
                            <div ref="taskUnitsChart"></div>
                            <CustomLegendC3js
                                chart={this.chart}
                                chartId={"taskUnitsChart"}
                                legendId={"taskUnitsChartLegend"}
                                title={this.dataChart && `${translate('general.list_unit')} (${this.dataChart.length - 1})`}
                                dataChartLegend={this.dataChart && this.dataChart.filter((item, index) => index > 0).map(item => item[0])}
                            />
                        </section>
                    </div>
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
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
};

const taskOrganizationalUnitsChart = connect(mapState, actionCreators)(withTranslate(TaskOrganizationalUnitsChart));
export { taskOrganizationalUnitsChart as TaskOrganizationalUnitsChart };
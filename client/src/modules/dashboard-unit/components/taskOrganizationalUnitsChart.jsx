/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

import { DatePicker } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class TaskOrganizationalUnitsChart extends Component {
    constructor(props) {
        super(props);
        const { childOrganizationalUnit } = this.props
        let startDate = ['01', new Date().getFullYear()].join('-');

        this.state = {
            timeseriesChart: childOrganizationalUnit?.length <= 1,
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
        const { childOrganizationalUnit, month } = this.props;
        const { startDate, endDate } = this.state;
        let childOrganizationalUnitId = childOrganizationalUnit.map(x => x.id);
        this.props.getAllEmployeeOfUnitByIds({
            organizationalUnitIds: childOrganizationalUnitId,
        });

        // Nếu số đơn vị >1, chỉ truy vấn dữ lieuẹ trong 1 tháng (dùng cho biểu đồ)
        if (childOrganizationalUnitId?.length > 3) {
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, month, month);
        } else {
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
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
            let timeseriesChart = nextProps.childOrganizationalUnit?.length <= 1

            this.setState(state => {
                return {
                    ...state,
                    timeseriesChart: timeseriesChart
                }
            })
            this.props.getAllEmployeeOfUnitByIds({
                organizationalUnitIds: childOrganizationalUnitId,
            });
            
            // Nếu số đơn vị >1, chỉ truy vấn dữ lieuẹ trong 1 tháng (dùng cho biểu đồ)
            if (timeseriesChart) {
                this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, nextProps.month, nextProps.month);
            } else {
                this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
            }
            return true
        }

        return true;
    }

    componentDidUpdate = () => {
        this.renderChart()
    }

    setSingleDataChart = () => {
        const { tasks, user } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { startDate, endDate } = this.state;

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

        let title = ["x"];
        let totalTask = ["Số công việc"], taskPerEmployeeOfUnit = ["Công việc trên đầu người"];


        childOrganizationalUnit && childOrganizationalUnit.forEach((unit, index) => {
            let taskOfUnist = [];
            if (listTask.length !== 0) {
                taskOfUnist = listTask.filter(t => t.organizationalUnit?._id === unit.id);
            }
            let taskPerEmployee = taskOfUnist?.length / employeeOfUnits?.[unit?.id]?.length

            title.push(unit?.name)
            totalTask.push(taskOfUnist?.length)
            taskPerEmployeeOfUnit.push(taskPerEmployee && !isNaN(taskPerEmployee) ? taskPerEmployee.toFixed(1) : 0)
        })

        return [
            title,
            totalTask,
            taskPerEmployeeOfUnit
        ]
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
        const { timeseriesChart } = this.state

        this.removePreviousChart();
        let dataChart;
        if (timeseriesChart) {
            dataChart = this.setSingleDataChart()
        } else {
            dataChart = this.setMultiDataChart()
        }
        let chart = c3.generate({
            bindto: this.refs.taskUnitsChart,
            data: {
                x: 'x',
                columns: dataChart,
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.3
                }
            },
            axis: {
                x: {
                    type: timeseriesChart ? 'timeseries' : 'categories',
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

            tooltip: {
                position: function () {
                    let position = c3.chart.internal.fn.tooltipPosition.apply(this, arguments);
                    return position;
                },
                contents: function (data) {
                    let value = '<div style="overflow-y: scroll; max-height: 300px; pointer-events: auto;">';
                    value = value + '<table class=\'c3-tooltip\'>';

                    data.forEach((val) => {
                        value = value + '<tr><td class=\'name\'>' + val.name + '</td>'
                            + '<td class=\'value\'>' + val.value + '</td></tr>';
                    });

                    value = value + '</table>';
                    value = value + '</div>';

                    return value;
                }
            },
        });
    };

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
            let childOrganizationalUnitId = childOrganizationalUnit.map(x => x.id);
            this.setState({
                startDateShow: startDate,
                endDateShow: endDate,
                taskOfUnists: []
            })
            this.props.getTaskInOrganizationUnitByMonth(childOrganizationalUnitId, this.formatString(startDate), this.formatString(endDate));
        }
    }

    render() {
        const { translate, tasks } = this.props;
        let { childOrganizationalUnit } = this.props;
        const { startDate, endDate, timeseriesChart } = this.state;

        return (
            <div className="box box-solid" >
                <div className="box-header with-border" >
                    <div className="box-title" >
                        Tình hình làm việc 
                        {
                            childOrganizationalUnit && childOrganizationalUnit.length < 2 ?
                                <>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <span>{` ${childOrganizationalUnit?.[0]?.name ? childOrganizationalUnit?.[0]?.name : ""}`}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(childOrganizationalUnit.map(item => item?.name), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {childOrganizationalUnit?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                </span>
                        }
                    </div>
                </div>
                <div className="box-body" >
                    {timeseriesChart 
                        && <div className="qlcv" style={{ marginBottom: 15 }} >
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
                                <p className="pull-left" > < b > ĐV tính: Số công việc </b></p >
                                <section id={"taskUnitsChart"} className="c3-chart-container">
                                    <div ref="taskUnitsChart" style={{ marginBottom: "15px" }}></div>
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
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
};

const taskOrganizationalUnitsChart = connect(mapState, actionCreators)(withTranslate(TaskOrganizationalUnitsChart));
export { taskOrganizationalUnitsChart as TaskOrganizationalUnitsChart };
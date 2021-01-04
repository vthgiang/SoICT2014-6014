import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToolTip, SelectMulti } from '../../../common-components';
import { TaskOrganizationalUnitsChart } from './combinedContent';
import c3 from 'c3';
import Swal from 'sweetalert2';
import { taskManagementActions } from '../../task/task-management/redux/actions';
class TabTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: this.formatDate(Date.now(), false),
            listUnit: [],
            urgent: [],
            taskNeedToDo: [],
            // organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            // arrayUnitShow: [this.props.childOrganizationalUnit[0].id],
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
    }

    removePreviousUrgentPieChart() {
        const chart = this.refs.pieCharUrgent;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    removePreviousNeedToDoPieChart() {
        const chart = this.refs.pieCharTaskNeedToDo;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    pieChartUrgent = (data) => {
        this.removePreviousUrgentPieChart();
        let dataChart = this.convertDataUrgentPieChart(data);
        this.chart = c3.generate({
            bindto: this.refs.pieCharUrgent,
            data: { // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
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
                show: true
            }
        })
    }

    pieChartNeedTodo = (data) => {
        this.removePreviousNeedToDoPieChart();
        let dataChart = this.convertDataTaskNeedToDoPieChart(data);
        this.chart = c3.generate({
            bindto: this.refs.pieCharTaskNeedToDo,
            data: { // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
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
                show: true
            }
        })
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

    }

    handleUpdateData = () => {
        let { currentDate, arrayUnitShow } = this.state;
        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        this.props.getTaskInOrganizationUnitByDateNow(arrayUnitShow, newDate)
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
                total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                return total;
            }, [])

            for (let key in result2) {
                taskNeedToDoPieChart = [...taskNeedToDoPieChart, [key, result2[key]]]
            }
        }

        return taskNeedToDoPieChart;
    }

    static getDerivedStateFromProps(props, state) {
        const { tasks } = props;
        const { arrayUnitShow, urgent, taskNeedToDo } = state;

        if (tasks && tasks.organizationUnitTasksChart && props.childOrganizationalUnit) {
            return {
                ...state,
                listUnit: props.childOrganizationalUnit,
                arrayUnitShow: !arrayUnitShow ? [props.childOrganizationalUnit[0].id] : arrayUnitShow,
                urgent: tasks.organizationUnitTasksChart.urgent,
                taskNeedToDo: tasks.organizationUnitTasksChart.taskNeedToDo,
            }
        } else {
            return null;
        }
    }

    componentDidMount() {
        let { currentDate } = this.state;
        const unit = this.props.childOrganizationalUnit[0].id
        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        this.props.getTaskInOrganizationUnitByDateNow([unit], newDate);
    }


    render() {
        const { translate, tasks } = this.props; //redux
        let { childOrganizationalUnit } = this.props;
        const { listUnit, arrayUnitShow, urgent, taskNeedToDo } = this.state;
        this.pieChartNeedTodo(taskNeedToDo);
        this.pieChartUrgent(urgent);

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <div className="box-title">
                                    Biểu đồ thể hiện số công việc khẩn cấp/Cần làm
                                    <ToolTip
                                        type={"icon_tooltip"}
                                        dataTooltip={[
                                            `Công việc được gọi là khẩn cấp/nghiêm trọng nếu:
                                                Quá hạn, công việc có độ ưu tiên
                                            `
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="box-body" style={{ marginBottom: 15 }}>
                                {/* Seach theo thời gian */}
                                <div className="qlcv">
                                    <div className="form-inline" >
                                        <div className="form-group">
                                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                            <SelectMulti id="multiSelectOrganizationalUnitInpriority"
                                                items={listUnit.map(item => ({ value: item.id, text: item.name }))}
                                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                                onChange={this.handleSelectOrganizationalUnit}
                                                value={arrayUnitShow}
                                            >
                                            </SelectMulti>
                                        </div>
                                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>tìm kiếm</button>
                                    </div>
                                </div>

                                <div className="row " >
                                    <div className="dashboard_box_body" >
                                        <div className="col-md-6">
                                            <p className="pull-left" style={{ marginTop: '10px' }}> < b > Số công việc khẩn cấp </b></p >
                                            {
                                                tasks.isLoading ? <p style={{ marginTop: '60px', textAlign: "center" }}>Đang tải dữ liệu</p>
                                                    : urgent && urgent.length > 0 ?
                                                        <div ref="pieCharUrgent" /> :
                                                        <p style={{ marginTop: '60px', textAlign: "center" }}>không có công việc nào khẩn cấp</p>
                                            }


                                        </div>
                                        <div className="col-md-6">
                                            <p className="pull-left" style={{ marginTop: '10px' }}> < b > Số công việc cần làm </b></p >
                                            {
                                                tasks.isLoading ?
                                                    <p style={{ marginTop: '60px', textAlign: "center" }}>Đang tải dữ liệu</p>
                                                    :
                                                    taskNeedToDo && taskNeedToDo.length > 0 ?
                                                        <div ref="pieCharTaskNeedToDo" /> :
                                                        <p style={{ marginTop: '60px', textAlign: "center" }}>không có công việc nào cần làm</p>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-12">
                        <TaskOrganizationalUnitsChart childOrganizationalUnit={childOrganizationalUnit} />
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_overdue')}</div>
                            </div>

                            <div className="box-body" style={{ height: "300px", overflow: "auto" }}>
                                {
                                    (tasks && tasks.tasksbyuser) ?
                                        <ul className="todo-list">
                                            {
                                                (tasks.tasksbyuser.expire.length !== 0) ?
                                                    tasks.tasksbyuser.expire.map((item, key) =>
                                                        <li key={key}>
                                                            <span className="handle">
                                                                <i className="fa fa-ellipsis-v" />
                                                                <i className="fa fa-ellipsis-v" />
                                                            </span>
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                            <small className="label label-danger"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                        </li>
                                                    ) : "Không có công việc quá hạn"
                                            }
                                        </ul> : "Đang tải dữ liệu"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_about_to_overdue')}</div>
                            </div>
                            <div className="box-body" style={{ minHeight: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser) ?
                                        <ul className="todo-list">
                                            {
                                                (tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                                    tasks.tasksbyuser.deadlineincoming.map((item, key) =>
                                                        <li key={key}>
                                                            <span className="handle">
                                                                <i className="fa fa-ellipsis-v" />
                                                                <i className="fa fa-ellipsis-v" />
                                                            </span>
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" >{item.task.name}</a></span>
                                                            <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                        </li>
                                                    ) : "Không có công việc nào sắp hết hạn"
                                            }
                                        </ul> : "Đang tải dữ liệu"
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}


const actionCreators = {
    getTaskInOrganizationUnitByDateNow: taskManagementActions.getTaskByPriorityInOrganizationUnit,
};

const tabTask = connect(mapState, actionCreators)(withTranslate(TabTask));
export { tabTask as TabTask };
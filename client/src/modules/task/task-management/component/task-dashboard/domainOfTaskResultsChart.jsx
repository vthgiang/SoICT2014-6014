import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import { SelectBox } from '../../../../../common-components/index';
import { DatePicker } from '../../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';

class DomainOfTaskResultsChart extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 };
        this.ROLE_SELECTBOX = [
            {
                text: translate('task.task_management.responsible'),
                value: this.ROLE.RESPONSIBLE
            },
            {
                text: translate('task.task_management.accountable'),
                value: this.ROLE.ACCOUNTABLE
            },
            {
                text: translate('task.task_management.consulted'),
                value: this.ROLE.CONSULTED
            },
            {
                text: translate('task.task_management.informed'),
                value: this.ROLE.INFORMED
            },
            {
                text: translate('task.task_management.creator'),
                value: this.ROLE.CREATOR
            }
        ]

        // Sao lưu dữ liệu để sử dụng khi dữ liêu thay đổi
        this.TASK_PROPS = {
            responsibleTasks: null,
            accountableTasks: null,
            consultedTasks: null,
            informedTasks: null,
            creatorTasks: null
        }

        this.INFO_SEARCH = {
            role: this.ROLE.RESPONSIBLE,
            startMonth: currentYear + '-' + 1,
            endMonth: currentYear + '-' + (currentMonth + 2)
        }

        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.INFO_SEARCH.role,
            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,
        };
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        
        if (nextProps.callAction !== this.state.callAction || nextState.startMonth !== this.state.startMonth || nextState.endMonth !== this.state.endMonth) {
            await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.startMonth, nextState.endMonth, null, null, this.state.aPeriodOfTime);
            await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.startMonth, nextState.endMonth, this.state.aPeriodOfTime);
            await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.startMonth, nextState.endMonth, this.state.aPeriodOfTime);
            await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.startMonth, nextState.endMonth, this.state.aPeriodOfTime);
            await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.startMonth, nextState.endMonth, this.state.aPeriodOfTime);

            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                };
            });

            return false;
        }

        if (nextState.role !== this.state.role) {
            await this.setState(state => {
                return {
                    ...state,
                    role: nextState.role
                }
            })
            
            this.domainChart();
        }
        
        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.startMonth, this.state.endMonth, null, null, this.state.aPeriodOfTime);
            await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.startMonth, this.state.endMonth, this.state.aPeriodOfTime);
            await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.startMonth, this.state.endMonth, this.state.aPeriodOfTime);
            await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.startMonth, this.state.endMont, this.state.aPeriodOfTimeh);
            await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.startMonth, this.state.endMonth, this.state.aPeriodOfTime);

            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                };
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra tasks đã được bind vào props hay chưa
            if (!nextProps.tasks.responsibleTasks || !nextProps.tasks.accountableTasks || !nextProps.tasks.consultedTasks || !nextProps.tasks.informedTasks || !nextProps.tasks.creatorTasks) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };
            /** Sao lưu để sử dụng khi dữ liệu bị thay đổi
             *  (Lý do: khi đổi role task, muốn sử dụng dữ liệu cũ nhưng trước đó dữ liệu trong kho redux đã bị thay đổi vì service được gọi ở 1 nơi khác)
             */ 
            if (nextState.willUpdate) {
                this.TASK_PROPS = {
                    responsibleTasks: nextProps.tasks.responsibleTasks,
                    accountableTasks: nextProps.tasks.accountableTasks,
                    consultedTasks: nextProps.tasks.consultedTasks,
                    informedTasks: nextProps.tasks.informedTasks,
                    creatorTasks: nextProps.tasks.creatorTasks
                }
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
            this.domainChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                };
            });
        }

        return false;
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {

        if (nextProps.callAction !== prevState.callAction) {
            return {
                ...prevState,
                callAction: nextProps.callAction
            }
        } else {
            return null
        }
    }

    handleSelectRole = (value) => {
        this.INFO_SEARCH.role = Number(value[0]);
    }

    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));

        this.INFO_SEARCH.startMonth = month;
    }

    handleSelectMonthEnd = (value) => {
        let month;

        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endMonth = month;
    }

    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    role: this.INFO_SEARCH.role,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })
        }
    }

    // Hàm lọc các công việc theo từng tháng
    filterTasksByMonth = (currentMonth, nextMonth) => {
        let maxResults = [], minResults = [], maxResult, minResult;
        let listTask;

        if (this.TASK_PROPS.responsibleTasks && this.TASK_PROPS.accountableTasks && this.TASK_PROPS.consultedTasks && this.TASK_PROPS.informedTasks && this.TASK_PROPS.creatorTasks) {
            if (this.state.role === this.ROLE.RESPONSIBLE) {
                listTask = this.TASK_PROPS.responsibleTasks;
            } else if (this.state.role === this.ROLE.ACCOUNTABLE) {
                listTask = this.TASK_PROPS.accountableTasks;
            } else if (this.state.role === this.ROLE.CONSULTED) {
                listTask = this.TASK_PROPS.consultedTasks;
            } else if (this.state.role === this.ROLE.INFORMED) {
                listTask = this.TASK_PROPS.informedTasks;
            } else if (this.state.role === this.ROLE.CREATOR) {
                listTask = this.TASK_PROPS.creatorTasks;
            }
        };

        if (listTask) {
            listTask.map(task => {
                task.evaluations.filter(evaluation => {
                    if (new Date(evaluation.date) < new Date(nextMonth) && new Date(evaluation.date) >= new Date(currentMonth)) {
                        return 1;
                    }

                    return 0;
                }).map(evaluation => {
                    evaluation.results.filter(result => {
                        if (result.employee === this.state.userId) {
                            return 1;
                        }

                        return 0;
                    }).map(result => {
                        maxResults.push(Math.max(result.automaticPoint, result.employeePoint, result.approvedPoint))
                        minResults.push(Math.min(result.automaticPoint, result.employeePoint, result.approvedPoint))
                    });
                })
            });
        }

        if (maxResults.length === 0) {
            maxResult = null;
        } else {
            maxResult = Math.max.apply(Math, maxResults);
        }

        if (minResults.length === 0) {
            minResult = null;
        } else {
            minResult = Math.min.apply(Math, minResults);
        }

        return {
            'month': new Date(currentMonth),
            'max': maxResult,
            'min': minResult
        }
    }

    setDataDomainChart = () => {
        const { translate } = this.props;
        const { startMonth, endMonth } = this.state;

        let month = ['x'], maxResults = [translate('task.task_management.dashboard_max')], minResults = [translate('task.task_management.dashboard_min')];
        let monthIndex = startMonth;

        while (new Date(monthIndex) <= new Date(endMonth)) {
            let nextMonthIndex, data;

            if (new Number(monthIndex.slice(5, 7)) < 12) {
                nextMonthIndex = monthIndex.slice(0, 4) + '-' + (new Number(monthIndex.slice(5, 7)) + 1);
            } else {
                nextMonthIndex = (new Number(monthIndex.slice(0, 4)) + 1) + '-' + '1';
            }

            data = this.filterTasksByMonth(monthIndex, nextMonthIndex);
            if (data.max) {
                month.push(data.month);
                maxResults.push(data.max);
                minResults.push(data.min)
            }

            monthIndex = nextMonthIndex;
        }

        return [
            month,
            maxResults,
            minResults
        ]
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    domainChart = () => {
        this.removePreviosChart();

        let dataChart = this.setDataDomainChart();
        
        this.chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="chart"

            data: {
                x: 'x',
                columns: dataChart,
                type: 'area-spline'
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                right: 20,
                bottom: 20
            },

            axis: {                                // Config trục tọa độ
                x: {
                    type: 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: 'Điểm',
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },
        })
    }

    render() {
        const { translate, taskOrganizationUnit } = this.props;
        
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="col-sm-6 col-xs-12 form-group">
                        <label>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="monthStartInDomainOfTaskResults"
                            dateFormat="month-year"             
                            value={defaultStartMonth}                    
                            onChange={this.handleSelectMonthStart}
                            disabled={false}                   
                        />
                    </div>
                    <div className="col-sm-6 col-xs-12 form-group">
                        <label>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="monthEndInDomainOfTaskResults"
                            dateFormat="month-year"             
                            value={defaultEndMonth}                    
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}                   
                        />
                    </div>
                </section>

                <section className="form-inline">
                    { !taskOrganizationUnit && 
                        <div className="col-sm-6 col-xs-12 form-group">
                        <label>{translate('task.task_management.role')}</label>
                        <SelectBox
                            id={`roleOfResultsTaskSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={this.ROLE_SELECTBOX}
                            multiple={false}
                            onChange={this.handleSelectRole}
                            value={this.ROLE_SELECTBOX[0].value}
                        />
                        </div>
                    }
                    <div className="col-sm-6 col-xs-12 form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </section>

                <section className="col-sm-12 col-xs-12">
                    <div ref="chart"></div>
                </section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser
}

const connectedDomainOfTaskResultsChart = connect(mapState, actions)(withTranslate(DomainOfTaskResultsChart));
export { connectedDomainOfTaskResultsChart as DomainOfTaskResultsChart }
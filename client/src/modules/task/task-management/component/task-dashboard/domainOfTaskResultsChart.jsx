import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import { TaskOrganizationUnitDashboard } from '../task-organization-dashboard/taskOrganizationUnitDashboard';
import { TaskInformationForm } from '../../../task-perform/component/taskInformationForm';

class DomainOfTaskResultsChart extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;

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

        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.ROLE.RESPONSIBLE,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,
        };
    }

    shouldComponentUpdate = async (nextProps, nextState) => {

        if (nextProps.units !== this.props.units || nextProps.callAction !== this.state.callAction || nextProps.startMonth !== this.state.startMonth || nextProps.endMonth !== this.state.endMonth) {
            if (this.props.TaskOrganizationUnitDashboard) {
                await this.setState(state => {
                    return {
                        ...state,
                        startMonth: nextProps.startMonth,
                        endMonth: nextProps.endMonth,
                        
                    }
                })

                if(this.props.units.length){
                    await this.props.getTaskInOrganizationUnitByMonth(this.props.units, nextProps.startMonth, nextProps.endMonth);
                }
            }
            else {
                await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
                await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
            }
            // this.domainChart();

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
            if (this.props.TaskOrganizationUnitDashboard) { // neu component duoc goi tu task organization unit
                let idsUnit = this.props.units ? this.props.units : "[]";
                if(this.props.units.length !== 0)
                await this.props.getTaskInOrganizationUnitByMonth(idsUnit, this.state.startMonth, this.state.endMonth);
            }
            else {
                await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTimeh);
                await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextProps.startMonth, nextProps.endMonth, this.state.aPeriodOfTime);
            }
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
            if (this.props.TaskOrganizationUnitDashboard) {
                if (!nextProps.tasks.organizationUnitTasks) {
                    return false;
                }

            }
            else if (!nextProps.tasks.responsibleTasks
                || !nextProps.tasks.accountableTasks
                || !nextProps.tasks.consultedTasks
                || !nextProps.tasks.informedTasks
                || !nextProps.tasks.creatorTasks
            ) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };

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

        if (nextProps.callAction !== prevState.callAction || nextProps.startMonth !== prevState.startMonth || nextProps.endMonth !== prevState.endMonth) {
            return {
                ...prevState,
                callAction: nextProps.callAction,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth
            }
        } else {
            return null
        }
    }

    handleSelectRole = (value) => {
        this.setState(state => {
            return {
                ...state,
                role: Number(value[0])
            }
        })
    }

    // Hàm lọc các công việc theo từng tháng
    filterTasksByMonth = (currentMonth, nextMonth) => {
        const { tasks } = this.props;

        let maxResults = [], minResults = [], maxResult, minResult;
        let listTask;
        if (this.props.TaskOrganizationUnitDashboard) {
            listTask = tasks.organizationUnitTasks;
        }

        else if (tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks && tasks.informedTasks && tasks.creatorTasks) {
            if (this.state.role === this.ROLE.RESPONSIBLE) {
                listTask = tasks.responsibleTasks;
            } else if (this.state.role === this.ROLE.ACCOUNTABLE) {
                listTask = tasks.accountableTasks;
            } else if (this.state.role === this.ROLE.CONSULTED) {
                listTask = tasks.consultedTasks;
            } else if (this.state.role === this.ROLE.INFORMED) {
                listTask = tasks.informedTasks;
            } else if (this.state.role === this.ROLE.CREATOR) {
                listTask = tasks.creatorTasks;
            }
        };

        if (listTask) {
            listTask = this.props.TaskOrganizationUnitDashboard ? listTask.tasks : listTask; // neu la listTask cua organizationUnit
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
        const { translate, TaskOrganizationUnitDashboard } = this.props;

        return (
            <React.Fragment>
                {!TaskOrganizationUnitDashboard &&
                    <section className="form-inline" style={{ textAlign: "right" }}>
                        <div className="form-group">
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
                    </section>
                }

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
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
}

const connectedDomainOfTaskResultsChart = connect(mapState, actions)(withTranslate(DomainOfTaskResultsChart));
export { connectedDomainOfTaskResultsChart as DomainOfTaskResultsChart }
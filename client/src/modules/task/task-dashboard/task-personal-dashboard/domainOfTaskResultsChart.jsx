import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

import { SelectBox, SelectMulti } from '../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
// import { TaskOrganizationUnitDashboard } from '../task-organization-dashboard/taskOrganizationUnitDashboard';
// import { TaskInformationForm } from '../../../task-perform/component/taskInformationForm';

class DomainOfTaskResultsChart extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.ROLE = { RESPONSIBLE: 0, ACCOUNTABLE: 1, CONSULTED: 2 };
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
            }
        ];

        this.TYPEPOINT = { AUTOMAIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };
        this.TYPEPOINT_SELECTBOX = [
            {
                text: translate('task.task_management.detail_auto_point'),
                value: this.TYPEPOINT.AUTOMAIC_POINT
            },
            {
                text: translate('task.task_management.detail_emp_point'),
                value: this.TYPEPOINT.EMPLOYEE_POINT
            },
            {
                text: translate('task.task_management.detail_acc_point'),
                value: this.TYPEPOINT.APPROVED_POINT
            }
        ];

        this.DATA_SEARCH = {
            role: [this.ROLE.RESPONSIBLE],
            typePoint: this.TYPEPOINT.AUTOMAIC_POINT,
        };

        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.DATA_SEARCH.role,
            typePoint: this.DATA_SEARCH.typePoint,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,
        };
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps.units !== this.props.units || nextProps.callAction !== this.state.callAction || nextProps.startMonth !== this.state.startMonth || nextProps.endMonth !== this.state.endMonth) {
            if (this.props.TaskOrganizationUnitDashboard) {
                this.setState(state => {
                    return {
                        ...state,
                        startMonth: nextProps.startMonth,
                        endMonth: nextProps.endMonth,

                    }
                })
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                };
            });

            return false;
        }

        if (nextState.role !== this.state.role || nextState.typePoint !== this.state.typePoint) {
            this.setState(state => {
                return {
                    ...state,
                    role: nextState.role,
                    typePoint: nextState.typePoint
                }
            })

            this.domainChart();
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
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
        let role = value.map(item => Number(item));
        this.DATA_SEARCH.role = role;
    }

    handleSelectTypePoint = (value) => {
        this.DATA_SEARCH.typePoint = Number(value[0]);
    }

    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                role: this.DATA_SEARCH.role,
                typePoint: this.DATA_SEARCH.typePoint
            }
        })
    }

    // Lọc công việc trùng lặp
    filterDuplicateTask = (listTask) => {
        let idArray = listTask.map(item => item && item._id);
        idArray = idArray.map((item, index, array) => {
            if (array.indexOf(item) === index) {
                return index;
            } else {
                return false
            }
        })
        idArray = idArray.filter(item => listTask[item]);
        let listTaskNotDuplicate = idArray.map(item => {
            return listTask[item]
        })

        return listTaskNotDuplicate;
    }

    // Hàm lọc các công việc theo từng tháng
    filterTasksByMonth = (currentMonth, nextMonth) => {
        const { tasks, TaskOrganizationUnitDashboard, units } = this.props;
        const { role, userId, typePoint } = this.state;

        let results = [], maxResult, minResult;
        let listTask = [], listTaskByRole = [];
        if (TaskOrganizationUnitDashboard) {
            listTask = tasks.organizationUnitTasks;
        }
        else if (tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks) {
            listTaskByRole[this.ROLE.RESPONSIBLE] = tasks.responsibleTasks;
            listTaskByRole[this.ROLE.ACCOUNTABLE] = tasks.accountableTasks;
            listTaskByRole[this.ROLE.CONSULTED] = tasks.consultedTasks;

            if (role.length !== 0) {
                role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }

            listTask = this.filterDuplicateTask(listTask);
        };

        if (listTask) {
            listTask = TaskOrganizationUnitDashboard ? listTask.tasks : listTask; // neu la listTask cua organizationUnit
            listTask.map(task => {
                task.evaluations.filter(evaluation => {
                    let date = new Date(nextMonth)
                    let month = date.getMonth() + 1
                    let day;
                    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                        day = 31;
                    } else if (month === 2) {
                        day = 28;
                    } else {
                        day = 30;
                    }
                    let dateNextMonth = date.getFullYear() + '-' + month + '-' + day;
                    if (new Date(evaluation.date) < new Date(dateNextMonth) && new Date(evaluation.date) >= new Date(currentMonth)) {
                        return 1;
                    }

                    return 0;
                }).map(evaluation => {
                    evaluation.results.filter(result => {
                        if (units || (result.employee === userId)) {
                            return 1;
                        }
                        return 0;
                    }).map(result => {
                        switch (typePoint) {
                            case this.TYPEPOINT.AUTOMAIC_POINT:
                                results.push(result.automaticPoint);
                            case this.TYPEPOINT.EMPLOYEE_POINT:
                                results.push(result.employeePoint);
                            case this.TYPEPOINT.APPROVED_POINT:
                                results.push(result.approvedPoint);
                        }

                    });
                })
            });
        }

        if (results.length === 0) {
            maxResult = null;
        } else {
            maxResult = Math.max.apply(Math, results);
            minResult = Math.min.apply(Math, results);
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
            let data, nextMonthIndex;

            if (new Number(monthIndex.slice(5, 7)) < 9) {
                nextMonthIndex = monthIndex.slice(0, 4) + '-0' + (new Number(monthIndex.slice(5, 7)) + 1);
            } else if (new Number(monthIndex.slice(5, 7)) < 12) {
                nextMonthIndex = monthIndex.slice(0, 4) + '-' + (new Number(monthIndex.slice(5, 7)) + 1);
            } else {
                nextMonthIndex = (new Number(monthIndex.slice(0, 4)) + 1) + '-' + '01';
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
                <div className="qlcv">
                    {!TaskOrganizationUnitDashboard
                        &&
                        <div className="form-inline" >
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('task.task_management.role')}</label>
                                <SelectMulti
                                    id="multiSelectDomainOfTaskResults"
                                    items={this.ROLE_SELECTBOX}
                                    onChange={this.handleSelectRole}
                                    options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                                    value={this.DATA_SEARCH.role}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-inline" >
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectBox
                                id={`typePointOfResultsTaskSelectBox`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={this.TYPEPOINT_SELECTBOX}
                                multiple={false}
                                onChange={this.handleSelectTypePoint}
                                value={this.DATA_SEARCH.typePoint}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </div>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}

const actions = {
}

const connectedDomainOfTaskResultsChart = connect(mapState, actions)(withTranslate(DomainOfTaskResultsChart));
export { connectedDomainOfTaskResultsChart as DomainOfTaskResultsChart }
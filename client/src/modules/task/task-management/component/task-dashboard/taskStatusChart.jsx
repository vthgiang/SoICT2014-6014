import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import { SelectBox, SelectMulti } from '../../../../../common-components/index';
import { DatePicker } from '../../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import { TaskOrganizationUnitDashboard } from '../task-organization-dashboard/taskOrganizationUnitDashboard';

class TaskStatusChart extends Component {

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
            creatorTasks: null,
            organizationUnitTasks: null,
        }

        this.INFO_SEARCH = {
            role: this.ROLE.RESPONSIBLE,
            currentMonth: currentYear + '-' + (currentMonth + 1),
            nextMonth: currentYear + '-' + (currentMonth + 2)
        }

        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.INFO_SEARCH.role,
            currentMonth: this.INFO_SEARCH.currentMonth,
            nextMonth: this.INFO_SEARCH.nextMonth,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
        };

    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (
            nextProps.callAction !== this.state.callAction
            || nextState.currentMonth !== this.state.currentMonth
            || nextState.nextMonth !== this.state.nextMonth
            || nextProps.startMonth !== this.props.startMonth || nextProps.endMonth !== this.props.endMonth
        ) {

            if (this.props.TaskOrganizationUnitDashboard && this.props.units.length && this.props.startMonth && this.props.endMonth) {

                let idsUnit = this.props.units ? this.props.units : "[]";
  
                await this.setState(state => {
                    return {
                        ...state,
                        currentMonth: this.props.startMonth,
                        nextMonth: this.props.endMonth,
                        
                    }
                })

                await this.props.getTaskInOrganizationUnitByMonth(idsUnit, nextProps.startMonth, nextProps.endMonth);
            } else {
            
                await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.currentMonth, nextState.nextMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.currentMonth, nextState.nextMonth, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.currentMonth, nextState.nextMonth, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.currentMonth, nextState.nextMonth, this.state.aPeriodOfTime);
                await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, nextState.currentMonth, nextState.nextMonth, this.state.aPeriodOfTime);
            }
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

            this.pieChart();
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {


            if (this.props.TaskOrganizationUnitDashboard) { // neu componet duoc goi tu dashboard organization unit
                let idsUnit = this.props.units ? this.props.units : "[]";
                console.log("o day dong 132:=======================")
                await this.props.getTaskInOrganizationUnitByMonth(idsUnit, this.state.currentMonth, this.state.nextMonth);
            }
            else {
                await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.currentMonth, this.state.nextMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.currentMonth, this.state.nextMonth, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.currentMonth, this.state.nextMonth, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.currentMonth, this.state.nextMonth, this.state.aPeriodOfTime);
                await this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, this.state.currentMonth, this.state.nextMonth, this.state.aPeriodOfTime);
            }
            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true        // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (this.props.TaskOrganizationUnitDashboard) {
                if (!nextProps.tasks.organizationUnitTasks) {
                    return false;
                }

            }
            // Kiểm tra tasks đã được bind vào props hay chưa
            else if (!nextProps.tasks.responsibleTasks
                || !nextProps.tasks.accountableTasks
                || !nextProps.tasks.consultedTasks
                || !nextProps.tasks.informedTasks
                || !nextProps.tasks.creatorTasks
            ) {
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
                    creatorTasks: nextProps.tasks.creatorTasks,
                    organizationUnitTasks: nextProps.tasks.organizationUnitTasks,

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
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
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
        this.INFO_SEARCH.role = Number(value[0])
    }

    handleSelectMonth = (value) => {
        let nextMonth, currentMonth;

        currentMonth = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));

        if (new Number(value.slice(0, 2)) < 12) {
            nextMonth = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            nextMonth = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.currentMonth = currentMonth;
        this.INFO_SEARCH.nextMonth = nextMonth;
    }

    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                role: this.INFO_SEARCH.role,
                currentMonth: this.INFO_SEARCH.currentMonth,
                nextMonth: this.INFO_SEARCH.nextMonth
            }
        })
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;

        let dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        let listTask;
        if (this.props.TaskOrganizationUnitDashboard) {
            listTask = this.TASK_PROPS.organizationUnitTasks;
        }
        else if (this.TASK_PROPS.responsibleTasks && this.TASK_PROPS.accountableTasks && this.TASK_PROPS.consultedTasks && this.TASK_PROPS.informedTasks && this.TASK_PROPS.creatorTasks) {
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

        listTask = this.props.TaskOrganizationUnitDashboard ? listTask.tasks : listTask;
        if (listTask) {

            listTask.map(task => {
                switch (task.status) {
                    case "Inprocess":
                        numberOfInprocess++;
                        break;
                    case "WaitForApproval":
                        numberOfWaitForApproval++;
                        break;
                    case "Finished":
                        numberOfFinished++;
                        break;
                    case "Delayed":
                        numberOfDelayed++;
                        break;
                    case "Canceled":
                        numberOfCanceled++;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('task.task_management.inprocess'), numberOfInprocess],
            [translate('task.task_management.wait_for_approval'), numberOfWaitForApproval],
            [translate('task.task_management.finished'), numberOfFinished],
            [translate('task.task_management.delayed'), numberOfDelayed],
            [translate('task.task_management.canceled'), numberOfCanceled]
        ];
        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviosChart = () => {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        this.removePreviosChart();

        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="chart"

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type: 'pie',
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            legend: {                             // Ẩn chú thích biểu đồ
                show: true
            }
        });
    }

    render() {
        const { translate, TaskOrganizationUnitDashboard } = this.props;
        const { units } = this.props;
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultMonth = [month, year].join('-');

        return (
            <React.Fragment>
                <div className="box-body qlcv">
                   { !this.props.units &&
                   <section className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.month')}</label>
                            <DatePicker
                                id="monthInStatusTask"
                                dateFormat="month-year"
                                value={defaultMonth}
                                onChange={this.handleSelectMonth}
                                disabled={false}
                            />
                        </div>
                        {
                            TaskOrganizationUnitDashboard &&
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        }
                    </section>
                    }


                    {!TaskOrganizationUnitDashboard &&
                        <section className="form-inline">
                            <div className="form-group">
                                <label>{translate('task.task_management.role')}</label>
                                <SelectBox
                                    id={`roleOfStatusTaskSelectBox`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={this.ROLE_SELECTBOX}
                                    multiple={false}
                                    onChange={this.handleSelectRole}
                                    value={this.ROLE_SELECTBOX[0].value}
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </section>
                    }



                    <section ref="chart"></section>
                </div>
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

const connectedTaskStatusChart = connect(mapState, actions)(withTranslate(TaskStatusChart));
export { connectedTaskStatusChart as TaskStatusChart };
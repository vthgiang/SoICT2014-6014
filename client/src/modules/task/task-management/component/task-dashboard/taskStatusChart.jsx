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
            callAction: false
        };

    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        //console.log('should compornet', nextProps.callAction, this.state.callAction)
        if (
            nextProps.callAction !== this.state.callAction
            || nextProps.startMonth !== this.state.startMonth
            || nextProps.endMonth !== this.state.endMonth
        ) {
            // //console.log('should compornet')
            if (this.props.TaskOrganizationUnitDashboard) {

                let idsUnit = this.props.units ? this.props.units : "[]";

                //console.log(nextState.currentMonth, nextState.nextMonth)
                await this.props.getTaskInOrganizationUnitByMonth(idsUnit, nextProps.startMonth, nextProps.endMonth);
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
        }

        if (nextState.role !== this.state.role) {
            await this.setState(state => {
                return {
                    ...state,
                    role: nextState.role
                }
            })
            //console.log("goi pie chart o day dong 114:=======================")

            this.pieChart();
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {


            if (this.props.TaskOrganizationUnitDashboard) { // neu componet duoc goi tu dashboard organization unit
                let idsUnit = this.props.units ? this.props.units : "[]";
                //console.log("o day dong 132:=======================")
                await this.props.getTaskInOrganizationUnitByMonth(idsUnit, nextProps.startMonth, nextProps.endMonth);
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
                    willUpdate: true        // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            //console.log("o day dong 143:=======================")
            //console.log(nextProps.tasks)
            //console.log(this.props.TaskOrganizationUnitDashboard)
            if (this.props.TaskOrganizationUnitDashboard) {
                if (!nextProps.tasks.organizationUnitTasks) {
                    //console.log("o day dong 147:=======================")
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
                //console.log("o day dong 159:=======================")

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
            //console.log("goi pie chart o day dong 183:=======================")
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

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        //console.log('chay vao setdataPieChart =======================================')
        const { translate, tasks } = this.props;

        let dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        let listTask;
        if (this.props.TaskOrganizationUnitDashboard) {
            listTask = tasks.organizationUnitTasks;
            //console.log('listTask: ', listTask);
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

        listTask = this.props.TaskOrganizationUnitDashboard ? listTask.tasks : listTask;
        if (listTask) {

            //console.log('ListTasks: =====================\n', listTask)
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
        //console.log(dataPieChart, 'data chart \n\n\n\n')
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
        //console.log('chay vao pie chart =======================================')

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

        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    {
                        TaskOrganizationUnitDashboard &&
                        <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                        </div>
                    }


                    {!TaskOrganizationUnitDashboard &&
                        <section className="form-inline" style={{ textAlign: "right" }}>
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
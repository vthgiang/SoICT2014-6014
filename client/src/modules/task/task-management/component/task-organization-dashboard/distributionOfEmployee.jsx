import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../../super-admin/user/redux/actions';

import { SelectBox, SelectMulti } from '../../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
class DistributionOfEmployee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listNameEmployee: [],
            status: ["Inprocess", "WaitForApproval", "Finished", "Delayed", "Canceled"],
            maxEmployee: 10,
            numOfChart: 10
        }
    }

    shouldComponentUpdate(nextState) {
        if (!this.props.listEmployee) return false;

        else if (nextState.maxEmployee !== this.state.maxEmployee) {
            this.pieChart();
            return true;
        }

        else {
            this.pieChart();
        }
    }

    handleSelectStatus = async (value) => {
        if (value.length === 0) {
            value = ["Inprocess", "WaitForApproval", "Finished", "Delayed", "Canceled"];
        }

        await this.setState(state => {
            return {
                ...state,
                status: value
            }
        });

        this.pieChart();
    }

    handleSelectNumOfEmployee = async (maxEmployee) => {
        let data = await this.getData();
        let dataPieChart = data.taskCount;
        let maxLength = 0;

        for (let i = 0; i < dataPieChart.length; i++) {
            if (dataPieChart[i].length > maxLength) {
                maxLength = dataPieChart[i].length;
            }

        }
        let employeesEachChart;
        let j = 1;
        let rep = true;

        // nếu số nhân viên nhiều thì chia thành nhiều biểu đồ
        while (rep) {
            employeesEachChart = Math.ceil(maxLength / j);
            if (employeesEachChart <= maxEmployee) { // số nhân viên tối đa trong mỗi biểu đồ
                rep = false;
            }
            else j++;
        }
        await this.setState(state => {
            return {
                ...state,
                maxEmployee: maxEmployee,
                numOfChart: j
            }
        })
    }

    filterByStatus(task) {
        let stt = this.state.status;
        for (let i in stt) {
            if (task.status === stt[i]) return true;
        }
    }

    getData = async () => {
        const { tasks } = this.props;
        const { listEmployee } = this.props;
        const { status } = this.state;
        let organizationUnitTasks = tasks.organizationUnitTasks, taskListByStatus;
        let taskListEmployee = [], numOfAccountableTask = [], numOfConsultedTask = [], numOfResponsibleTask = [], numOfInformedTask = [], nameEmployee = [];
        let accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;

        if (status) {
            taskListByStatus = organizationUnitTasks.tasks.filter(task => this.filterByStatus(task))
        }

        for (let i in listEmployee) {
            taskListByStatus && taskListByStatus.map(task => {
                for (let j in task.accountableEmployees)
                    if (listEmployee[i].userId._id == task.accountableEmployees[j])
                        accountableEmployees += 1;
                for (let j in task.consultedEmployees)
                    if (listEmployee[i].userId._id == task.consultedEmployees[j])
                        consultedEmployees += 1;
                for (let j in task.responsibleEmployees)
                    if (listEmployee[i].userId._id == task.responsibleEmployees[j]._id)
                        responsibleEmployees += 1;
                for (let j in task.informedEmployees)
                    if (listEmployee[i].userId._id == task.informedEmployees[j])
                        informedEmployees += 1;
            })
            let employee = {
                infor: listEmployee[i],
                accountableEmployees: accountableEmployees,
                consultedEmployees: consultedEmployees,
                responsibleEmployees: responsibleEmployees,
                informedEmployees: informedEmployees,
            }
            taskListEmployee.push(employee);
            accountableEmployees = 0;
            consultedEmployees = 0;
            responsibleEmployees = 0;
            informedEmployees = 0;
        }
        for (let i in taskListEmployee) {
            numOfAccountableTask.push(taskListEmployee[i].accountableEmployees)
            numOfConsultedTask.push(taskListEmployee[i].consultedEmployees)
            numOfResponsibleTask.push(taskListEmployee[i].responsibleEmployees)
            numOfInformedTask.push(taskListEmployee[i].informedEmployees)
            nameEmployee.push(taskListEmployee[i].infor.userId.name)
        }

        let data = {
            nameEmployee: nameEmployee,
            taskCount: [numOfResponsibleTask, numOfAccountableTask, numOfConsultedTask, numOfInformedTask]
        }

        return data;
    }

    // removePreviosChart = () => {
    //     let chart;
    //     for (let i = 0; i < 10; i++) {
    //         let idChart = 'distribution_chart' + i;
    //         chart = document.getElementById(idChart)
    //         if (chart) { chart.remove() }
    //     }
    // }

    pieChart = async () => {
        const { translate } = this.props;
        let data = await this.getData();
        let dataPieChart = data.taskCount;
        let maxLength = 0;

        for (let i = 0; i < dataPieChart.length; i++) {
            if (dataPieChart[i].length > maxLength) {
                maxLength = dataPieChart[i].length;
            }
        }
        let dataPieChartSlice = [];
        let employeesEachChart;
        let j = 1;
        let rep = true;

        // nếu số nhân viên nhiều thì chia thành nhiều biểu đồ
        while (rep) {
            employeesEachChart = Math.ceil(maxLength / j);
            if (employeesEachChart <= this.state.maxEmployee) { // số nhân viên tối đa trong mỗi biểu đồ
                rep = false;
            }
            else j++;
        }
        let numOfChart = Math.ceil(maxLength / employeesEachChart);
        for (let i = 0; i < numOfChart; i++) {
            let res = dataPieChart[0].slice(employeesEachChart * i, employeesEachChart * (i + 1));
            let acc = dataPieChart[1].slice(employeesEachChart * i, employeesEachChart * (i + 1));
            let con = dataPieChart[2].slice(employeesEachChart * i, employeesEachChart * (i + 1));
            let inf = dataPieChart[3].slice(employeesEachChart * i, employeesEachChart * (i + 1));

            res.unshift(`${translate('task.task_management.responsible_role')}`);
            acc.unshift(`${translate('task.task_management.accountable_role')}`);
            con.unshift(`${translate('task.task_management.consulted_role')}`);
            inf.unshift(`${translate('task.task_management.informed_role')}`);
            dataPieChartSlice[i] = [res, acc, con, inf];

            let nameInChart = data.nameEmployee.slice(employeesEachChart * i, employeesEachChart * (i + 1));
            let nameChart = 'distribution_chart' + i;

            this.chart = c3.generate({
                bindto: document.getElementById(nameChart),
                data: {
                    columns: dataPieChartSlice[i],
                    type: 'bar',
                    groups: [
                        [`${translate('task.task_management.responsible_role')}`,
                        `${translate('task.task_management.accountable_role')}`,
                        `${translate('task.task_management.consulted_role')}`,
                        `${translate('task.task_management.informed_role')}`]
                    ]
                },

                legend: {                             // Ẩn chú thích biểu đồ
                    show: true
                },

                padding: {
                    top: 20,
                    bottom: 20,
                    right: 20,
                    left: 20
                },

                axis: {
                    x: {
                        type: 'category',
                        categories: nameInChart
                    }
                },
                // color: {
                //     pattern: ['#2E66B0', '#FF6508', '#972CA3', '#00E073']
                // }

            });
        }


    }
    render() {
        let { translate } = this.props;
        let idArr = [];
        let numOfChart = this.state.numOfChart;

        for (let i = 0; i < numOfChart; i++) {
            let idName = 'distribution_chart' + i;
            idArr.push(idName);
        }
        return (
            <React.Fragment>
                <section className="form-inline" style={{ textAlign: "right" }}>
                    {/* Chọn trạng thái công việc */}
                    <div className="form-group">
                        <label>{translate('task.task_management.status')}</label>
                        <SelectMulti id="multiSelectStatusInDistribution"
                            items={[
                                { value: "Inprocess", text: translate('task.task_management.inprocess') },
                                { value: "WaitForApproval", text: translate('task.task_management.wait_for_approval') },
                                { value: "Finished", text: translate('task.task_management.finished') },
                                { value: "Delayed", text: translate('task.task_management.delayed') },
                                { value: "Canceled", text: translate('task.task_management.canceled') }
                            ]}
                            onChange={this.handleSelectStatus}
                            options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                        </SelectMulti>
                    </div>
                    {/* Chọn số lượng nhân viên tối đa trong mỗi biểu đồ */}
                    <div className="form-group">
                        <label style={{ width: "200px" }}>{translate('task.task_management.employees_each_chart')}</label>
                        <SelectBox
                            id={`numberOfEmployeeInDistribution`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { text: 5, value: 5 },
                                { text: 10, value: 10 },
                                { text: 20, value: 20 },
                                { text: 30, value: 30 },
                            ]}
                            multiple={false}
                            onChange={this.handleSelectNumOfEmployee}
                            value={10}
                        />
                    </div>
                </section>
                {
                    idArr.map(id => {
                        return <section id={id}></section>
                    })
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, tasks } = state;
    return { user, tasks };
}

const actions = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
};

const connectedDistributionOfEmployee = connect(mapState, actions)(withTranslate(DistributionOfEmployee));
export { connectedDistributionOfEmployee as DistributionOfEmployee };
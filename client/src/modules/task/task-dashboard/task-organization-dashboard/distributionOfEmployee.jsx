import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../super-admin/user/redux/actions';

import { SelectMulti, PaginateBar, DataTableSetting } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

import c3 from 'c3';
import 'c3/c3.css';
class DistributionOfEmployee extends Component {
    constructor(props) {
        super(props);
        this.infoSearch = {
            status: ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"],
        }

        const defaultConfig = { limit: 10 }
        this.distributionOfEmployeeChartId = "distribution-of-employee-chart";
        const distributionOfEmployeeChartPerPage = getTableConfiguration(this.distributionOfEmployeeChartId, defaultConfig).limit;

        this.state = {
            listNameEmployee: [],
            status: this.infoSearch.status,

            type: "forDistributionChart",
            page: 1,
            perPage: distributionOfEmployeeChartPerPage,
        }
    }

    componentDidMount = () => {
        const { unitIds } = this.props;
        const { type, page, perPage } = this.state;

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: perPage
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { user } = this.props;
        const { type, page, perPage } = this.state;

        if (nextProps.user?.employeeForDistributionChart?.loading !== user?.employeeForDistributionChart?.loading) {
            return true
        }

        let data = {
            type: type,
            organizationalUnitIds: nextProps.unitIds,
            page: page,
            perPage: perPage
        }

        if (nextProps.unitIds && !user?.employeeForDistributionChart?.employees && !user?.employeeForDistributionChart?.loading) {
            this.props.getAllEmployeeOfUnitByIds(data);

            return true;
        }

        this.pieChart();
        return true;
    }

    componentDidUpdate = () => {
        this.pieChart();
    }

    handleSelectStatus = async (value) => {
        if (value.length === 0) {
            value = ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"];
        }
        this.infoSearch.status = value;

    }
    handleSearchData = async () => {
        let status = this.infoSearch.status;
        await this.setState(state => {
            return {
                ...state,
                status: status
            }
        });
        this.pieChart();
    }

    filterByStatus(task) {
        let stt = this.state.status;
        for (let i in stt) {
            if (task.status === stt[i]) return true;
        }
    }

    getData = async () => {
        const { tasks, user } = this.props;
        const { status } = this.state;
        let listEmployee;
        let organizationUnitTasks = tasks.organizationUnitTasks, taskListByStatus;
        let taskListEmployee = [], numOfAccountableTask = [], numOfConsultedTask = [], numOfResponsibleTask = [], numOfInformedTask = [], nameEmployee = [];
        let accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;

        if (user) {
            listEmployee = user?.employeeForDistributionChart?.employees;
        }
        if (status) {
            taskListByStatus = organizationUnitTasks?.tasks?.filter(task => this.filterByStatus(task))
        }

        if (listEmployee) {
            for (let i in listEmployee) {
                taskListByStatus && taskListByStatus.map(task => {
                    for (let j in task?.accountableEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id == task?.accountableEmployees?.[j])
                            accountableEmployees += 1;
                    for (let j in task?.consultedEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id == task?.consultedEmployees?.[j])
                            consultedEmployees += 1;
                    for (let j in task?.responsibleEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id == task?.responsibleEmployees?.[j]?._id)
                            responsibleEmployees += 1;
                    for (let j in task?.informedEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id == task?.informedEmployees?.[j])
                            informedEmployees += 1;
                })
                let employee = {
                    infor: listEmployee?.[i],
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
        }

        for (let i in taskListEmployee) {
            numOfAccountableTask.push(taskListEmployee?.[i]?.accountableEmployees)
            numOfConsultedTask.push(taskListEmployee?.[i]?.consultedEmployees)
            numOfResponsibleTask.push(taskListEmployee?.[i]?.responsibleEmployees)
            numOfInformedTask.push(taskListEmployee?.[i]?.informedEmployees)
            nameEmployee.push(taskListEmployee?.[i]?.infor?.userId?.name)
        }

        let data = {
            nameEmployee: nameEmployee,
            taskCount: [numOfResponsibleTask, numOfAccountableTask, numOfConsultedTask, numOfInformedTask]
        }

        return data;
    }

    removePreviousChart() {
        const chart = document.getElementById("distributionChart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    pieChart = async () => {
        this.removePreviousChart();

        const { translate } = this.props;

        let data = await this.getData();
        let dataPieChart = data?.taskCount;
        let dataPieChartSlice = [];
        let res = dataPieChart?.[0];
        let acc = dataPieChart?.[1];
        let con = dataPieChart?.[2];
        let inf = dataPieChart?.[3];

        res.unshift(`${translate('task.task_management.responsible_role')}`);
        acc.unshift(`${translate('task.task_management.accountable_role')}`);
        con.unshift(`${translate('task.task_management.consulted_role')}`);
        inf.unshift(`${translate('task.task_management.informed_role')}`);

        dataPieChartSlice = [res, acc, con, inf];

        let height = data?.nameEmployee?.length * 60;
        let heightOfChart = height > 320 ? height : 320

        this.chart = c3.generate({
            bindto: document.getElementById("distributionChart"),

            data: {
                columns: dataPieChartSlice,
                type: 'bar',
                groups: [
                    [
                        `${translate('task.task_management.consulted_role')}`,
                        `${translate('task.task_management.informed_role')}`,
                        `${translate('task.task_management.responsible_role')}`,
                        `${translate('task.task_management.accountable_role')}`,
                    ]
                ]
            },

            size: {
                height: heightOfChart
            },

            legend: {                             // Ẩn chú thích biểu đồ
                show: true
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    categories: data?.nameEmployee?.length > 0 ? data?.nameEmployee : []
                },
                rotated: true
            },
        });
    }

    handlePaginationDistributionOfEmployeeChart = (page) => {
        const { unitIds } = this.props;
        const { perPage, type } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: page
            }
        })

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: perPage
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    setLimitDistributionOfEmployeeChart = (limit) => {
        const { unitIds } = this.props;
        const { type, page } = this.state;

        this.setState(state => {
            return {
                ...state,
                perPage: limit
            }
        })

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: limit
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    render() {
        const { translate, user, unitIds, selectBoxUnit } = this.props;
        const { startMonthTitle, endMonthTitle } = this.props;
        const { page } = this.state;

        return (
            <React.Fragment>
                <div className="box-header with-border">
                    <div className="box-title">
                        {translate('task.task_management.distribution_Of_Employee')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                        {
                            unitIds && unitIds.length < 2 ?
                                <>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <span>{` ${this.props.getUnitName(selectBoxUnit, unitIds).map(o => o).join(", ")}`}</span>
                                </>
                                :
                                <span onClick={() => this.props.showUnitGeneraTask(selectBoxUnit, unitIds)} style={{ cursor: 'pointer' }}>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitIds && unitIds.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                </span>
                        }
                    </div>
                    <DataTableSetting
                        tableId={this.distributionOfEmployeeChartId}
                        setLimit={this.setLimitDistributionOfEmployeeChart}
                    />
                </div>
                <div className="box-body qlcv">
                    <section className="form-inline" style={{ textAlign: "right" }}>
                        {/* Chọn trạng thái công việc */}
                        <div className="form-group">
                            <label style={{ minWidth: "150px" }}>{translate('task.task_management.task_status')}</label>
                            <SelectMulti id="multiSelectStatusInDistribution"
                                items={[
                                    { value: "inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "finished", text: translate('task.task_management.finished') },
                                    { value: "delayed", text: translate('task.task_management.delayed') },
                                    { value: "canceled", text: translate('task.task_management.canceled') },
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.select_all_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.filter')}</button>
                        </div>
                    </section>

                    {/* Biểu đồ đóng góp */}
                    <section id="distributionChart"></section>

                    <PaginateBar
                        display={user?.employeeForDistributionChart?.employees?.length}
                        total={user?.employeeForDistributionChart?.totalEmployee}
                        pageTotal={user?.employeeForDistributionChart?.totalPage}
                        currentPage={page}
                        func={this.handlePaginationDistributionOfEmployeeChart}
                    />
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, tasks } = state;
    return { user, tasks };
}

const actions = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds
};

const connectedDistributionOfEmployee = connect(mapState, actions)(withTranslate(DistributionOfEmployee));
export { connectedDistributionOfEmployee as DistributionOfEmployee };
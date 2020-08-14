import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../../kpi/evaluation/dashboard/redux/actions';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
class DistributionOfEmployee extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        this.pieChart();

    }

    setDataPieChart = () => {
        let dataPieChart = [
            [3, 5, 5, 1, 0, 4, 3, 2, 1, 2, 2, 3, 5],
            [3, 5, 5, 1, 0, 4, 3, 1, 6, 2, 1, 4, 0],
            [4, 0, 3, 5, 5, 4, 3, 2, 1, 0, 4, 9, 3],
            [9, 3, 5, 5, 1, 0, 4, 3, 2, 5, 8, 3, 5]

        ];
        return dataPieChart;
    }

    // removePreviosChart = () => {
    //     const chart = this.refs.distribution_chart1;
    //     while (chart.hasChildNodes()) {
    //         chart.removeChild(chart.lastChild);
    //     }
    // }

    pieChart = () => {

        // this.removePreviosChart();

        let dataPieChart = this.setDataPieChart();
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
            if (employeesEachChart <= 15) { // số nhân viên tối đa trong mỗi biểu đồ
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
            res.unshift('Thực hiện');
            acc.unshift('Phê duyệt');
            con.unshift('Hỗ trợ');
            inf.unshift('Quan sát');
            dataPieChartSlice[i] = [res, acc, con, inf];

            let nameChart = 'distribution_chart' + i;
            let legend = i === (numOfChart - 1) ? true : false;
            this.chart = c3.generate({
                bindto: document.getElementById(nameChart),
                data: {
                    columns: dataPieChartSlice[i],
                    type: 'bar',
                    groups: [
                        ['Thực hiện', 'Phê duyệt', 'Hỗ trợ', 'Quan sát']
                    ]
                },

                legend: {                             // Ẩn chú thích biểu đồ
                    show: legend
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
                        categories: ['Nguyễn văn An', 'Nguyễn văn Bình', 'Nguyễn văn Cúc', 'Nguyễn văn Danh', 'Nguyễn văn Đức', 'Nguyễn văn Én', 'Nguyễn văn An', 'Nguyễn văn Bình', 'Nguyễn văn Cúc', 'Nguyễn văn Danh', 'Nguyễn văn Đức', 'Nguyễn văn Én', 'Nguyễn văn An', 'Nguyễn văn An', 'Nguyễn văn Bình', 'Nguyễn văn Cúc', 'Nguyễn văn Danh', 'Nguyễn văn Đức', 'Nguyễn văn Én', 'Nguyễn văn Bình', 'Nguyễn văn Cúc', 'Nguyễn văn Danh', 'Nguyễn văn Đức', 'Nguyễn văn Én', 'Phước', 'Giang', 'Hoàng', 'Kha', 'Linh']
                    }
                }
            });
        }


    }
    render() {
        const { tasks, user } = this.props;
        let taskList = tasks && tasks.organizationUnitTasks;

        // let d = document.createElement('div');
        // d.setAttribute('id', 'distributionOfEmployee')
        // for (let i = 0; i < 2; i++) {
        //     let id = 'distribution_chart' + i;
        //     let sec = document.createElement('section');
        //     sec.setAttribute('id', id);
        //     d.appendChild(sec);
        // }
        // console.log(d);
        return (
            <React.Fragment>
                <section id="distribution_chart0"></section>
                <section id="distribution_chart1"></section>
                <section id="distribution_chart2"></section>
                <section id="distribution_chart3"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, tasks } = state;
    return { user, tasks };
}

const actions = {
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getAllTasksByUserIds: taskManagementActions.getAllTasksByUserIds,

    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};

const connectedDistributionOfEmployee = connect(mapState, actions)(withTranslate(DistributionOfEmployee));
export { connectedDistributionOfEmployee as DistributionOfEmployee };
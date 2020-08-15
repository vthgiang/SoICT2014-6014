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
        this.state = {
            listNameEmployee: []
        }
    }
    componentDidMount() {
        if(this.props.listEmployee)
            this.pieChart();

    }

    getData = async () => {
        const { tasks, user } = this.props;
        let taskList = this.props.tasks.organizationUnitTasks, listEmployee;
        let point = [], point1= [], point2=[], point3=[], nameEmployee=[];

        listEmployee = this.props.listEmployee
    
        let accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;
        let taskListEmployee = [];

        for (let i in listEmployee){
            taskList && taskList.tasks.length && taskList.tasks.map(task => {
                for(let j in task.accountableEmployees){
                    if(listEmployee[i].userId._id == task.accountableEmployees[j] )
                    accountableEmployees +=1 ;
                }

                for(let j in task.consultedEmployees)
                     if(listEmployee[i].userId._id == task.consultedEmployees[j] )
                         consultedEmployees +=1 ;
                 for(let j in task.responsibleEmployees)
                     if(listEmployee[i].userId._id == task.responsibleEmployees[j]._id )
                     responsibleEmployees +=1 ;
                 for(let j in task.informedEmployees)
                     if(listEmployee[i].userId._id == task.informedEmployees[j] )
                         informedEmployees +=1 ;
            })
            let employee = {
                infor: listEmployee[i],
                accountableEmployees: accountableEmployees,
                consultedEmployees: consultedEmployees,
                responsibleEmployees : responsibleEmployees,
                informedEmployees: informedEmployees,
            }
            taskListEmployee.push(employee);
            accountableEmployees = 0;
            consultedEmployees = 0;
            responsibleEmployees = 0;
            informedEmployees = 0;
        }
        for (let i in taskListEmployee){
            point.push(taskListEmployee[i].accountableEmployees)
            point1.push(taskListEmployee[i].consultedEmployees)
            point2.push(taskListEmployee[i].responsibleEmployees)
            point3.push(taskListEmployee[i].informedEmployees)
            nameEmployee.push(taskListEmployee[i].infor.userId.name)
        }
        await this.setState (state =>{
            return {
                ...state,
                listNameEmployee: nameEmployee
            }
        })
        let data = {
            nameEmployee: nameEmployee,
            point: [point, point1, point2, point3] 
        }

        return data;
    }

    setDataPieChart = async () => {
        let dataPieChart    

        if(this.props.listEmployee){
            dataPieChart =  await this.getData();
        }

        return dataPieChart.point;
    }

    // removePreviosChart = () => {
    //     const chart = this.refs.distribution_chart1;
    //     while (chart.hasChildNodes()) {
    //         chart.removeChild(chart.lastChild);
    //     }
    // }

    pieChart = async () => {

        // this.removePreviosChart();\
        let data = await this.getData();
        let dataPieChart = await this.setDataPieChart();

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
                        categories: data.nameEmployee
                    }
                }
            });
        }


    }
    render() {
        
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
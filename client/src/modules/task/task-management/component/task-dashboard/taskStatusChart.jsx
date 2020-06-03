import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskStatusChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            userId: localStorage.getItem("userId"),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
        this.props.getAccountableTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
        this.props.getConsultedTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
        this.props.getInformedTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
        this.props.getCreatorTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
            this.props.getAccountableTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
            this.props.getConsultedTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
            this.props.getInformedTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");
            this.props.getCreatorTaskByUser("[]", 1, 100, "[]", 1, 1, "tasks");

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });
            return false
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra tasks đã được bind vào props hay chưa
            if(!nextProps.tasks.tasks) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            });
            return false
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.pieChart();
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            });
        }

        return false
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { tasks } = this.props;
        var listTask, dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        
        if(tasks.tasks) {
            listTask = tasks.tasks;
        };

        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var beginnigOfNextMonth = new Date(currentYear, currentMonth+1);
        var beginningOfMonth = new Date(currentYear, currentMonth);
        
        if(listTask !== undefined) {
            listTask.filter(task => { 
                if(new Date(task.startDate) < beginnigOfNextMonth && new Date(task.startDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) < beginnigOfNextMonth && new Date(task.endDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) >= beginnigOfNextMonth && new Date(task.startDate) < beginningOfMonth){
                    return 1;
                }
                return 0;
            }).map(task => {
                switch(task.status) {
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
            [ "Inprocess", numberOfInprocess ],
            [ "WaitForApproval", numberOfWaitForApproval ],
            [ "Finished", numberOfFinished ],
            [ "Delayed", numberOfDelayed ],
            [ "Canceled", numberOfCanceled ]
        ];

        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        this.removePreviosChart();

        var dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="pieChart"

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type : 'pie',
            },

            legend: {                               // Ẩn chú thích biểu đồ
                show: true
            }
        });
    }

    render() {
        return(
            <React.Fragment>
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
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser
}

const connectedTaskStatusChart = connect(mapState, actions)(TaskStatusChart);
export { connectedTaskStatusChart as TaskStatusChart };
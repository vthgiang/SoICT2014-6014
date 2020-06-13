import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";
import { max } from 'd3-array';

class DomainOfTaskResultsChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        
        this.state = {
            userId: localStorage.getItem("userId"),
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };

        this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
        this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
        this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
        this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
        this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE){
            this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
            this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
            this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
            this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);
            this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra tasks đã được bind vào props hay chưa
            if(!nextProps.tasks.responsibleTasks || !nextProps.tasks.accountableTasks || !nextProps.tasks.consultedTasks || !nextProps.tasks.informedTasks || !nextProps.tasks.creatorTasks) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            });
            return false
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.domainChart();

            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    // Hàm lọc các công việc theo từng tháng
    filterTasksByMonth = (currentMonth, nextMonth) => {
        const { tasks } = this.props;
        var maxResults = [], minResults = [], maxResult, minResult;
        var listTask, listTaskFilter = [], listIdTask = [], responsibleTasks, accountableTasks, consultedTasks, informedTasks, creatorTasks;
        
        var now = new Date();
        var currentYear = now.getFullYear();
        var beginningOfMonth = new Date(currentYear, currentMonth-1);

        if(tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks && tasks.informedTasks && tasks.creatorTasks) {
            responsibleTasks = tasks.responsibleTasks;
            accountableTasks = tasks.accountableTasks;
            consultedTasks = tasks.consultedTasks;
            informedTasks = tasks.informedTasks;
            creatorTasks = tasks.creatorTasks;
        };

        // Lọc các task trùng nhau
        listTask = responsibleTasks.concat(accountableTasks).concat(consultedTasks).concat(informedTasks).concat(creatorTasks);
        listTask.forEach(task => {
            let id = task._id;
            if(!(listIdTask.includes(task._id))) {
                listIdTask.push(task._id)
                listTaskFilter.push(task);
            }
        });

        if(nextMonth === 13){
            beginnigOfNextMonth = new Date(currentYear+1, 0);
        } else {
            var beginnigOfNextMonth = new Date(currentYear, nextMonth);
        }

        if(listTaskFilter !== undefined && listTaskFilter.evaluations !== null && listTaskFilter.evaluations !== null) {
            listTaskFilter.filter(task => { 
                if(new Date(task.startDate) < beginnigOfNextMonth && new Date(task.startDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) < beginnigOfNextMonth && new Date(task.endDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) >= beginnigOfNextMonth && new Date(task.startDate) < beginningOfMonth){
                    return 1;
                }
                return 0;
            }).map(task => {
                task.evaluations.filter(evaluation => {
                    if(new Date(evaluation.date) < beginnigOfNextMonth && new Date(evaluation.date) >= beginningOfMonth){
                        return 1;
                    }
                    return 0;
                }).map(evaluation => {
                    evaluation.results.filter(result => {
                        if(result.employee === this.state.userId){
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

        if(maxResults.length === 0) {
            maxResult = null;
        } else {
            maxResult = Math.max.apply(Math, maxResults);
        }

        if(minResults.length === 0) {
            minResult = null;
        } else {
            minResult = Math.min.apply(Math, minResults);
        }

        return {
            'month': beginningOfMonth,
            'max': maxResult,
            'min': minResult
        }
    }

    setDataDomainChart = () => {
        const { tasks } = this.props;
        var month = ['x'], maxResults = ['Cao nhất'], minResults = ['Thấp nhất'];

        var now = new Date();
        var currentMonth = now.getMonth();

        for(var i = 1; i <= currentMonth+1; i++) {
            var data = this.filterTasksByMonth(i, i+1);
            if(data.max) {
                month.push(data.month);
                maxResults.push(data.max);
                minResults.push(data.min)
            }
        }

        return [
            month,
            maxResults,
            minResults
        ]
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    domainChart = () => {
        this.removePreviosChart();

        var dataChart = this.setDataDomainChart();

        var chart = c3.generate({
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
        return (
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

const connectedDomainOfTaskResultsChart = connect(mapState, actions)(DomainOfTaskResultsChart);
export { connectedDomainOfTaskResultsChart as DomainOfTaskResultsChart }
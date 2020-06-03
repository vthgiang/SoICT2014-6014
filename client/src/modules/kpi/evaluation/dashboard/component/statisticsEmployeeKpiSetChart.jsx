import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class StatisticsEmployeeKpiSetChart extends Component {

    constructor(props) {
        super(props);
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            userId: localStorage.getItem("userId"),
            startMonth: currentYear + '-' + 1,
            endMonth: currentYear + '-' + (currentMonth + 1)
        };
        
        this.props.getAllEmployeeKpiSetByMonth(this.state.userId, this.state.startMonth, this.state.endMonth);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(nextProps.userId !== this.state.userId || nextProps.startMonth !== this.state.startMonth || nextProps.endMonth !== this.state.endMonth) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.NOT_AVAILABLE
                }
            });
            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE){
            // Lấy Kpi của đơn vị hiện tại
            this.props.getAllEmployeeKpiSetByMonth(this.state.userId, this.state.startMonth, this.state.endMonth);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.employeeKpiSetByMonth)
                return false;
            console.log("000", nextProps.createEmployeeKpiSet.employeeKpiSetByMonth)
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.multiLineChart();
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                };
            });
        }

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.userId !== prevState.userId || nextProps.startMonth !== prevState.startMonth || nextProps.endMonth !== prevState.endMonth) {
            return {
                ...prevState,
                userId: nextProps.userId,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth
            }
        } else{
            return null;
        }
    }

    setDataMultiLineChart = () => {
        const { createEmployeeKpiSet } = this.props;
        var listEmployeeKpiSet, dataMultiLineChart, automaticPoint, employeePoint, approvedPoint, date;
        console.log("000", this.props.createEmployeeKpiSet.employeeKpiSetByMonth)
        if(createEmployeeKpiSet) {
            listEmployeeKpiSet = createEmployeeKpiSet.employeeKpiSetByMonth
        }

        if(listEmployeeKpiSet !== null) {
            automaticPoint = ['Hệ thống đánh giá'].concat(listEmployeeKpiSet.map(x => x.automaticPoint));
            
            employeePoint = ['Cá nhân tự đánh giá'].concat(listEmployeeKpiSet.map(x => x.employeePoint));

            approvedPoint = ['Quản lý đánh giá'].concat(listEmployeeKpiSet.map(x => x.approvedPoint));
        
            date = listEmployeeKpiSet.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }

        dataMultiLineChart = [['x'].concat(date), automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart(){
        const chart = this.refs.chart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 
    
    multiLineChart = () => {
        this.removePreviousChart();
console.log("5555-------", this.state.userId, this.state.startMonth, this.state.endMonth)
        var dataMultiLineChart = this.setDataMultiLineChart();
        console.log("00000", dataMultiLineChart)
        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {
                top: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                x: 'x',
                columns: dataMultiLineChart,
                type: 'spline'
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                }
            },

            zoom: {                                 // Cho phép zoom biểu đồ
                enabled: false
            }
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
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}
const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedStatisticsEmployeeKpiSetChart = connect(mapState, actions)(StatisticsEmployeeKpiSetChart);
export { connectedStatisticsEmployeeKpiSetChart as StatisticsEmployeeKpiSetChart };
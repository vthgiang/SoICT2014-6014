import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class StatisticsOfPerformanceResultsChart extends Component {

    constructor(props){
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.today = new Date();

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            month: this.today.getFullYear() + '-' + (this.today.getMonth()+1),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
        this.props.getAllEmployeeKpiSetInOrganizationalUnit(this.state.currentRole, this.state.month);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE){
            // Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
            this.props.getAllEmployeeKpiSetInOrganizationalUnit(this.state.currentRole, this.state.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra currentKPI đã được bind vào props hay chưa
            if(!nextProps.dashboardOrganizationalUnitKpi.employeeKpiSets) {
                return false            // Đang lấy dữ liệu, ko cần render lại
            }

            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.columnChart();

            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    // Lọc và đếm số người có cùng điểm
    filterAndCountEmployeeWithTheSamePoint = (arrayPoint) => {
        var point = Array.from(new Set(arrayPoint));
        var employeeWithTheSamePoints, countEmployeeWithTheSamePoint = [];

        point.sort(function(a, b) {
            return a - b;
        });

        point.map(x => {
            var index = arrayPoint.indexOf(x);
            var theSamePoints = [];

            while(index !== -1) {
                theSamePoints.push(index);
                index = arrayPoint.indexOf(x, index + 1);
            }

            countEmployeeWithTheSamePoint.push(theSamePoints.length);
        })

        point.unshift('x');
        countEmployeeWithTheSamePoint.unshift('Số người cùng điểm');

        employeeWithTheSamePoints = [
            point,
            countEmployeeWithTheSamePoint
        ]

        return employeeWithTheSamePoints;
    }

    // Thiết lập dataChart
    setDataColumnChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listEmployeeKpiSet, automaticPoint = [], employeePoint = [], approvedPoint = [];
        var employeeWithTheSameAutomaticPoints;
        if(dashboardOrganizationalUnitKpi.employeeKpiSets) {
            listEmployeeKpiSet = dashboardOrganizationalUnitKpi.employeeKpiSets
        }

        if(listEmployeeKpiSet) {
            listEmployeeKpiSet.map(kpi => {
                automaticPoint.push(kpi.automaticPoint);
                employeePoint.push(kpi.employeePoint);
                approvedPoint.push(kpi.approvedPoint);
            })
        }

        employeeWithTheSameAutomaticPoints = this.filterAndCountEmployeeWithTheSamePoint(automaticPoint);

        return employeeWithTheSameAutomaticPoints;
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    columnChart = () => {
        this.removePreviosChart();

        var dataChart = this.setDataColumnChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,

            data: {
                x: 'x',
                columns: dataChart,
                type: 'bar'
            },

            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
            },

            axis: {
                x: {
                    label: {
                        text: 'Giá trị điểm hệ thống đánh giá',
                        position: 'outer-center'
                        // inner-right : default
                        // inner-center
                        // inner-left
                        // outer-right
                        // outer-center
                        // outer-left
                    }
                },
                y: {
                    label: {
                        text: 'Số người cùng điểm',
                        position: 'outer-middle'
                        // inner-top : default
                        // inner-middle
                        // inner-bottom
                        // outer-top
                        // outer-middle
                        // outer-bottom
                    }
                }
            },

            legend: {
                show: false
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
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllEmployeeKpiSetInOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiSetInOrganizationalUnit
}

const connectedStatisticsOfPerformanceResultsChart = connect(mapState, actions)(StatisticsOfPerformanceResultsChart);
export { connectedStatisticsOfPerformanceResultsChart as StatisticsOfPerformanceResultsChart }
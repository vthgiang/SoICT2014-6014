import React, { Component } from 'react';

import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class StatisticsOfOrganizationalUnitKpiResultsChart extends Component {

    constructor(props){
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3};
        
        this.today = new Date();

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            month: this.today.getFullYear() + '-' + (this.today.getMonth()+1),
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC
        };

        // Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
        this.props.getAllEmployeeKpiSetInOrganizationalUnit(this.state.currentRole, this.state.month);
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextState.kindOfPoint !== this.state.kindOfPoint) {
            await this.setState(state =>{
                return {
                    ...state,
                    kindOfPoint: nextState.kindOfPoint,
                };
            });
            
            this.columnChart();
        }

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

    handleSelectKindOfPoint = (value) => {
        if(Number(value) !== this.state.kindOfPoint) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: Number(value)
                }
            })
        }
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
        var employeeWithTheSamePoints, textLabel;
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

        // Lấy dữ liệu các loại điểm mà this.state.kindOfPoint có
        if(this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(automaticPoint);
            textLabel = 'Giá trị điểm hệ thống đánh giá';
        } else if(this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(employeePoint);
            textLabel = 'Giá trị điểm cá nhân tự đánh giá';
        } else if(this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(approvedPoint);
            textLabel = 'Giá trị điểm quản lý đánh giá';
        }
        
        
        return {
            'employeeWithTheSamePoints': employeeWithTheSamePoints,
            'textLabel': textLabel
        };
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    columnChart = () => {
        this.removePreviosChart();

        var dataPoints, dataChart, textLabel;

        dataPoints = this.setDataColumnChart();
        dataChart = dataPoints.employeeWithTheSamePoints;
        textLabel = dataPoints.textLabel;

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },
            
            data: {
                x: 'x',
                columns: dataChart,
                type: 'bar'
            },

            bar: {
                width: {
                    ratio: 0.1
                }
            },

            axis: {
                x: {
                    label: {
                        text: textLabel,
                        position: 'outer-center',
                        // inner-right : default
                        // inner-center
                        // inner-left
                        // outer-right
                        // outer-center
                        // outer-left
                    },
                    padding: {
                        right: 10,
                        left: 10
                    }
                },
                y: {
                    label: {
                        text: 'Số người cùng điểm',
                        position: 'outer-middle',
                        // inner-top : default
                        // inner-middle
                        // inner-bottom
                        // outer-top
                        // outer-middle
                        // outer-bottom
                    },
                    padding: {
                        right: 10,
                        left: 10
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
                <div className="box-body" style={{ textAlign: "right" }}>
                    <div className="btn-group">
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.AUTOMATIC)}>Automatic Point</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.EMPLOYEE)}>Employee Point</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.APPROVED)}>Approved Point</button>
                    </div>

                    <section ref="chart"></section>
                </div>
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

const connectedStatisticsOfOrganizationalUnitKpiResultsChart = connect(mapState, actions)(StatisticsOfOrganizationalUnitKpiResultsChart);
export { connectedStatisticsOfOrganizationalUnitKpiResultsChart as StatisticsOfOrganizationalUnitKpiResultsChart }
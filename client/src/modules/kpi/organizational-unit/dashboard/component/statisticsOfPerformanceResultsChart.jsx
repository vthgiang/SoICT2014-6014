import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class StatisticsOfPerformanceResultsChart extends Component {

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
        this.setState(state => {
            return {
                ...state,
                kindOfPoint: Number(value[0])
            }
        })
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

        if(this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(automaticPoint);
            textLabel = 'Giá trị điểm hệ thống đánh giá'
        } else if(this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(employeePoint);
            textLabel = 'Giá trị điểm cá nhân tự đánh giá'
        } else if(this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(approvedPoint);
            textLabel = 'Giá trị điểm quản lý đánh giá'
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
                        position: 'outer-center'
                        // inner-right : default
                        // inner-center
                        // inner-left
                        // outer-right
                        // outer-center
                        // outer-left
                    },
                    max: 100,
                    min: 0,
                    padding: {
                        right: 10,
                        left: 10
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
        var kindOfPoint;

        kindOfPoint = [
            {
                text: 'Automatic Point',
                value: 1
            },
            {
                text: 'Employee Point',
                value: 2
            },
            {
                text: 'Approved Point',
                value: 3
            }
        ];

        return (
            <React.Fragment>
                <div ref="chart"></div>
                <div className='box-tools pull-right'>
                    <button type="button" data-toggle="collapse" data-target="#kind-point-statistics-of-performance" className="pull-right" style={{ border: "none", background: "none", padding: "5px" }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                    <div id="kind-point-statistics-of-performance" className="box collapse setting-table">
                        <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>

                        <div className = "form-group">
                            <label>Loại điểm</label>
                            <SelectBox
                                id={`kindOfPointStatisticsOfPerformance`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={kindOfPoint}
                                multiple={false}
                                onChange={this.handleSelectKindOfPoint}
                                value={kindOfPoint[0].value}
                            />
                        </div> 
                    </div>
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

const connectedStatisticsOfPerformanceResultsChart = connect(mapState, actions)(StatisticsOfPerformanceResultsChart);
export { connectedStatisticsOfPerformanceResultsChart as StatisticsOfPerformanceResultsChart }
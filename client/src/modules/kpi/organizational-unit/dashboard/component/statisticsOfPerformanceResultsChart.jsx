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
        this.KIND_OF_POINT_SELECTBOX = [
            {
                text: 'Automatic Point',
                value: this.KIND_OF_POINT.AUTOMATIC
            },
            {
                text: 'Employee Point',
                value: this.KIND_OF_POINT.EMPLOYEE
            },
            {
                text: 'Approved Point',
                value: this.KIND_OF_POINT.APPROVED
            }
        ];
        this.today = new Date();

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            month: this.today.getFullYear() + '-' + (this.today.getMonth()+1),
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: [this.KIND_OF_POINT.AUTOMATIC],
            pointName: [this.KIND_OF_POINT_SELECTBOX[0].text]
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
        var pointName = []; 
        value.map(x => {
            this.KIND_OF_POINT_SELECTBOX.filter(kind => kind.value === Number(x)).map(kind => { pointName.push(kind.text) });
        })
        value = value.map(x => Number(x));

        this.setState(state => {
            return {
                ...state,
                kindOfPoint: value,
                pointName: pointName
            }
        })
    }

    // Lọc và đếm số người có cùng điểm
    filterAndCountEmployeeWithTheSamePoint = (arrayPoint, namePoint) => {
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

        point.unshift(namePoint + ' X');
        countEmployeeWithTheSamePoint.unshift(namePoint);

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
        var employeeWithTheSamePoints = [], xs = {};
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
        for(let i=0; i<this.state.kindOfPoint.length; i++) {
            if(this.state.kindOfPoint[i] === this.KIND_OF_POINT.AUTOMATIC) {
                employeeWithTheSamePoints = employeeWithTheSamePoints.concat(this.filterAndCountEmployeeWithTheSamePoint(automaticPoint, "Hệ thống đánh giá"));

                var xsTemporary = {};
                xsTemporary[employeeWithTheSamePoints[i*2+1][0]] = employeeWithTheSamePoints[i*2][0];
                xs = Object.assign(xs, xsTemporary);
            } else if(this.state.kindOfPoint[i] === this.KIND_OF_POINT.EMPLOYEE) {
                employeeWithTheSamePoints = employeeWithTheSamePoints.concat(this.filterAndCountEmployeeWithTheSamePoint(employeePoint, "Cá nhân tự đánh giá"));

                var xsTemporary = {};
                xsTemporary[employeeWithTheSamePoints[i*2+1][0]] = employeeWithTheSamePoints[i*2][0];
                xs = Object.assign(xs, xsTemporary);
            } else if(this.state.kindOfPoint[i] === this.KIND_OF_POINT.APPROVED) {
                employeeWithTheSamePoints = employeeWithTheSamePoints.concat(this.filterAndCountEmployeeWithTheSamePoint(approvedPoint, "Quản lý đánh giá"));

                var xsTemporary = {};
                xsTemporary[employeeWithTheSamePoints[i*2+1][0]] = employeeWithTheSamePoints[i*2][0];
                xs = Object.assign(xs, xsTemporary);
            }
        }
        
        return {
            'employeeWithTheSamePoints': employeeWithTheSamePoints,
            'xs': xs
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

        var dataPoints, dataChart, xs;

        dataPoints = this.setDataColumnChart();
        dataChart = dataPoints.employeeWithTheSamePoints;
        xs = dataPoints.xs;

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },
            
            data: {
                xs: xs,
                columns: dataChart,
                type: 'bar'
            },

            bar: {
                width: {
                    width : 1
                }
            },

            axis: {
                x: {
                    label: {
                        text: 'Giá trị điểm',
                        position: 'outer-center'
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
            }
        })
    }

    createSpanLable = () => {
        var i = 0, span = [];
        while(i<this.state.pointName.length) {
            span.push(<span className='label label-danger'>{this.state.pointName[i]}</span>);
            i++;
        }

        return span;
    }

    render() {
        return (
            <React.Fragment>
                <div className="box-body dashboard_box_body">
                    <div  style={{textAlign: "right"}}>
                        {this.createSpanLable()}

                        <button type="button" data-toggle="collapse" data-target="#kind-point-statistics-of-performance" style={{ border: "none", background: "none", padding: "5px" }}><i className="fa fa-gear" style={{ fontSize: "15px" }}></i></button>
                        <div id="kind-point-statistics-of-performance" className="box collapse setting-table">
                            <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>

                            <div className = "form-group">
                                <label>Loại điểm</label>
                                <SelectBox
                                    id={`kindOfPointStatisticsOfPerformance`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={this.KIND_OF_POINT_SELECTBOX}
                                    multiple={true}
                                    onChange={this.handleSelectKindOfPoint}
                                    value={[this.KIND_OF_POINT_SELECTBOX[0].value]}
                                />
                            </div> 
                        </div>
                    </div>
                    <div ref="chart"></div>
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
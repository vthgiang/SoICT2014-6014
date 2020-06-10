import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskPerformanceResultsOfOrganizationalUnitChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3};

        this.state = {
            userRoleId: localStorage.getItem("currentRole"),
            year: new Date().getFullYear(),
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC
        };

        this.props.getAllOrganizationalUnitKpiSetEachYearOfChildUnit(this.state.userRoleId, this.state.year);
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextState.kindOfPoint !== this.state.kindOfPoint) {
            await this.setState(state =>{
                return {
                    ...state,
                    kindOfPoint: nextState.kindOfPoint,
                };
            });
            
            this.multiLineChart();
        }

        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy tập KPI đơn vị theo từng năm
            this.props.getAllOrganizationalUnitKpiSetEachYearOfChildUnit(this.state.userRoleId, this.state.year)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetEachYearOfChildUnit) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            
            this.multiLineChart();
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
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

    filterAndSetDataPoint = (arrayPoint) => {
        var dateAxisX = [], point = [];

        dateAxisX.push('date-' + arrayPoint[0].name);
        point.push(arrayPoint[0].name);

        for(let i=1; i<arrayPoint.length; i++) {
            let newDate = new Date(arrayPoint[i].date);
            newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);

            dateAxisX.push(newDate);

            if(this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
                point.push(arrayPoint[i].automaticPoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
                point.push(arrayPoint[i].employeePoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
                point.push(arrayPoint[i].automaticPoint);
            }
        }

        return [
            dateAxisX,
            point
        ]
    }

    setDataMultiLineChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var organizationalUnitKpiSetEachYearOfChildUnit, point = [];

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSetEachYearOfChildUnit) {
            organizationalUnitKpiSetEachYearOfChildUnit = dashboardOrganizationalUnitKpi.organizationalUnitKpiSetEachYearOfChildUnit;
        }

        if(organizationalUnitKpiSetEachYearOfChildUnit) {
            for(let i=0; i<organizationalUnitKpiSetEachYearOfChildUnit.length; i++) {
                point = point.concat(this.filterAndSetDataPoint(organizationalUnitKpiSetEachYearOfChildUnit[i]));
            }
        }

        return point
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {
        this.removePreviosChart();
        
        var dataChart, xs = {};

        dataChart = this.setDataMultiLineChart();
        
        for(let i=0; i<dataChart.length; i=i+2) {
            let temporary = {};
            temporary[dataChart[i+1][0]] = dataChart[i][0]; 
            xs = Object.assign(xs, temporary);
        }

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                xs: xs,
                columns: dataChart,
                type: 'spline'
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
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

    preventDefault = (event) => {
        // event.preventDefault();
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
                <div className='box-tools pull-right'>
                    <button type="button" data-toggle="collapse" data-target="#kind-point-task-performance" className="pull-right" style={{ border: "none", background: "none", padding: "5px" }}><i className="fa fa-gear" style={{ fontSize: "19px" }} onClick={this.preventDefault()}></i></button>
                    <div id="kind-point-task-performance" className="box collapse setting-table">
                        <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>

                        <div className = "form-group">
                            <label>Loại điểm</label>
                            <SelectBox
                                id={`kindOfPointTaskPerformance`}
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
    getAllOrganizationalUnitKpiSetEachYearOfChildUnit: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetEachYearOfChildUnit
}

const connectedTaskPerformanceResultsOfOrganizationalUnitChart = connect(mapState, actions)(TaskPerformanceResultsOfOrganizationalUnitChart);
export { connectedTaskPerformanceResultsOfOrganizationalUnitChart as TaskPerformanceResultsOfOrganizationalUnitChart };
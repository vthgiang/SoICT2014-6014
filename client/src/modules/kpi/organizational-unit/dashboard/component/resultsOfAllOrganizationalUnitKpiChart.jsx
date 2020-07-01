import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfAllOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3};

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        this.state = {
            userRoleId: localStorage.getItem("currentRole"),
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2),
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC
        };

        this.props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(this.state.userRoleId, this.state.startDate, this.state.endDate);
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
            this.props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(this.state.userRoleId, this.state.startDate, this.state.endDate)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit) {
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
        if(Number(value) !== this.state.kindOfPoint) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: Number(value)
                }
            })
        }
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
        var organizationalUnitKpiSetsOfChildUnit, point = [];

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit) {
            organizationalUnitKpiSetsOfChildUnit = dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit;
        }

        if(organizationalUnitKpiSetsOfChildUnit) {
            for(let i=0; i<organizationalUnitKpiSetsOfChildUnit.length; i++) {
                point = point.concat(this.filterAndSetDataPoint(organizationalUnitKpiSetsOfChildUnit[i]));
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

    render() {
        return (
            <React.Fragment>
                <div className="box-body" style={{textAlign: "right"}}>
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
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit
}

const connectedResultsOfAllOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfAllOrganizationalUnitKpiChart);
export { connectedResultsOfAllOrganizationalUnitKpiChart as ResultsOfAllOrganizationalUnitKpiChart };